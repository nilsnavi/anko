import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Edit2, Save, X, Trash2, Plus, User, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { TeamMember } from '../../types';

const ITEMS_PER_PAGE = 10;

const AdminTeam: React.FC = () => {
  const { team, updateTeamMember, addTeamMember, deleteTeamMember, loading } = useData();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    imageUrl: 'https://picsum.photos/200/200'
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(team.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeam = team.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setEditForm(member);
  };

  const saveEdit = (id: number) => {
    updateTeamMember(id, editForm);
    setEditingId(null);
  };

  const handleAdd = () => {
    addTeamMember(newForm);
    setIsAdding(false);
    setNewForm({
      name: '',
      role: '',
      imageUrl: 'https://picsum.photos/200/200'
    });
    // Go to last page where new member is likely added
    setCurrentPage(Math.ceil((team.length + 1) / ITEMS_PER_PAGE));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-2" />
          <p className="text-slate-600">Загрузка команды...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Управление командой</h1>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
          <Plus size={20} /> Добавить сотрудника
        </button>
      </div>

      {isAdding && (
        <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 mb-8 animate-fade-in-down">
          <h3 className="font-bold text-lg mb-4 text-brand-800">Новый сотрудник</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text" placeholder="ФИО"
                value={newForm.name}
                onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
              />
              <input
                type="text" placeholder="Должность"
                value={newForm.role}
                onChange={e => setNewForm({ ...newForm, role: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
              />
            </div>
            <input
              type="text" placeholder="Ссылка на фото"
              value={newForm.imageUrl}
              onChange={e => setNewForm({ ...newForm, imageUrl: e.target.value })}
              className="px-4 py-2 rounded-lg border border-slate-300 w-full focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Отмена</button>
              <button onClick={handleAdd} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Добавить</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTeam.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {editingId === member.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 font-bold bg-white text-slate-900"
                  placeholder="Имя"
                />
                <input
                  type="text"
                  value={editForm.role}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white text-slate-900"
                  placeholder="Должность"
                />
                <input
                  type="text"
                  value={editForm.imageUrl}
                  onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-500 bg-white"
                  placeholder="URL фото"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded text-sm">
                    <X size={14} /> Отмена
                  </button>
                  <button onClick={() => saveEdit(member.id)} className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white hover:bg-brand-700 rounded text-sm">
                    <Save size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center relative">
                <div className="absolute top-0 right-0 flex gap-2">
                  <button onClick={() => startEdit(member)} className="text-slate-400 hover:text-brand-600 p-1 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteTeamMember(member.id)} className="text-slate-400 hover:text-red-600 p-1 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full overflow-hidden">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                <p className="text-brand-600 text-sm">{member.role}</p>
              </div>
            )}
          </div>
        ))}

        {team.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500">
            Команда пуста. Добавьте сотрудников.
          </div>
        )}
      </div>

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
    </div>
  );
};

export default AdminTeam;