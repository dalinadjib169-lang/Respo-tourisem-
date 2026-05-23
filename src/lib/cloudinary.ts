export const uploadToCloudinary = async (file: File) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'doaxziqm7';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'doctor_zaara_preset'; 

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Cloudinary Response Error:', response.status, errorText);
      throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.warn('Cloudinary upload error, falling back to local Base64 storage:', error);
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
};
