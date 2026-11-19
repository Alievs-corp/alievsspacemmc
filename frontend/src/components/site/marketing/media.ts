/** Helpers for gallery video links: YouTube/Vimeo become embeds, anything else is a plain file. */

export interface VideoSource {
  kind: 'embed' | 'file';
  src: string;
  /** Thumbnail for the grid when the editor did not upload a cover. */
  thumb?: string;
}

export function videoSource(url: string): VideoSource {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    let yt = '';
    if (host === 'youtu.be') yt = u.pathname.slice(1);
    else if (host === 'youtube.com' || host === 'm.youtube.com') {
      yt = u.searchParams.get('v') || u.pathname.match(/\/(?:embed|shorts)\/([\w-]+)/)?.[1] || '';
    }
    if (yt) {
      return {
        kind: 'embed',
        src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`,
        thumb: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
      };
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = u.pathname.match(/(\d{5,})/)?.[1];
      if (id) return { kind: 'embed', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }
  } catch {
    /* not a URL: treat as a file path */
  }
  return { kind: 'file', src: url };
}
