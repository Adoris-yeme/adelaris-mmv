interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSize?: number;
  quality?: number;
}

export const compressImage = (file: File, options: CompressImageOptions = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { maxWidth = 800, maxHeight = 800, maxSize, quality = 0.8 } = options;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (loadEvent) => {
      const originalDataUrl = loadEvent.target?.result as string;
      if (!originalDataUrl) return reject('Error reading file.');

      const img = new Image();
      img.src = originalDataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("Cannot process image.");

        let { width, height } = img;
        
        if (maxSize) {
            width = maxSize;
            height = maxSize;
        } else {
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject("Cannot load image.");
    };
    reader.onerror = () => reject('Error reading file.');
  });
};
