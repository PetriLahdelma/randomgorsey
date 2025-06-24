export function isWebMSupported(): boolean {
  if (typeof document === 'undefined') return false;
  const video = document.createElement('video');
  return video.canPlayType('video/webm') !== '';
}
