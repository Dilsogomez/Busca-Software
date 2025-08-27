import React from 'react';

interface HeaderProps {
    activeNav: string;
    onNavChange: (navId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeNav, onNavChange }) => {

    const NavButton = ({ id, label }: { id: string; label: string }) => (
        <button
            onClick={() => onNavChange(id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeNav === id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex h-16 items-center gap-4">
                    <NavButton id="catalog" label="Catálogo" />
                    <NavButton id="discover" label="Descobrir" />
                </nav>
            </div>
        </header>
    );
};