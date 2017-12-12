export type ImageType = 'image/png' | 'image/jpeg' | 'image/jpg';

export function canvasBuffer(nativeImage, canvas: HTMLCanvasElement, type: ImageType = 'image/png', quality: number = .9) {
  const data = canvas.toDataURL(type, quality);
  const img = typeof nativeImage.createFromDataURL === 'function'
    ? nativeImage.createFromDataURL(data)
    : nativeImage.createFromDataUrl(data);
  if (/^image\/jpe?g$/.test(type)) {
    return img.toJpeg(Math.floor(quality * 100));
  } else {
    return img.toPng();
  }
}
