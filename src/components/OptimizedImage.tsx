import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * Optimized Image component with lazy loading and proper dimensions
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className = '',
  ...props
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      {...props}
    />
  );
}

interface PictureProps {
  src: string;
  alt: string;
  sources?: Array<{
    srcSet: string;
    type: string;
    media?: string;
  }>;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Picture component with multiple source formats for better optimization
 */
export function OptimizedPicture({
  src,
  alt,
  sources = [],
  width,
  height,
  className = '',
}: PictureProps) {
  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          type={source.type}
          media={source.media}
        />
      ))}
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </picture>
  );
}
