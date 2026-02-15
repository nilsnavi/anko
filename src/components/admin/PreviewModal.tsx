import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, User, Tag } from 'lucide-react';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
    type: 'news' | 'service' | 'page' | 'faq';
    metadata?: {
        date?: string;
        author?: string;
        category?: string;
        status?: 'draft' | 'published';
    };
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
    isOpen,
    onClose,
    title,
    content,
    type,
    metadata,
}) => {
    const getTypeLabel = () => {
        switch (type) {
            case 'news':
                return 'Новость';
            case 'service':
                return 'Услуга';
            case 'page':
                return 'Страница';
            case 'faq':
                return 'FAQ';
            default:
                return 'Предпросмотр';
        }
    };

    const getStatusBadge = () => {
        if (!metadata?.status) return null;

        const statusConfig = {
            draft: { label: 'Черновик', className: 'bg-yellow-100 text-yellow-700' },
            published: { label: 'Опубликовано', className: 'bg-green-100 text-green-700' },
        };

        const config = statusConfig[metadata.status];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Предпросмотр: {getTypeLabel()}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Такой вид будет у контента на сайте
                                    </p>
                                </div>
                                {getStatusBadge()}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-4xl mx-auto p-8">
                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                    {title || 'Без названия'}
                                </h1>

                                {/* Metadata */}
                                {metadata && (metadata.date || metadata.author || metadata.category) && (
                                    <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                                        {metadata.date && (
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar size={18} />
                                                <span>{metadata.date}</span>
                                            </div>
                                        )}
                                        {metadata.author && (
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <User size={18} />
                                                <span>{metadata.author}</span>
                                            </div>
                                        )}
                                        {metadata.category && (
                                            <div className="flex items-center gap-2">
                                                <Tag size={18} className="text-slate-500" />
                                                <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
                                                    {metadata.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Main Content */}
                                <div className="prose prose-slate prose-lg max-w-none">
                                    {content || (
                                        <p className="text-slate-400 italic">
                                            Нет содержимого для предпросмотра
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                            <div className="text-sm text-slate-500">
                                Режим предпросмотра
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Закрыть
                                </button>
                                <button
                                    onClick={() => window.open('/', '_blank')}
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                                >
                                    <ExternalLink size={18} />
                                    Открыть сайт
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PreviewModal;
