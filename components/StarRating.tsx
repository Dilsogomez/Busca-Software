import React from 'react';

interface StarRatingProps {
    rating: number;
}

const starIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.822 3.758 4.144.602c.73.106 1.021.996.494 1.506l-2.998 2.922.708 4.128c.125.726-.638 1.282-1.29.948L10 14.896l-3.716 1.952c-.652.334-1.415-.222-1.29-.948l.708-4.128L2.704 8.75c-.527-.51-.236-1.4.494-1.506l4.144-.602 1.822-3.758z" clipRule="evenodd" />
    </svg>
);

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
        let star;
        if (i <= rating) {
            star = <span key={i} className="text-yellow-400">{starIcon}</span>;
        } else if (i - 0.5 <= rating) {
            star = (
                <span key={i} className="relative inline-block">
                    <span className="text-gray-300">{starIcon}</span>
                    <span className="absolute top-0 left-0 overflow-hidden w-1/2">
                        <span className="text-yellow-400">{starIcon}</span>
                    </span>
                </span>
            );
        } else {
            star = <span key={i} className="text-gray-300">{starIcon}</span>;
        }
        stars.push(star);
    }

    return <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>{stars}</div>;
};
