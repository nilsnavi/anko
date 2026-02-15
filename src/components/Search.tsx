import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, FileText, User, Building2, GraduationCap, Newspaper, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    type: 'service' | 'news' | 'page' | 'contact';
    path: string;
    icon: React.ReactNode;
}

export const Search: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { services, news } = useData();

    // Static pages for search
    const staticPages: SearchResult[] = [
        {
            id: 'page-home',
            title: 'Главная страница',
            description: 'Комплексная поддержка вашего бизнеса в Новороссийске',
            type: 'page',
            path: '/',
            icon: <Building2 size={18} />,
        },
        {
            id: 'page-about',
            title: 'О нас',
            description: 'Информация об организации Экосистема учёта',
            type: 'page',
            path: '/about',
            icon: <User size={18} />,
        },
        {
            id: 'page-services',
            title: 'Услуги',
            description: 'Полный спектр услуг для бизнеса',
            type: 'page',
            path: '/services',
            icon: <Building2 size={18} />,
        },
        {
            id: 'page-veterans',
            title: 'Поддержка ветеранов',
            description: 'Программа поддержки ветеранов боевых действий',
            type: 'page',
            path: '/veterans',
            icon: <User size={18} />,
        },
        {
            id: 'page-education',
            title: 'Обучение',
            description: 'Образовательные программы и курсы',
            type: 'page',
            path: '/education',
            icon: <GraduationCap size={18} />,
        },
        {
            id: 'page-contacts',
            title: 'Контакты',
            description: 'Свяжитесь с нами',
            type: 'contact',
            path: '/contacts',
            icon: <Phone size={18} />,
        },
    ];

    const searchData = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const normalizedQuery = searchQuery.toLowerCase();
        const allResults: SearchResult[] = [];

        // Search in services
        services.forEach((service) => {
            if (
                service.title.toLowerCase().includes(normalizedQuery) ||
                service.description.toLowerCase().includes(normalizedQuery)
            ) {
                allResults.push({
                    id: `service-${service.id}`,
                    title: service.title,
                    description: service.description,
                    type: 'service',
                    path: '/services',
                    icon: <Building2 size={18} />,
                });
            }
        });

        // Search in news
        news.forEach((item) => {
            if (
                item.title.toLowerCase().includes(normalizedQuery) ||
                item.summary.toLowerCase().includes(normalizedQuery)
            ) {
                allResults.push({
                    id: `news-${item.id}`,
                    title: item.title,
                    description: item.summary,
                    type: 'news',
                    path: '/',
                    icon: <Newspaper size={18} />,
                });
            }
        });

        // Search in static pages
        staticPages.forEach((page) => {
            if (
                page.title.toLowerCase().includes(normalizedQuery) ||
                page.description.toLowerCase().includes(normalizedQuery)
            ) {
                allResults.push(page);
            }
        });

        setResults(allResults.slice(0, 8));
        setSelectedIndex(0);
    }, [services, news]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            searchData(query);
        }, 150);

        return () => clearTimeout(debounceTimer);
    }, [query, searchData]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Open search with Cmd/Ctrl + K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }

            // Close with Escape
            if (e.key === 'Escape') {
                setIsOpen(false);
            }

            if (!isOpen) return;

            // Navigate results with arrow keys
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
            } else if (e.key === 'Enter' && results[selectedIndex]) {
                e.preventDefault();
                navigate(results[selectedIndex].path);
                setIsOpen(false);
                setQuery('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, navigate]);

    const handleResultClick = (result: SearchResult) => {
        navigate(result.path);
        setIsOpen(false);
        setQuery('');
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'service':
                return 'Услуга';
            case 'news':
                return 'Новость';
            case 'page':
                return 'Страница';
            case 'contact':
                return 'Контакты';
            default:
                return type;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'service':
                return 'bg-brand-100 text-brand-700';
            case 'news':
                return 'bg-purple-100 text-purple-700';
            case 'page':
                return 'bg-slate-100 text-slate-700';
            case 'contact':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <>
            {/* Search Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm transition-colors"
                title="Поиск (Ctrl+K)"
            >
                <SearchIcon size={16} />
                <span className="text-slate-400">Поиск...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-white rounded text-xs text-slate-500 border border-slate-200">
                    Ctrl+K
                </kbd>
            </button>

            {/* Mobile Search Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
                title="Поиск"
            >
                <SearchIcon size={20} />
            </button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                                <SearchIcon size={20} className="text-slate-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Поиск по сайту..."
                                    className="flex-1 text-lg outline-none placeholder:text-slate-400"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery('')}
                                        className="p-1 hover:bg-slate-100 rounded"
                                    >
                                        <X size={18} className="text-slate-400" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hidden sm:block px-2 py-1 text-xs text-slate-400 bg-slate-100 rounded"
                                >
                                    ESC
                                </button>
                            </div>

                            {/* Results */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {results.length > 0 ? (
                                    <div className="py-2">
                                        {results.map((result, index) => (
                                            <motion.button
                                                key={result.id}
                                                onClick={() => handleResultClick(result)}
                                                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${index === selectedIndex ? 'bg-brand-50' : 'hover:bg-slate-50'
                                                    }`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                            >
                                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                                    {result.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-slate-900 truncate">
                                                            {result.title}
                                                        </span>
                                                        <span
                                                            className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(
                                                                result.type
                                                            )}`}
                                                        >
                                                            {getTypeLabel(result.type)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 line-clamp-2">
                                                        {result.description}
                                                    </p>
                                                </div>
                                                {index === selectedIndex && (
                                                    <div className="text-xs text-brand-600 font-medium">
                                                        ↵
                                                    </div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : query ? (
                                    <div className="py-12 text-center">
                                        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500">Ничего не найдено</p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Попробуйте другой запрос
                                        </p>
                                    </div>
                                ) : (
                                    <div className="py-8 px-4">
                                        <p className="text-sm text-slate-400 mb-4">Популярные запросы:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Бухгалтерия', 'Ветераны', 'Регистрация ИП', 'Налоги'].map(
                                                (term) => (
                                                    <button
                                                        key={term}
                                                        onClick={() => setQuery(term)}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm transition-colors"
                                                    >
                                                        {term}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="hidden sm:flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">
                                            ↑↓
                                        </kbd>{' '}
                                        для навигации
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">
                                            ↵
                                        </kbd>{' '}
                                        для выбора
                                    </span>
                                </div>
                                <span>{results.length} результатов</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
