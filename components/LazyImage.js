import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const LazyImage = ({ src, alt, width, height, className, style, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); 
      }
    });

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} style={{ minHeight: height, ...style }}>
      {isVisible && (
        <Image 
          src={src} 
          alt={alt} 
          width={width} 
          height={height} 
          loading="lazy" 
          className={className} 
          onClick={onClick}
          unoptimized
        />
      )}
    </div>
  );
};

export default LazyImage;
