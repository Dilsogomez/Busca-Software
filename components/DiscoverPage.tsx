import React, { useState, useEffect } from 'react';
import type { NewsArticle } from '../types';
import { findNews } from '../services/geminiService';
import { NewsCard, NewsCardSkeleton } from './NewsCard';

export const DiscoverPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const newsResults = await findNews();
                setArticles(newsResults);
            } catch (err) {
                console.error(err);
                setError('Falha ao buscar notícias. Tente novamente mais tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
                    <p className="font-semibold">Ocorreu um erro</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <NewsCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (articles.length === 0) {
            return (
                 <div className="text-center text-gray-600 py-16">
                    <p>Nenhuma notícia encontrada no momento.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                    <NewsCard key={`${article.url}-${index}`} article={article} />
                ))}
            </div>
        );
    };

    return (
        <div className="py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                    Últimas Noticias
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600">
                    As últimas novidades e artigos do mundo da tecnologia.
                </p>
            </div>
            {renderContent()}
        </div>
    );
};