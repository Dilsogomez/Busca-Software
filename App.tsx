import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterButtons } from './components/FilterButtons';
import { SoftwareGrid } from './components/SoftwareGrid';
import { DiscoverPage } from './components/DiscoverPage';
import type { Software, FilterOption } from './types';
import { findSoftware } from './services/geminiService';
import { FILTERS } from './constants';

const App: React.FC = () => {
    const [softwareList, setSoftwareList] = useState<Software[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<FilterOption>('todos');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState('catalog');

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
        // Initial search on component mount only for catalog view
        if (activeView === 'catalog') {
            handleSearch('', 'todos');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeView]);

    const onSearchSubmit = () => {
        handleSearch(searchTerm, activeFilter);
    };

    const onFilterChange = (filter: FilterOption) => {
        setActiveFilter(filter);
        handleSearch(searchTerm, filter);
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
                                onSearch={onSearchSubmit} 
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