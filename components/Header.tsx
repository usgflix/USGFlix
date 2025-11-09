
import React from 'react';

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

interface HeaderProps {
    onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory }) => {
    const menuItems = [
        'Arquivo', 'Configurações', 'Ferramentas', 'Referências rápidas', 
        'Máscaras de laudo', 'Modelos de Layout', 'Espaço para assinatura no fim do laudo', 'Ajuda'
    ];

    return (
        <header className="bg-gray-100 border-b-2 border-gray-300 shadow-sm px-4">
            <div className="flex items-center h-10">
                <div className="flex items-center text-blue-600 mr-6">
                    <MenuIcon />
                    <span className="font-semibold">Paciente:</span>
                </div>
                <nav className="flex space-x-4 text-sm">
                     <button onClick={onOpenHistory} className="text-gray-600 hover:text-blue-600 focus:outline-none font-medium">
                        Histórico
                    </button>
                    {menuItems.map(item => (
                        <button key={item} className="text-gray-600 hover:text-blue-600 focus:outline-none">
                            {item}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};
