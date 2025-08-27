
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterButtons } from './components/FilterButtons';
import { SoftwareGrid } from './components/SoftwareGrid';
import { DiscoverPage } from './components/DiscoverPage';
import type { Software, FilterOption } from './types';
import { findSoftware } from './services/geminiService';
import { FILTERS } from './constants';

// FIX: Added a trailing comma inside the generic type parameter list (`<T,>`).
// In `.tsx` files, this is necessary to distinguish a generic arrow function's
// type parameters from a JSX tag, resolving a parser ambiguity that caused
// a cascade of errors throughout this component.
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};


const App: React.FC = () => {
    const [softwareList, setSoftwareList] = useState<Software[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterOption>('todos');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState('catalog');

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const handleSearch = useCallback(async (term: string, filter: FilterOption) => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await findSoftware(term, filter);
            setSoftwareList(results);
        } catch (err) {
            console.error(err);
            setError('Falha ao buscar softwares. Verifique sua chave de API e tente novamente.');
            setSoftwareList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        if (activeView !== 'catalog') return;

        // A search is valid if the term is empty (for the initial/default view)
        // or if the term has 3 or more characters. This prevents API calls for
        // very short, incomplete terms, fixing the 429 rate limit error.
        const isSearchTermValid = debouncedSearchTerm.length === 0 || debouncedSearchTerm.length >= 3;

        if (isSearchTermValid) {
            handleSearch(debouncedSearchTerm, activeFilter);
        } else {
            // If the term is too short (1-2 chars), clear results without hitting the API.
            setIsLoading(false);
            setError(null);
            setSoftwareList([]);
        }
    }, [debouncedSearchTerm, activeFilter, activeView, handleSearch]);

    const onFilterChange = (filter: FilterOption) => {
        setActiveFilter(filter);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header activeNav={activeView} onNavChange={setActiveView} />
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {activeView === 'catalog' ? (
                    <>
                        <div className="text-center py-12 md:py-16">
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                                Busca Software IA
                            </h1>
                            <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600">
                                Central de busca por softwares — priorizamos soluções brasileiras. Filtre por área e por gratuitos ou pagos.
                            </p>
                        </div>

                        <div className="mb-8 max-w-2xl mx-auto">
                            <SearchBar 
                                searchTerm={searchTerm} 
                                setSearchTerm={setSearchTerm}
                            />
                        </div>

                        <div className="mb-12">
                            <FilterButtons 
                                filters={FILTERS}
                                activeFilter={activeFilter}
                                onFilterChange={onFilterChange}
                            />
                        </div>

                        <div className="pb-16">
                            <div className="text-center text-gray-600 font-medium mb-6">
                                {isLoading ? 'Buscando...' : `${softwareList.length} resultado(s)`}
                            </div>
                            <SoftwareGrid 
                                softwareList={softwareList} 
                                isLoading={isLoading} 
                                error={error} 
                                searchTerm={searchTerm}
                            />
                        </div>
                    </>
                ) : (
                    <DiscoverPage />
                )}
            </main>
        </div>
    );
};

export default App;
