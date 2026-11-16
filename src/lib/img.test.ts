import { photoSrcSet } from './img';

describe('photoSrcSet', () => {
  it('adds a 400px copy for site photos', () => {
    expect(photoSrcSet('/photos/tbilisi/bridge.jpg')).toBe(
      '/photos/tbilisi/bridge-400.jpg 400w, /photos/tbilisi/bridge.jpg 760w',
    );
  });

  it('skips user blobs and other images', () => {
    expect(photoSrcSet('blob:abc')).toBeUndefined();
    expect(photoSrcSet(undefined)).toBeUndefined();
  });
});
