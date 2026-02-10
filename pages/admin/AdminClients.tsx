import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Edit2, Save, X, Trash2, Plus, UserCheck, Search, ChevronLeft, ChevronRight, Check, Ban } from 'lucide-react';
import { Client } from '../../types';

const ITEMS_PER_PAGE = 10;

const AdminClients: React.FC = () => {
  const { clients, updateClient, addClient, deleteClient } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newForm, setNewForm] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    company: '',
    status: 'active'
  });

  // Filter Logic
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentClients = filteredClients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setEditForm(client);
  };

  const saveEdit = (id: number) => {
    updateClient(id, editForm);
    setEditingId(null);
  };

  const handleAdd = () => {
    addClient(newForm);
    setIsAdding(false);
    setNewForm({
        name: '',
        email: '',
        company: '',
        status: 'active'
    });
    setSearchTerm(''); // Clear search to see new item
    setCurrentPage(1);
  };

  const toggleStatus = (client: Client) => {
      updateClient(client.id, { 
          status: client.status === 'active' ? 'inactive' : 'active' 
      });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-bold text-slate-900">Клиенты</h1>
            <p className="text-slate-500 mt-1">Управление базой клиентов и партнеров</p>
         </div>
         <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
            <Plus size={20} /> Добавить клиента
         </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input 
            type="text" 
            placeholder="Поиск по имени, компании или email..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none shadow-sm bg-white text-slate-900"
        />
        <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
      </div>

      {isAdding && (
         <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 mb-8 animate-fade-in-down shadow-inner">
             <h3 className="font-bold text-lg mb-4 text-brand-800">Новый клиент</h3>
             <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input 
                     type="text" placeholder="ФИО / Контактное лицо" 
                     value={newForm.name}
                     onChange={e => setNewForm({...newForm, name: e.target.value})}
                     className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                   />
                   <input 
                     type="text" placeholder="Название компании" 
                     value={newForm.company}
                     onChange={e => setNewForm({...newForm, company: e.target.value})}
                     className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                   />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="email" placeholder="Email" 
                        value={newForm.email}
                        onChange={e => setNewForm({...newForm, email: e.target.value})}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                    />
                    <select 
                        value={newForm.status}
                        onChange={e => setNewForm({...newForm, status: e.target.value as 'active' | 'inactive'})}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                    >
                        <option value="active">Активен</option>
                        <option value="inactive">Неактивен</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Отмена</button>
                    <button onClick={handleAdd} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm">Добавить в базу</button>
                </div>
             </div>
         </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">ID</th>
                  <th className="py-4 px-6 font-semibold">Компания</th>
                  <th className="py-4 px-6 font-semibold">Контактное лицо</th>
                  <th className="py-4 px-6 font-semibold">Контакты</th>
                  <th className="py-4 px-6 font-semibold">Статус</th>
                  <th className="py-4 px-6 font-semibold text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentClients.map((client) => (
                  <tr key={client.id} className="hover:bg-blue-50 transition-colors duration-150 group">
                    {editingId === client.id ? (
                        <>
                           <td className="py-4 px-6 text-slate-400">#{client.id}</td>
                           <td className="py-4 px-6">
                              <input 
                                type="text" 
                                value={editForm.company} 
                                onChange={e => setEditForm({...editForm, company: e.target.value})}
                                className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 outline-none bg-white text-slate-900"
                              />
                           </td>
                           <td className="py-4 px-6">
                              <input 
                                type="text" 
                                value={editForm.name} 
                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 outline-none bg-white text-slate-900"
                              />
                           </td>
                           <td className="py-4 px-6">
                              <input 
                                type="email" 
                                value={editForm.email} 
                                onChange={e => setEditForm({...editForm, email: e.target.value})}
                                className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 outline-none bg-white text-slate-900"
                              />
                           </td>
                           <td className="py-4 px-6">
                              <select 
                                value={editForm.status} 
                                onChange={e => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive'})}
                                className="px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 outline-none bg-white text-slate-900"
                              >
                                 <option value="active">Активен</option>
                                 <option value="inactive">Неактивен</option>
                              </select>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded">
                                   <X size={18} />
                                </button>
                                <button onClick={() => saveEdit(client.id)} className="p-1.5 bg-brand-600 text-white hover:bg-brand-700 rounded">
                                   <Save size={18} />
                                </button>
                              </div>
                           </td>
                        </>
                    ) : (
                        <>
                           <td className="py-4 px-6 text-sm text-slate-400">#{client.id}</td>
                           <td className="py-4 px-6 font-medium text-slate-900">{client.company}</td>
                           <td className="py-4 px-6 text-slate-700">{client.name}</td>
                           <td className="py-4 px-6 text-slate-500 text-sm">{client.email}</td>
                           <td className="py-4 px-6">
                              <button 
                                onClick={() => toggleStatus(client)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                  client.status === 'active' 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {client.status === 'active' ? (
                                    <><Check size={12} /> Активен</>
                                ) : (
                                    <><Ban size={12} /> Неактивен</>
                                )}
                              </button>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => startEdit(client)} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" title="Редактировать">
                                    <Edit2 size={18} />
                                 </button>
                                 <button onClick={() => deleteClient(client.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Удалить">
                                    <Trash2 size={18} />
                                 </button>
                              </div>
                           </td>
                        </>
                    )}
                  </tr>
                ))}
                
                {currentClients.length === 0 && (
                    <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                           {searchTerm ? 'Ничего не найдено по вашему запросу.' : 'Список клиентов пуст.'}
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
         </div>
         
         {/* Footer / Pagination */}
         <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-slate-500">
               Показано {currentClients.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredClients.length)} из {filteredClients.length}
            </span>
            
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => goToPage(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page 
                                    ? 'bg-brand-600 text-white' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button 
                        onClick={() => goToPage(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AdminClients;