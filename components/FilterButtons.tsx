
import React from 'react';
import type { Filter, FilterOption } from '../types';

interface FilterButtonsProps {
    filters: Filter[];
    activeFilter: FilterOption;
    onFilterChange: (filter: FilterOption) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({ filters, activeFilter, onFilterChange }) => {
    return (
        <div className="flex justify-center flex-wrap gap-3">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={`px-5 py-2.5 text-sm font-semibold rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ${
                        activeFilter === filter.id
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800 hover:bg-gray-100'
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};
