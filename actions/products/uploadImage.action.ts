import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/duuqtyv0u/image/upload';
const UPLOAD_PRESET = 'ecommerce';

export const uploadImageToCloudinary = async (uri: string) => {
  try {
    const formData = new FormData();
    
    // In React Native, we need to handle the file object correctly for FormData
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);
    
    formData.append('upload_preset', UPLOAD_PRESET);

    const { data } = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.public_id;
  } catch (error: any) {
    console.log('Error uploading to Cloudinary:', error.response?.data || error.message);
    throw 'Error al subir la imagen a la nube';
  }
};
