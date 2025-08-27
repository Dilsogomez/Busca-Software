
import React from 'react';
import { SoftwareCard, SoftwareCardSkeleton } from './SoftwareCard';
import type { Software } from '../types';

interface SoftwareGridProps {
    softwareList: Software[];
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
}

export const SoftwareGrid: React.FC<SoftwareGridProps> = ({ softwareList, isLoading, error, searchTerm }) => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <SoftwareCardSkeleton key={index} />
                ))}
            </div>
        );
    }
    
    if (softwareList.length === 0) {
        const hasShortSearchTerm = searchTerm.length > 0 && searchTerm.length < 3;
        return (
            <div className="text-center text-gray-600 py-16">
                <p>
                    {hasShortSearchTerm
                        ? 'Continue digitando para iniciar a busca (mínimo 3 caracteres).'
                        : 'Nenhum software encontrado com os filtros selecionados.'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {softwareList.map((software, index) => (
                <SoftwareCard key={`${software.name}-${index}`} software={software} index={index} />
            ))}
        </div>
    );
};
