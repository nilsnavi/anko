import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Edit2, Save, X } from 'lucide-react';
import { ServiceItem } from '../../types';

const AdminServices: React.FC = () => {
  const { services, updateService } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceItem>>({});

  const startEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setEditForm(service);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (id: string) => {
    updateService(id, editForm);
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Управление услугами</h1>
      <div className="grid gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {editingId === service.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Название</label>
                  <input 
                    type="text" 
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
                  <textarea 
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                   <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <X size={16} /> Отмена
                   </button>
                   <button onClick={() => saveEdit(service.id)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-lg">
                      <Save size={16} /> Сохранить
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                 <div className="flex gap-4">
                    <div className="bg-brand-50 p-3 rounded-lg text-brand-600 h-fit">
                        <service.icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                        <p className="text-slate-600 mt-1">{service.description}</p>
                    </div>
                 </div>
                 <button onClick={() => startEdit(service)} className="text-slate-400 hover:text-brand-600 p-2">
                    <Edit2 size={20} />
                 </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;