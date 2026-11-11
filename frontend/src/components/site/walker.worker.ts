/**
 * Decodes one walk frame and scales it to the walker's canvas size, off the
 * main thread. Replies with the ImageBitmap (transferred), or null on failure.
 */
interface DecodeRequest {
  blob: Blob;
  /** Target size in canvas pixels; 0 keeps the frame's own size. */
  w: number;
  h: number;
}

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<DecodeRequest>) => void) | null;
  postMessage: (message: ImageBitmap | null, transfer?: Transferable[]) => void;
};

scope.onmessage = async (e) => {
  const { blob, w, h } = e.data;
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await (w
      ? createImageBitmap(blob, { resizeWidth: w, resizeHeight: h, resizeQuality: 'high' })
      : createImageBitmap(blob));
  } catch {
    try {
      // Engines without the resize options still decode; the canvas scales instead.
      bitmap = await createImageBitmap(blob);
    } catch {
      bitmap = null;
    }
  }
  if (bitmap) scope.postMessage(bitmap, [bitmap]);
  else scope.postMessage(null);
};
