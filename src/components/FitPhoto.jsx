import { useState, useEffect } from 'react';

const FitPhoto = ({ src, alt, containerWidth = 300, containerHeight = 300 }) => {
  const [imgStyle, setImgStyle] = useState({});

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const imgRatio = img.width / img.height;
      const containerRatio = containerWidth / containerHeight;

      if (imgRatio >= containerRatio) {
        // Широкое фото
        setImgStyle({ width: 'auto', height: '100%', objectFit: 'cover' });
      } else {
        // Высокое фото
        setImgStyle({ width: '100%', height: 'auto', objectFit: 'cover' });
      }
    };
  }, [src, containerWidth, containerHeight]);

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          ...imgStyle,
          display: 'block',
          maxWidth: 'none',
          maxHeight: 'none',
        }}
      />
    </div>
  );
};

export default FitPhoto;