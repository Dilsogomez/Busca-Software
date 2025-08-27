import React from 'react';
import type { NewsArticle } from '../types';

interface NewsCardProps {
    article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
    
    /**
     * Handles image loading errors by replacing the source with a placeholder image.
     * This ensures a consistent user experience even if an image URL is broken.
     */
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://via.placeholder.com/400x225/e2e8f0/94a3b8?text=Imagem+Indispon%C3%ADvel';
    };

    return (
        <a 
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            <img
                src={article.imageUrl}
                alt={article.title}
                // The image covers its container, has a subtle zoom on hover, and a fallback for broken links.
                // The parent `<a>` tag has `overflow-hidden` to contain the zoom effect.
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                onError={handleImageError}
            />
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {article.category}
                    </span>
                     <span className="text-xs text-gray-500">{article.source}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-gray-700">
                    {article.title}
                </h3>
                <p className="text-sm text-gray-600 flex-grow mb-4">
                    {article.summary}
                </p>
                <div className="mt-auto text-sm font-semibold text-gray-800 group-hover:underline">
                    Ler mais →
                </div>
            </div>
        </a>
    );
};

export const NewsCardSkeleton: React.FC = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-center mb-2">
                 <div className="h-5 w-24 bg-gray-200 rounded"></div>
                 <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="space-y-2 flex-grow mb-4">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="mt-auto h-4 w-1/3 bg-gray-200 rounded"></div>
        </div>
    </div>
);
