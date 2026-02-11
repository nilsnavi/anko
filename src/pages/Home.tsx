import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Users, ShieldCheck, Medal, Star } from 'lucide-react';
import Section from '../components/Section';
import { useData } from '../context/DataContext';

const Home: React.FC = () => {
  const { services, news } = useData();

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white pt-24 pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20">
            <img 
                src="https://picsum.photos/id/4/1920/1080" 
                alt="Office Background" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-slate-900 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
             {/* Highlight Plaque for Veterans */}
            <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/10 backdrop-blur-md border border-brand-400/30 rounded-xl p-4 mb-8 max-w-2xl hover:bg-white/15 transition-colors">
                <div className="bg-red-600 text-white p-2 rounded-lg shrink-0">
                    <Medal size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg leading-tight">Поддержка ветеранов боевых действий</h3>
                    <p className="text-slate-300 text-sm mt-1">
                        В запуске и развитии их деловых инициатив. 
                        <Link to="/veterans" className="text-brand-300 hover:text-white underline decoration-dotted underline-offset-4 ml-2">Подробнее о программе →</Link>
                    </p>
                </div>
            </div>

            <span className="inline-block py-1 px-3 rounded-full bg-brand-500/20 border border-brand-400 text-brand-300 text-sm font-semibold mb-6">
              АНО ПБС «Экосистема учёта»
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Комплексная поддержка вашего бизнеса в <span className="text-brand-400">Новороссийске</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              От регистрации ИП до ведения бухгалтерии. Мы помогаем предпринимателям и ветеранам боевых действий строить успешный бизнес с надежным тылом.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contacts" className="inline-flex justify-center items-center px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-brand-500/30">
                Получить консультацию
              </Link>
              <Link to="/services" className="inline-flex justify-center items-center px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition-all backdrop-blur-sm">
                Наши услуги
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Trust Indicators */}
      <div className="bg-white border-b border-slate-100 relative z-20 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4">
            <div className="bg-brand-50 p-3 rounded-full text-brand-600">
                <ShieldCheck size={32} />
            </div>
            <div>
                <h4 className="font-bold text-slate-900">Надежность</h4>
                <p className="text-sm text-slate-500">Полная ответственность за результат</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-brand-50 p-3 rounded-full text-brand-600">
                <TrendingUp size={32} />
            </div>
            <div>
                <h4 className="font-bold text-slate-900">Развитие</h4>
                <p className="text-sm text-slate-500">Помощь в масштабировании бизнеса</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-brand-50 p-3 rounded-full text-brand-600">
                <Users size={32} />
            </div>
            <div>
                <h4 className="font-bold text-slate-900">Поддержка</h4>
                <p className="text-sm text-slate-500">Особые условия для ветеранов</p>
            </div>
        </div>
      </div>

      {/* Services Preview */}
      <Section title="Направления деятельности" subtitle="Мы предлагаем полный спектр услуг для запуска и сопровождения вашего дела.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service) => (
            <div key={service.id} className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="bg-brand-50 w-14 h-14 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <service.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6 line-clamp-3">
                {service.description}
              </p>
              <Link to="/services" className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700">
                Подробнее <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* Social Mission / Veteran Support Highlight - REDESIGNED */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-full md:w-2/3 h-full opacity-10 pointer-events-none mix-blend-overlay">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.3C93.5,8.6,82.1,21.5,70.9,32.2C59.7,42.9,48.8,51.4,37.1,58.3C25.4,65.2,12.9,70.5,-0.7,71.7C-14.3,72.9,-27.1,70.1,-38.6,63.6C-50.1,57.1,-60.3,46.9,-68.6,35C-76.9,23.1,-83.3,9.5,-82.3,-3.8C-81.3,-17.1,-72.9,-30.1,-62.7,-40.5C-52.5,-50.9,-40.5,-58.7,-28.3,-67.2C-16.1,-75.7,-3.7,-84.9,4.8,-93.2L13.3,-101.5L44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-3/5 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-red-600 p-2 rounded text-white shadow-lg shadow-red-600/30">
                                <Star fill="currentColor" size={24} />
                            </div>
                            <span className="text-brand-300 font-bold tracking-wider text-sm uppercase">Социальная миссия</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            Поддержка ветеранов боевых действий
                            <span className="block text-brand-400 text-2xl md:text-3xl mt-2 font-normal">в запуске и развитии деловых инициатив</span>
                        </h2>
                        
                        <p className="text-slate-200 text-lg mb-8 leading-relaxed max-w-2xl">
                            Мы верим, что опыт службы закаляет характер, необходимый для успешного бизнеса. 
                            Наша организация предоставляет <strong>специальные условия</strong>, бесплатное обучение и всестороннюю менторскую поддержку ветеранам, желающим начать своё дело.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/veterans" className="inline-flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-red-900/50">
                                Узнать подробнее о программе
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="lg:w-2/5 w-full">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl">
                            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-brand-400" />
                                Что мы предлагаем:
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Бесплатная регистрация бизнеса под ключ",
                                    "Помощь в получении государственных грантов",
                                    "Льготное бухгалтерское сопровождение",
                                    "Индивидуальное наставничество"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-200 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-brand-400 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* News & Analytics */}
      <Section title="Новости и Аналитика" subtitle="Будьте в курсе последних изменений законодательства и событий организации.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map(item => (
                <article key={item.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                item.category === 'Analytics' ? 'bg-purple-100 text-purple-700' :
                                item.category === 'Event' ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {item.category === 'Analytics' ? 'Аналитика' : item.category === 'Event' ? 'Событие' : 'Новости'}
                            </span>
                            <span className="text-slate-400 text-sm">{item.date}</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-3 hover:text-brand-600 transition-colors cursor-pointer">
                            {item.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                            {item.summary}
                        </p>
                        <a href="#" className="text-brand-600 font-medium text-sm hover:underline">Читать далее</a>
                    </div>
                </article>
            ))}
        </div>
      </Section>

      {/* CTA Section */}
      <div className="bg-brand-50 py-16">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Готовы начать свое дело?</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Запишитесь на бесплатную первичную консультацию, и мы поможем выбрать оптимальную форму регистрации и систему налогообложения.
            </p>
            <Link to="/contacts" className="bg-brand-600 text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-brand-700 transition-colors">
                Записаться на консультацию
            </Link>
        </div>
      </div>
    </>
  );
};

export default Home;