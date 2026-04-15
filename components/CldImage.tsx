import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { AdvancedImage } from 'cloudinary-react-native';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { cld } from '@/utils/cloudinary';

interface CldImageProps {
  publicId: string;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const CldImage = ({ publicId, width = 500, height = 500, style }: CldImageProps) => {
  // Determine if it's a full URL or just a publicId
  const isFullUrl = publicId.startsWith('http');
  
  if (isFullUrl) {
    // If it's a full URL, we might want to extract the publicId or just use it as is.
    // Cloudinary's AdvancedImage usually works best with publicIds for transformations.
    // For now, let's assume if it's a full URL, we strip the base part if it's from our cloud.
    // But for simplicity, if it's a full URL, we might want to use a standard Image.
    // However, the user wants the Cloudinary experience.
  }

  const myImage = cld
    .image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(width).height(height));

  return (
    <View style={style} className="overflow-hidden">
      <AdvancedImage 
        cldImg={myImage} 
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
};

export default CldImage;
