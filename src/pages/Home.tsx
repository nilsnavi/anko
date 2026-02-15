import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight, CheckCircle2, TrendingUp, Users, ShieldCheck, Medal, Star,
    Building2, Calculator, GraduationCap, Scale, Printer
} from 'lucide-react';
import Section from '../components/Section';
import { useData } from '../context/DataContext';
import { FadeInWhenVisible, StaggerContainer, StaggerItem } from '../components/animations';
import { GridSkeleton } from '../components/Skeleton';
import { NewsFilterBar, filterNews } from '../components/FilterBar';
// Icon mapping for services (from API string to component)
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Building2,
    Calculator,
    Medal,
    GraduationCap,
    Scale,
    Printer
};

// Helper to get icon component from service icon string
const getServiceIcon = (iconName: unknown) => {
    const name = String(iconName);
    return iconMap[name] || Building2;
};

const Home: React.FC = () => {
    const { services, news, loading } = useData();

    // News filters state
    const [newsFilters, setNewsFilters] = useState<{
        category: string | null;
        dateRange: 'all' | 'week' | 'month' | 'year';
    }>({
        category: null,
        dateRange: 'all',
    });

    // Get unique categories from news
    const newsCategories = useMemo(() => {
        const categories = new Set(news.map((item) => item.category));
        return Array.from(categories);
    }, [news]);

    // Filtered news
    const filteredNews = useMemo(() => {
        return filterNews(news, newsFilters);
    }, [news, newsFilters]);

    return (
        <>
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white pt-24 pb-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="/hero-bg.jpg"
                        alt="Office Background"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-slate-900/70"></div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
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
            <FadeInWhenVisible delay={0.2}>
                <div className="bg-white border-b border-slate-100 relative z-20 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        className="flex items-center gap-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <motion.div
                            className="bg-brand-50 p-3 rounded-full text-brand-600"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ShieldCheck size={32} />
                        </motion.div>
                        <div>
                            <h4 className="font-bold text-slate-900">Надежность</h4>
                            <p className="text-sm text-slate-500">Полная ответственность за результат</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <motion.div
                            className="bg-brand-50 p-3 rounded-full text-brand-600"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TrendingUp size={32} />
                        </motion.div>
                        <div>
                            <h4 className="font-bold text-slate-900">Развитие</h4>
                            <p className="text-sm text-slate-500">Помощь в масштабировании бизнеса</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <motion.div
                            className="bg-brand-50 p-3 rounded-full text-brand-600"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Users size={32} />
                        </motion.div>
                        <div>
                            <h4 className="font-bold text-slate-900">Поддержка</h4>
                            <p className="text-sm text-slate-500">Особые условия для ветеранов</p>
                        </div>
                    </motion.div>
                </div>
            </FadeInWhenVisible>

            {/* Services Preview */}
            <Section title="Направления деятельности" subtitle="Мы предлагаем полный спектр услуг для запуска и сопровождения вашего дела.">
                {loading ? (
                    <GridSkeleton count={6} type="service" />
                ) : (
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
                        {services.slice(0, 6).map((service) => {
                            const ServiceIcon = getServiceIcon(service.icon);
                            return (
                                <StaggerItem key={service.id}>
                                    <motion.div
                                        className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 cursor-pointer"
                                        whileHover={{
                                            y: -8,
                                            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    >
                                        <motion.div
                                            className="bg-brand-50 w-14 h-14 rounded-xl flex items-center justify-center text-brand-600 mb-6 transition-colors"
                                            whileHover={{
                                                backgroundColor: '#0ea5e9',
                                                color: '#ffffff',
                                                rotate: [0, -10, 10, 0],
                                            }}
                                            transition={{
                                                backgroundColor: { duration: 0.3 },
                                                color: { duration: 0.3 },
                                                rotate: { duration: 0.5 },
                                            }}
                                        >
                                            <ServiceIcon size={28} />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-600 mb-6 line-clamp-3">
                                            {service.description}
                                        </p>
                                        <Link
                                            to="/services"
                                            className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700 group/link"
                                        >
                                            Подробнее
                                            <motion.span
                                                className="ml-1 inline-block"
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 4 }}
                                                transition={{ type: 'spring', stiffness: 400 }}
                                            >
                                                <ArrowRight size={16} />
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                )}
            </Section>

            {/* Social Mission / Veteran Support Highlight - REDESIGNED */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src="/veterans-business-bg.jpg"
                                alt="Business Support Background"
                                className="w-full h-full object-cover"
                            />
                            {/* Dark overlay for better text readability */}
                            <div className="absolute inset-0 bg-slate-900/80"></div>
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-brand-900/80"></div>
                        </div>

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
                {!loading && (
                    <NewsFilterBar
                        filters={newsFilters}
                        onChange={setNewsFilters}
                        availableCategories={newsCategories}
                    />
                )}
                {loading ? (
                    <GridSkeleton count={3} type="news" />
                ) : filteredNews.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">Новости не найдены</p>
                        <button
                            onClick={() => setNewsFilters({ category: null, dateRange: 'all' })}
                            className="mt-4 text-brand-600 hover:underline"
                        >
                            Сбросить фильтры
                        </button>
                    </div>
                ) : (
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
                        {filteredNews.map((item) => (
                            <StaggerItem key={item.id}>
                                <motion.article
                                    className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer h-full"
                                    whileHover={{
                                        y: -6,
                                        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 20,
                                    }}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <motion.span
                                                className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.category === 'Analytics'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : item.category === 'Event'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {item.category === 'Analytics'
                                                    ? 'Аналитика'
                                                    : item.category === 'Event'
                                                        ? 'Событие'
                                                        : 'Новости'}
                                            </motion.span>
                                            <span className="text-slate-400 text-sm">{item.date}</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-brand-600 transition-colors cursor-pointer">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                            {item.summary}
                                        </p>
                                        <motion.a
                                            href="#"
                                            className="text-brand-600 font-medium text-sm inline-flex items-center gap-1"
                                            whileHover={{ x: 4 }}
                                            transition={{ type: 'spring', stiffness: 400 }}
                                        >
                                            Читать далее
                                            <ArrowRight size={14} />
                                        </motion.a>
                                    </div>
                                </motion.article>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                )}
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