import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Edit2, Save, X, Loader2 } from 'lucide-react';
import { ServiceItem } from '../../types';

const AdminServices: React.FC = () => {
  const { services, updateService, loading } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceItem>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const startEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setEditForm(service);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setSavingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      setSavingId(id);
      await updateService(id, editForm);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Ошибка при сохранении изменений');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-2" />
          <p className="text-slate-600">Загрузка услуг...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Управление услугами</h1>
      <div className="grid gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {editingId === service.id ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor={`service-title-${service.id}`} className="block text-sm font-medium text-slate-700 mb-1">Название</label>
                  <input
                    id={`service-title-${service.id}`}
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                    aria-label="Название услуги"
                  />
                </div>
                <div>
                  <label htmlFor={`service-desc-${service.id}`} className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
                  <textarea
                    id={`service-desc-${service.id}`}
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                    aria-label="Описание услуги"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                    disabled={savingId === service.id}
                  >
                    <X size={16} /> Отмена
                  </button>
                  <button
                    onClick={() => saveEdit(service.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-lg disabled:opacity-50"
                    disabled={savingId === service.id}
                  >
                    {savingId === service.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Сохранить
                      </>
                    )}
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
                <button
                  onClick={() => startEdit(service)}
                  className="text-slate-400 hover:text-brand-600 p-2 disabled:opacity-50"
                  disabled={!!savingId}
                  aria-label="Редактировать услугу"
                >
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