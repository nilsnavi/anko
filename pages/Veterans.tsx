import React, { useState } from 'react';
import Section from '../components/Section';
import { Shield, Target, BookOpen, HeartHandshake, CheckCircle } from 'lucide-react';

const Veterans: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <div>
       {/* Hero for Veterans */}
       <div className="bg-slate-900 text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-4xl">
             <div className="inline-flex items-center gap-2 bg-brand-900 border border-brand-700 rounded-full px-4 py-1 mb-6">
                <Shield size={16} className="text-brand-400" />
                <span className="text-sm font-semibold uppercase tracking-wide">Специальная программа</span>
             </div>
             <h1 className="text-3xl md:text-5xl font-bold mb-6">Поддержка ветеранов боевых действий</h1>
             <p className="text-xl text-slate-300 leading-relaxed">
                Мы помогаем тем, кто защищал нас. Программа «Свое дело» разработана специально для адаптации ветеранов к гражданской жизни через предпринимательство.
             </p>
          </div>
       </div>

       <Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
             <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-brand-600 hover:-translate-y-1 transition-transform">
                <Target className="text-brand-600 w-12 h-12 mb-6" />
                <h3 className="text-xl font-bold mb-4">Старт бизнеса</h3>
                <p className="text-slate-600 mb-4">
                   Помощь в выборе ниши, написании бизнес-плана и регистрации ИП или ООО без госпошлины (при наличии льгот).
                </p>
             </div>
             <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-brand-600 hover:-translate-y-1 transition-transform">
                <BookOpen className="text-brand-600 w-12 h-12 mb-6" />
                <h3 className="text-xl font-bold mb-4">Бесплатное обучение</h3>
                <p className="text-slate-600 mb-4">
                   Доступ к образовательным программам центра: основы маркетинга, управления и финансовой грамотности.
                </p>
             </div>
             <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-brand-600 hover:-translate-y-1 transition-transform">
                <HeartHandshake className="text-brand-600 w-12 h-12 mb-6" />
                <h3 className="text-xl font-bold mb-4">Сопровождение</h3>
                <p className="text-slate-600 mb-4">
                   Льготное бухгалтерское обслуживание в течение первого года работы предприятия.
                </p>
             </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
             <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Как получить поддержку?</h2>
                <ol className="space-y-6">
                   <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white font-bold">1</span>
                      <div>
                         <h4 className="font-bold text-lg">Подайте заявку</h4>
                         <p className="text-slate-600">Заполните форму на сайте или позвоните нам.</p>
                      </div>
                   </li>
                   <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white font-bold">2</span>
                      <div>
                         <h4 className="font-bold text-lg">Подтвердите статус</h4>
                         <p className="text-slate-600">Предоставьте удостоверение ветерана боевых действий.</p>
                      </div>
                   </li>
                   <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white font-bold">3</span>
                      <div>
                         <h4 className="font-bold text-lg">Начните обучение</h4>
                         <p className="text-slate-600">Мы составим индивидуальный план развития вашего проекта.</p>
                      </div>
                   </li>
                </ol>
             </div>
             <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-md w-full relative overflow-hidden">
                {isSubmitted ? (
                  <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                        <CheckCircle size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявка принята!</h3>
                      <p className="text-slate-600 mb-8">Мы свяжемся с вами в ближайшее время для подтверждения участия.</p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="text-brand-600 font-medium hover:text-brand-700"
                      >
                        Вернуться к форме
                      </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-4">Заявка на участие в программе</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">ФИО</label>
                          <input required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900" placeholder="Иванов Иван Иванович" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                          <input required type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900" placeholder="+7 (___) ___-__-__" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Ваша идея (если есть)</label>
                          <textarea className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-24 bg-white text-slate-900" placeholder="Хочу открыть автосервис..."></textarea>
                      </div>
                      <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition-colors">
                          Отправить заявку
                      </button>
                      <p className="text-xs text-slate-500 text-center">
                          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                      </p>
                    </form>
                  </>
                )}
             </div>
          </div>
       </Section>
    </div>
  );
};

export default Veterans;