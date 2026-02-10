import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Edit2, Save, X, Trash2, Plus, MessageCircle } from 'lucide-react';
import { FAQItem } from '../../types';

const AdminFAQ: React.FC = () => {
  const { faq, updateFAQ, addFAQ, deleteFAQ } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<FAQItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<Omit<FAQItem, 'id'>>({
    question: '',
    answer: ''
  });

  const startEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const saveEdit = (id: number) => {
    updateFAQ(id, editForm);
    setEditingId(null);
  };

  const handleAdd = () => {
    addFAQ(newForm);
    setIsAdding(false);
    setNewForm({ question: '', answer: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-slate-900">Управление FAQ</h1>
         <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
            <Plus size={20} /> Добавить вопрос
         </button>
      </div>

      {isAdding && (
         <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 mb-8 animate-fade-in-down">
             <h3 className="font-bold text-lg mb-4 text-brand-800">Новый вопрос</h3>
             <div className="space-y-4">
                <input 
                     type="text" placeholder="Вопрос" 
                     value={newForm.question}
                     onChange={e => setNewForm({...newForm, question: e.target.value})}
                     className="px-4 py-2 rounded-lg border border-slate-300 w-full font-bold bg-white text-slate-900"
                />
                <textarea 
                     placeholder="Ответ" 
                     value={newForm.answer}
                     onChange={e => setNewForm({...newForm, answer: e.target.value})}
                     className="px-4 py-2 rounded-lg border border-slate-300 w-full bg-white text-slate-900"
                     rows={3}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600">Отмена</button>
                    <button onClick={handleAdd} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">Сохранить</button>
                </div>
             </div>
         </div>
      )}

      <div className="space-y-4">
        {faq.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {editingId === item.id ? (
              <div className="space-y-4">
                <input 
                    type="text" 
                    value={editForm.question}
                    onChange={e => setEditForm({...editForm, question: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 font-bold bg-white text-slate-900"
                />
                <textarea 
                    value={editForm.answer}
                    onChange={e => setEditForm({...editForm, answer: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
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
              <div className="flex gap-4">
                 <div className="mt-1 text-brand-500 shrink-0">
                    <MessageCircle size={24} />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{item.question}</h3>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => startEdit(item)} className="text-slate-400 hover:text-brand-600 p-1">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => deleteFAQ(item.id)} className="text-slate-400 hover:text-red-600 p-1">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    <p className="text-slate-600">{item.answer}</p>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFAQ;