import React, { useState } from 'react';

export interface OptimizedMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio?: string;
  avifSrc?: string;
  webpSrc?: string;
  isLcpCandidate?: boolean;
  className?: string;
  containerClassName?: string;
}

/**
 * Enterprise Core Web Vitals Optimized Image Component.
 * - Eliminates CLS (Cumulative Layout Shift) by enforcing fixed aspect-ratio / dimensions.
 * - Serves next-gen image formats (AVIF, WebP) with graceful fallback.
 * - Uses native browser lazy loading by default, or high-priority eager fetch for LCP hero images.
 * - Provides smooth skeleton shimmer during download.
 */
export const OptimizedMedia: React.FC<OptimizedMediaProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  avifSrc,
  webpSrc,
  isLcpCandidate = false,
  className = '',
  containerClassName = '',
  style,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const computedAspectRatio = aspectRatio || `${width} / ${height}`;

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900/60 ${containerClassName}`}
      style={{
        aspectRatio: computedAspectRatio,
        width: typeof width === 'number' ? `${width}px` : width,
        maxWidth: '100%'
      }}
    >
      {/* Visual placeholder shimmer to prevent content jumps */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700/60 dark:to-slate-800 pointer-events-none"
          aria-hidden="true"
        />
      )}

      <picture>
        {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={isLcpCandidate ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={isLcpCandidate ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            aspectRatio: computedAspectRatio,
            ...style
          }}
          {...rest}
        />
      </picture>
    </div>
  );
};
