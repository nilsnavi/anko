import React from 'react';
import { useData } from '../../context/DataContext';
import { FileText, Users, Briefcase, HelpCircle, PlusCircle, ArrowRight, MessageSquare, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { services, team, news, faq, clients, inquiries } = useData();

  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;

  const stats = [
    { label: 'Услуг', value: services.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/services' },
    { label: 'Новостей', value: news.length, icon: FileText, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/news' },
    { label: 'Сотрудников', value: team.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/team' },
    { label: 'FAQ', value: faq.length, icon: HelpCircle, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/faq' },
    { label: 'Клиентов', value: clients.length, icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-50', link: '/admin/clients' },
    { label: 'Заявки', value: pendingInquiries, icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50', link: '/admin/inquiries' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Панель управления</h1>
        <p className="text-slate-500 mt-1">Добро пожаловать в систему управления сайтом «Экосистема учёта».</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.link} className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-brand-100 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon size={24} />
              </div>
              <div className="bg-slate-50 rounded-full p-1 text-slate-400 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors duration-300">
                <ArrowRight size={16} />
              </div>
            </div>
            <div>
              <span className="text-3xl font-bold text-slate-900 block mb-1">{stat.value}</span>
              <span className="text-slate-600 font-medium text-sm">{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PlusCircle className="text-brand-600" size={20} />
            Быстрые действия
          </h2>
          <div className="space-y-3">
            <Link to="/admin/news" className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-all duration-200 group border border-transparent hover:border-brand-100 hover:shadow-sm">
              <span className="font-medium">Добавить новость</span>
              <PlusCircle size={18} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
            </Link>
            <Link to="/admin/team" className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-all duration-200 group border border-transparent hover:border-brand-100 hover:shadow-sm">
              <span className="font-medium">Добавить сотрудника</span>
              <PlusCircle size={18} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
            </Link>
            <Link to="/admin/faq" className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-all duration-200 group border border-transparent hover:border-brand-100 hover:shadow-sm">
              <span className="font-medium">Добавить вопрос FAQ</span>
              <PlusCircle size={18} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent News */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-slate-900">Последние публикации</h2>
             <Link to="/admin/news" className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline">Все новости</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Дата</th>
                  <th className="py-3 px-4 font-semibold">Заголовок</th>
                  <th className="py-3 px-4 font-semibold">Категория</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {news.slice(0, 5).map(item => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-blue-50 transition-colors duration-200 cursor-default">
                    <td className="py-3 px-4 text-sm whitespace-nowrap text-slate-500">{item.date}</td>
                    <td className="py-3 px-4 font-medium max-w-xs truncate" title={item.title}>{item.title}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.category === 'Analytics' ? 'bg-purple-100 text-purple-800' :
                        item.category === 'Event' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.category === 'Analytics' ? 'Аналитика' : item.category === 'Event' ? 'Событие' : 'Новости'}
                      </span>
                    </td>
                  </tr>
                ))}
                {news.length === 0 && (
                   <tr>
                     <td colSpan={3} className="py-8 text-center text-slate-500">Нет новостей</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;