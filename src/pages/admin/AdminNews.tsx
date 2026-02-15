import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Edit2, Save, X, Trash2, Plus, ChevronLeft, ChevronRight, Eye, Trash } from 'lucide-react';
import { NewsItem } from '../../types';
import { SortableList, PreviewModal } from '../../components/admin';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

const AdminNews: React.FC = () => {
  const { news, updateNews, addNews, deleteNews } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<NewsItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<Omit<NewsItem, 'id'>>({
    date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
    title: '',
    summary: '',
    category: 'News'
  });

  // Bulk operations state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNews = news.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (window.confirm(`Удалить ${selectedIds.length} новостей?`)) {
      selectedIds.forEach(id => deleteNews(Number(id)));
      setSelectedIds([]);
    }
  };

  // Handle reorder
  const handleReorder = (reorderedNews: NewsItem[]) => {
    // In a real app, you would save the order to the backend
    console.log('Reordered:', reorderedNews);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Edit Handlers
  const startEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };
  const saveEdit = (id: number) => {
    updateNews(id, editForm);
    setEditingId(null);
  };

  // Add Handlers
  const handleAdd = () => {
    addNews(newForm);
    setIsAdding(false);
    setNewForm({
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      title: '',
      summary: '',
      category: 'News'
    });
    // Optional: Go to first page to see new item if sorting is desc, or last page if asc
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Управление новостями</h1>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash size={20} />
              Удалить ({selectedIds.length})
            </motion.button>
          )}
          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
            <Plus size={20} /> Добавить новость
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 mb-8 animate-fade-in-down">
          <h3 className="font-bold text-lg mb-4 text-brand-800">Новая запись</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text" placeholder="Дата"
                value={newForm.date}
                onChange={e => setNewForm({ ...newForm, date: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
              />
              <select
                value={newForm.category}
                onChange={e => setNewForm({ ...newForm, category: e.target.value as any })}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
              >
                <option value="News">Новости</option>
                <option value="Analytics">Аналитика</option>
                <option value="Event">Событие</option>
              </select>
            </div>
            <input
              type="text" placeholder="Заголовок"
              value={newForm.title}
              onChange={e => setNewForm({ ...newForm, title: e.target.value })}
              className="px-4 py-2 rounded-lg border border-slate-300 w-full focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
            />
            <textarea
              placeholder="Текст новости"
              value={newForm.summary}
              onChange={e => setNewForm({ ...newForm, summary: e.target.value })}
              className="px-4 py-2 rounded-lg border border-slate-300 w-full focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Отмена</button>
              <button onClick={handleAdd} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Опубликовать</button>
            </div>
          </div>
        </div>
      )}

      <SortableList
        items={currentNews}
        onReorder={handleReorder}
        getItemId={(item) => String(item.id)}
        selectedIds={selectedIds}
        onSelect={(id, selected) => {
          setSelectedIds(prev =>
            selected ? [...prev, id] : prev.filter(i => i !== id)
          );
        }}
        onSelectAll={(selected) => {
          setSelectedIds(selected ? currentNews.map(n => String(n.id)) : []);
        }}
        onEdit={(item) => startEdit(item)}
        onDelete={(item) => deleteNews(item.id)}
        onPreview={(item) => setPreviewItem(item)}
        renderItem={(item) => (
          <div>
            {editingId === item.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editForm.date}
                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                  />
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value as any })}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                  >
                    <option value="News">Новости</option>
                    <option value="Analytics">Аналитика</option>
                    <option value="Event">Событие</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-slate-300 w-full font-bold bg-white text-slate-900"
                />
                <textarea
                  value={editForm.summary}
                  onChange={e => setEditForm({ ...editForm, summary: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-slate-300 w-full bg-white text-slate-900"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <X size={16} /> Отмена
                  </button>
                  <button onClick={() => saveEdit(item.id)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-lg">
                    <Save size={16} /> Сохранить
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${item.category === 'Analytics' ? 'bg-purple-100 text-purple-700' : item.category === 'Event' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.category === 'Analytics' ? 'Аналитика' : item.category === 'Event' ? 'Событие' : 'Новости'}
                  </span>
                  <span className="text-slate-400 text-xs">{item.date}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                <p className="text-slate-600 mt-1 line-clamp-2">{item.summary}</p>
              </div>
            )}
          </div>
        )}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm font-medium text-slate-600">
            Страница {currentPage} из {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.title || ''}
        content={previewItem?.summary}
        type="news"
        metadata={previewItem ? {
          date: previewItem.date,
          category: previewItem.category === 'Analytics' ? 'Аналитика' : previewItem.category === 'Event' ? 'Событие' : 'Новости',
        } : undefined}
      />
    </div>
  );
};

export default AdminNews;