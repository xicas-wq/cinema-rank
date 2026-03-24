'use client';

import { useState } from 'react';

interface PosterImageProps {
  posterPath: string | null;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { tmdb: 'w185', icon: 'text-lg', titleSize: 'text-[8px]' },
  md: { tmdb: 'w342', icon: 'text-2xl', titleSize: 'text-[10px]' },
  lg: { tmdb: 'w500', icon: 'text-4xl', titleSize: 'text-xs' },
  xl: { tmdb: 'w780', icon: 'text-5xl', titleSize: 'text-sm' },
};

export default function PosterImage({ posterPath, title, size = 'md', className = '' }: PosterImageProps) {
  const [hasError, setHasError] = useState(false);
  const config = sizeMap[size];

  if (!posterPath || hasError) {
    return (
      <div className={`poster-fallback w-full h-full ${className}`}>
        <div className="flex flex-col items-center justify-center gap-1 relative z-10">
          <svg
            className={`${config.icon} text-[#8b8ba3] opacity-30`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            width="1em"
            height="1em"
          >
            <path d="M15.6 11.6L14 10l-3.5 4.5-2.5-3L5 16h14l-3.4-4.4z" fill="currentColor" opacity="0.3" />
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" opacity="0.3" />
          </svg>
          <span className={`${config.titleSize} text-[#8b8ba3] opacity-40 text-center px-2 leading-tight max-w-full truncate`}>
            {title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={`https://image.tmdb.org/t/p/${config.tmdb}${posterPath}`}
      alt={title}
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
