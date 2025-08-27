import React from 'react';
import type { Software } from '../types';
import { Icon } from './Icon';
import { StarRating } from './StarRating';

interface SoftwareCardProps {
    software: Software;
    index: number;
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({ software, index }) => {
    const animationDelay = { animationDelay: `${index * 50}ms` };
    
    return (
        <div
            className="group bg-white border border-gray-200 rounded-lg p-6 flex flex-col shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 animate-fade-in-up"
            style={animationDelay}
        >
            <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center mr-4 bg-gray-50">
                   <Icon iconName={software.iconClass || 'default'} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{software.name}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">{software.description}</p>
            
            {software.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <StarRating rating={software.rating} />
                    <span className="text-xs text-gray-500 font-medium">{software.rating.toFixed(1)}</span>
                </div>
            )}

            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 mb-4">
                    {software.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="font-semibold text-gray-800 mb-4">{software.price}</div>
                <a
                    href={software.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gray-800 text-white font-semibold py-2 rounded-lg text-sm transition-colors duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                >
                    Visitar Site
                </a>
            </div>
        </div>
    );
};

export const SoftwareCardSkeleton: React.FC = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col shadow-sm animate-pulse">
        <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200 mr-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2 mb-4 flex-grow">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>

        <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-full"></div>
        </div>
    </div>
);

// Add keyframes for animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.5s ease-out forwards;
        opacity: 0;
    }
`;
document.head.appendChild(style);