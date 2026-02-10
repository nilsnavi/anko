import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import { COMPANY_INFO } from '../constants';
import { useData } from '../context/DataContext';
import { MapPin, Phone, Mail, Clock, CheckCircle, FileText, ShieldCheck, AlertCircle, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Contacts: React.FC = () => {
  const { faq, addInquiry } = useData();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastId, setLastId] = useState<number | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Validation State
  const [errors, setErrors] = useState<{name?: string; phone?: string; email?: string}>({});
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subjectParam = params.get('subject');
    if (subjectParam) {
      setMessage(`Интересует услуга: ${subjectParam}. `);
    }
  }, [location]);

  const validateForm = () => {
    const newErrors: {name?: string; phone?: string; email?: string} = {};
    
    // Name validation: Allows Cyrillic, Latin, spaces, hyphens. Min 2 chars.
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]{2,}$/;
    if (!name.trim()) {
        newErrors.name = 'Поле обязательно для заполнения';
    } else if (!nameRegex.test(name.trim())) {
        newErrors.name = 'Введите корректное имя (используйте буквы)';
    }

    // Phone validation: Supports +7, 8, brackets, dashes, spaces.
    // Examples: +79180000000, 8 (918) 000-00-00
    const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
    if (!phone.trim()) {
        newErrors.phone = 'Поле обязательно для заполнения';
    } else if (!phoneRegex.test(phone.trim())) {
        newErrors.phone = 'Неверный формат телефона (например: +79180000000)';
    }

    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email.trim()) {
        newErrors.email = 'Поле обязательно для заполнения';
    } else if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Введите корректный email адрес';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>, 
    field: 'name' | 'phone' | 'email', 
    value: string
  ) => {
    setter(value);
    // Clear error for this field if it exists
    if (errors[field]) {
        setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // 1. Save to internal system (Admin Panel) and get ID
    const newId = addInquiry({
      name,
      phone,
      email,
      subject: 'Заявка на помощь',
      message
    });
    
    setLastId(newId);

    // 2. Format email body for accounting
    const emailSubject = `Заявка №${newId} от ${name}`;
    const emailBody = `ЗАЯВКА НА ПОМОЩЬ №: ${newId}
----------------------------------------
ДАТА: ${new Date().toLocaleDateString('ru-RU')}
ЗАЯВИТЕЛЬ: ${name}
ТЕЛЕФОН: ${phone}
EMAIL: ${email}
----------------------------------------
ТЕКСТ ЗАПРОСА:
${message}
----------------------------------------
СОГЛАСИЕ НА ОПД: ПОЛУЧЕНО
СИСТЕМА: АНО ПБС «Экосистема учёта»`;

    // 3. Trigger Mail Client
    const mailtoLink = `mailto:4666307@mail.ru?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Simulate slight delay for UX
    setTimeout(() => {
      setIsSubmitted(true);
      window.location.href = mailtoLink;
    }, 300);
  };

  const resetForm = () => {
      setIsSubmitted(false);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setErrors({});
      setLastId(null);
  };

  return (
    <div className="pt-8">
      <Section title="Оставить заявку на помощь">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Card */}
          <div className="space-y-8">
             <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-brand-900 mb-3">Важная информация</h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                    Каждой заявке присваивается уникальный номер для внутреннего учета. Это позволяет нам отслеживать статус вашего обращения и гарантировать качественное исполнение.
                </p>
                <div className="flex items-center gap-3 text-sm text-brand-700 font-semibold bg-white p-3 rounded-lg border border-brand-100 shadow-sm">
                    <FileText size={18} className="shrink-0" />
                    <span>Заявка автоматически формируется для бухгалтерии</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                   <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                      <Phone size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900">Телефон</h4>
                      <p className="text-slate-600 mt-1">{COMPANY_INFO.phone}</p>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                   <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                      <Mail size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900">Email</h4>
                      <p className="text-slate-600 mt-1">4666307@mail.ru</p>
                   </div>
                </div>
                {/* Telegram */}
                <a 
                   href={COMPANY_INFO.telegram}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group"
                >
                   <div className="bg-slate-100 p-3 rounded-xl text-slate-600 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors">
                      <Send size={24} className="-ml-0.5 mt-0.5" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Telegram</h4>
                      <p className="text-slate-600 mt-1">@ecosystemaucheta</p>
                   </div>
                </a>
                {/* VK */}
                <a 
                   href={COMPANY_INFO.vk}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group"
                >
                   <div className="bg-slate-100 p-3 rounded-xl text-slate-600 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.2 16.5c-3.6 0-5.7-2.5-5.8-6.6H9.9c.1 3 1.4 4.3 2.4 4.6V10h2.4v2.6c1.5-.1 3-1.9 3.6-4.6h2.3c-.7 2.3-2.1 4-3.8 5l3.8 5.6h-2.8l-3-4.2c-.7-.8-1.7-.9-2.1-.8v5z"/>
                      </svg>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">ВКонтакте</h4>
                      <p className="text-slate-600 mt-1">Наша группа</p>
                   </div>
                </a>
                {/* Max */}
                <a 
                   href={COMPANY_INFO.max}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group"
                >
                   <div className="bg-slate-100 p-3 rounded-xl text-slate-600 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors w-12 h-12 flex items-center justify-center">
                      <span className="font-bold text-xl">M</span>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Max</h4>
                      <p className="text-slate-600 mt-1">Бизнес профиль</p>
                   </div>
                </a>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 md:col-span-2">
                   <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900">Офис</h4>
                      <p className="text-slate-600 mt-1 text-sm">{COMPANY_INFO.address}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 bg-slate-50 py-1 px-3 rounded-full w-fit">
                         <Clock size={12} />
                         <span>{COMPANY_INFO.workingHours}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
             {isSubmitted ? (
               <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Заявка №{lastId} принята!</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                      Мы открыли ваш почтовый клиент для отправки копии. Если окно не открылось, пожалуйста, отправьте письмо вручную на <span className="font-medium text-slate-900">4666307@mail.ru</span>.
                  </p>
                  <button 
                    onClick={resetForm}
                    className="bg-brand-50 text-brand-700 px-6 py-3 rounded-xl font-bold hover:bg-brand-100 transition-colors"
                  >
                    Отправить новую заявку
                  </button>
               </div>
             ) : (
               <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                  <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Форма обращения</h3>
                      <p className="text-slate-500">Заполните данные для регистрации заявки в системе.</p>
                  </div>
                  
                  <div className="space-y-6">
                      <div className="relative group">
                         <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-brand-600">Фамилия Имя Отчество <span className="text-red-500">*</span></label>
                         <input 
                            required 
                            type="text" 
                            value={name}
                            onChange={(e) => handleInputChange(setName, 'name', e.target.value)}
                            className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 font-medium ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/10'}`}
                            placeholder="Иванов Иван Иванович"
                         />
                         {errors.name && (
                            <div className="flex items-center gap-1.5 mt-2 text-red-500 text-sm animate-fade-in">
                                <AlertCircle size={16} />
                                <span>{errors.name}</span>
                            </div>
                         )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-brand-600">Контактный телефон <span className="text-red-500">*</span></label>
                            <input 
                                required 
                                type="tel" 
                                value={phone}
                                onChange={(e) => handleInputChange(setPhone, 'phone', e.target.value)}
                                className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 font-medium ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/10'}`} 
                                placeholder="+7 (999) 000-00-00"
                            />
                            {errors.phone && (
                                <div className="flex items-center gap-1.5 mt-2 text-red-500 text-sm animate-fade-in">
                                    <AlertCircle size={16} />
                                    <span>{errors.phone}</span>
                                </div>
                             )}
                        </div>
                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-brand-600">Email <span className="text-red-500">*</span></label>
                            <input 
                                required 
                                type="email" 
                                value={email}
                                onChange={(e) => handleInputChange(setEmail, 'email', e.target.value)}
                                className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 font-medium ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/10'}`}
                                placeholder="example@mail.ru"
                            />
                            {errors.email && (
                                <div className="flex items-center gap-1.5 mt-2 text-red-500 text-sm animate-fade-in">
                                    <AlertCircle size={16} />
                                    <span>{errors.email}</span>
                                </div>
                             )}
                        </div>
                      </div>
                      
                      <div className="relative group">
                         <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-brand-600">Суть запроса <span className="text-red-500">*</span></label>
                         <textarea 
                            required 
                            rows={4} 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 resize-none font-medium"
                            placeholder="Опишите вашу ситуацию или вопрос..."
                         ></textarea>
                      </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 flex gap-4 items-start">
                      <div className="bg-white p-1.5 rounded-full shadow-sm text-brand-600 shrink-0">
                        <ShieldCheck size={18} />
                      </div>
                      <p className="text-xs text-slate-500 text-justify leading-relaxed">
                          Нажимая кнопку «Зарегистрировать заявку», я даю свое согласие на обработку моих персональных данных в соответствии с Федеральным законом от 27.07.2006 года №152-ФЗ «О персональных данных», на условиях и для целей, определенных в Согласии на обработку персональных данных.
                      </p>
                  </div>

                  <button type="submit" className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 active:scale-[0.99] transition-all shadow-xl shadow-brand-600/20 hover:shadow-brand-600/30 flex items-center justify-center gap-2.5 text-lg">
                     <FileText size={22} />
                     Зарегистрировать заявку
                  </button>
               </form>
             )}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <div className="bg-slate-50 py-20 border-t border-slate-200">
         <div className="container mx-auto px-4 max-w-4xl">
             <div className="text-center mb-12">
                <span className="text-brand-600 font-bold tracking-wider text-sm uppercase mb-3 block">Помощь</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Часто задаваемые вопросы</h2>
             </div>
             <div className="grid gap-6">
                {faq.map((item) => (
                   <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                      <h4 className="font-bold text-lg text-slate-900 mb-3 flex items-start gap-3">
                        <span className="text-brand-600 text-xl leading-none mt-0.5">Q.</span>
                        {item.question}
                      </h4>
                      <div className="flex gap-3">
                         <span className="text-slate-400 text-xl leading-none mt-0.5 ml-0.5">A.</span>
                         <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                      </div>
                   </div>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
};

export default Contacts;