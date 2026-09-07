import Api from '../lib/api';

export async function compressImageFile(
  file: File | string,
  maxDimension = 1920,
  quality = 0.84
): Promise<{ file: File; dataUrl: string }> {
  if (typeof file === 'string') {
    // If it's already a URL or base64
    return { file: null as any, dataUrl: file };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Downscale while retaining high resolution (max dimension 1920px)
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas context'));
        }

        // Use high quality image smoothing algorithms
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP (or JPEG fallback) at 84% quality
        const outputMime = 'image/webp';
        const dataUrl = canvas.toDataURL(outputMime, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas blob conversion failed'));
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: outputMime,
              lastModified: Date.now(),
            });
            resolve({ file: compressedFile, dataUrl });
          },
          outputMime,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}


/**
 * Uploads compressed image file to backend API which securely signs & stores it on Cloudinary.
 * Uses shared Api client instance for automatic auth interceptors, base URL resolution, and error handling.
 */
export async function uploadToCloudinary(
  fileOrBase64: File | string
): Promise<string> {
  let fileToUpload: File | string = fileOrBase64;

  // Compress in browser if it's a File object
  if (fileOrBase64 instanceof File) {
    const compressed = await compressImageFile(fileOrBase64);
    fileToUpload = compressed.file;
  }

  const formData = new FormData();
  formData.append('file', fileToUpload);

  const data = await Api.post<{ url?: string; secure_url?: string }>('/upload/cloudinary', formData);
  if (!data?.url && !data?.secure_url) {
    throw new Error('Failed to upload image via backend API');
  }

  return data.secure_url || data.url!;
}
