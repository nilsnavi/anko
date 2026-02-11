import React from 'react';
import Section from '../components/Section';
import { Calendar, UserCheck, Download } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <div className="pt-8">
      <Section title="Образовательные программы" centered subtitle="Повышаем грамотность предпринимателей и помогаем избегать ошибок на старте">
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
             <div>
                <img src="https://picsum.photos/id/24/800/600" alt="Seminar" className="rounded-2xl shadow-xl" />
             </div>
             <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Для кого наши курсы?</h3>
                <ul className="space-y-4">
                   <li className="flex gap-3">
                      <UserCheck className="text-brand-500 shrink-0" />
                      <span className="text-slate-700">Начинающие предприниматели, которые хотят разобраться в налогах</span>
                   </li>
                   <li className="flex gap-3">
                      <UserCheck className="text-brand-500 shrink-0" />
                      <span className="text-slate-700">Владельцы малого бизнеса, планирующие масштабирование</span>
                   </li>
                   <li className="flex gap-3">
                      <UserCheck className="text-brand-500 shrink-0" />
                      <span className="text-slate-700">Самозанятые, переходящие в статус ИП</span>
                   </li>
                </ul>
                <button className="mt-8 px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                   Смотреть расписание
                </button>
             </div>
         </div>

         {/* Schedule */}
         <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden mb-16">
            <div className="bg-slate-900 text-white p-6">
               <h3 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="text-brand-400" />
                  Ближайшие мероприятия
               </h3>
            </div>
            <div className="divide-y divide-slate-100">
               {[
                  { date: '15 Ноября', time: '14:00', title: 'Основы налогообложения для ИП', type: 'Семинар', status: 'Открыта регистрация' },
                  { date: '22 Ноября', time: '10:00', title: 'Маркетинг без бюджета', type: 'Тренинг', status: 'Мест нет' },
                  { date: '01 Декабря', time: '12:00', title: 'Правовая безопасность бизнеса', type: 'Лекция', status: 'Открыта регистрация' },
               ].map((event, i) => (
                  <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-6">
                        <div className="text-center w-16">
                           <div className="font-bold text-slate-900 text-lg">{event.date.split(' ')[0]}</div>
                           <div className="text-xs text-slate-500 uppercase">{event.date.split(' ')[1]}</div>
                        </div>
                        <div>
                           <div className="flex items-center gap-2 text-xs text-brand-600 font-bold uppercase mb-1">
                              <span>{event.type}</span>
                              <span className="text-slate-300">•</span>
                              <span>{event.time}</span>
                           </div>
                           <h4 className="font-bold text-slate-900 text-lg">{event.title}</h4>
                        </div>
                     </div>
                     <div>
                        {event.status === 'Мест нет' ? (
                           <span className="text-slate-400 font-medium text-sm">Запись закрыта</span>
                        ) : (
                           <button className="px-4 py-2 border border-brand-600 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-600 hover:text-white transition-colors">
                              Записаться
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Materials */}
         <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">Полезные материалы</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
               {[
                  'Чек-лист регистрации ИП',
                  'Памятка по налоговым режимам 2024',
                  'Образец трудового договора'
               ].map((file, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer group">
                     <Download className="mx-auto mb-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                     <p className="font-medium text-slate-700 group-hover:text-slate-900">{file}</p>
                  </div>
               ))}
            </div>
         </div>

      </Section>
    </div>
  );
};

export default Education;