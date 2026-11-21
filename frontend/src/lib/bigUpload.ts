/**
 * Browser side of the large-file upload (videos up to 1000 GB).
 *
 * The file is cut into parts that go straight to object storage through
 * short-lived signed URLs, several at a time, each retried on failure. The API
 * only starts, signs and completes the upload, so the file never passes through it.
 */

/** Files above this size use the part-by-part route; smaller ones use one request. */
export const BIG_UPLOAD_THRESHOLD = 64 * 1024 * 1024;

const PARALLEL = 4;
const RETRIES = 4;
const URL_BATCH = 50;

type Call = <T>(path: string, body: unknown) => Promise<T>;

interface InitResult {
  uploadId: string;
  key: string;
  partSize: number;
  partCount: number;
}

export interface BigUploadOptions {
  folder?: string;
  isPublic?: boolean;
  onProgress?: (fraction: number) => void;
  signal?: AbortSignal;
}

function putPart(url: string, blob: Blob, onBytes: (loaded: number) => void, signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.upload.onprogress = (e) => onBytes(e.loaded);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const etag = xhr.getResponseHeader('ETag');
        if (etag) resolve(etag);
        else reject(new Error('Storage did not return an ETag (check the bucket CORS rule)'));
      } else {
        reject(new Error(`Storage error ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error while uploading'));
    xhr.onabort = () => reject(new DOMException('Upload cancelled', 'AbortError'));
    signal?.addEventListener('abort', () => xhr.abort(), { once: true });
    xhr.send(blob);
  });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Uploads `file` and returns its public URL (or storage key for private files). */
export async function bigUpload(call: Call, file: File, opts: BigUploadOptions = {}): Promise<{ url: string; filename: string; size: number }> {
  const { folder, isPublic = true, onProgress, signal } = opts;
  const init = await call<InitResult>('/admin/upload/multipart/init', { filename: file.name, size: file.size, folder, public: isPublic });
  const { uploadId, key, partSize, partCount } = init;

  const loaded = new Array<number>(partCount).fill(0);
  const report = () => onProgress?.(Math.min(1, loaded.reduce((a, b) => a + b, 0) / file.size));
  const etags: Array<{ partNumber: number; etag: string }> = [];
  const urls = new Map<number, string>();

  // One signing request per batch of parts, shared by every worker that needs it.
  const batches = new Map<number, Promise<void>>();
  const ensureUrl = (n: number): Promise<void> => {
    if (urls.has(n)) return Promise.resolve();
    const from = Math.floor((n - 1) / URL_BATCH) * URL_BATCH + 1;
    let pending = batches.get(from);
    if (!pending) {
      const numbers: number[] = [];
      for (let i = from; i <= Math.min(partCount, from + URL_BATCH - 1); i++) numbers.push(i);
      pending = call<{ urls: Record<string, string> }>('/admin/upload/multipart/urls', { key, uploadId, partNumbers: numbers })
        .then((res) => {
          for (const [k, u] of Object.entries(res.urls)) urls.set(Number(k), u);
        })
        .finally(() => batches.delete(from));
      batches.set(from, pending);
    }
    return pending;
  };

  let next = 1;
  const worker = async () => {
    while (next <= partCount) {
      if (signal?.aborted) throw new DOMException('Upload cancelled', 'AbortError');
      const n = next++;
      const blob = file.slice((n - 1) * partSize, Math.min(file.size, n * partSize));
      let attempt = 0;
      for (;;) {
        try {
          await ensureUrl(n);
          const etag = await putPart(urls.get(n)!, blob, (b) => { loaded[n - 1] = b; report(); }, signal);
          loaded[n - 1] = blob.size;
          report();
          etags.push({ partNumber: n, etag });
          break;
        } catch (err) {
          if ((err as Error).name === 'AbortError' || ++attempt >= RETRIES) throw err;
          loaded[n - 1] = 0;
          urls.delete(n); // a fresh signature on the retry
          await wait(1000 * 2 ** attempt);
        }
      }
    }
  };

  try {
    await Promise.all(Array.from({ length: Math.min(PARALLEL, partCount) }, worker));
    const done = await call<{ url: string }>('/admin/upload/multipart/complete', { key, uploadId, parts: etags, public: isPublic });
    onProgress?.(1);
    return { url: done.url, filename: file.name, size: file.size };
  } catch (err) {
    // Best effort: free the parts already stored so they do not linger and cost space.
    call('/admin/upload/multipart/abort', { key, uploadId }).catch(() => undefined);
    throw err;
  }
}
