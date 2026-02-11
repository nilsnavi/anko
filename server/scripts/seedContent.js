require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const News = require('../models/News');
const TeamMember = require('../models/TeamMember');
const FAQ = require('../models/FAQ');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting_ecosystem';

// Sample services data
const servicesData = [
    {
        serviceId: 'registration',
        title: 'Регистрация бизнеса',
        description: 'Полный цикл регистрации ИП и ООО. Помощь в выборе системы налогообложения и подготовка документов.',
        icon: 'Building2',
        details: [
            'Регистрация ООО и ИП под ключ',
            'Внесение изменений в ЕГРЮЛ/ЕГРИП',
            'Ликвидация предприятий'
        ],
        order: 1
    },
    {
        serviceId: 'accounting',
        title: 'Бухгалтерское сопровождение',
        description: 'Профессиональное ведение бухгалтерского учета, сдача отчетности и взаимодействие с фондами.',
        icon: 'Calculator',
        details: [
            'Аутсорсинг бухгалтерии',
            'Восстановление учета',
            'Кадровый учет и расчет зарплаты'
        ],
        order: 2
    },
    {
        serviceId: 'consultation',
        title: 'Консультации и аудит',
        description: 'Экспертные консультации по вопросам налогообложения, аудит и оптимизация бизнес-процессов.',
        icon: 'Briefcase',
        details: [
            'Налоговый консультинг',
            'Аудит финансовой отчетности',
            'Оптимизация налогообложения'
        ],
        order: 3
    }
];

// Sample FAQ data
const faqData = [
    {
        question: 'Какие документы нужны для регистрации ИП?',
        answer: 'Для регистрации ИП потребуются: паспорт, ИНН, заявление по форме Р21001, квитанция об уплате госпошлины (если не подаете документы электронно).',
        category: 'Регистрация',
        order: 1
    },
    {
        question: 'Сколько стоят ваши услуги?',
        answer: 'Стоимость услуг зависит от выбранного пакета и специфики бизнеса. Мы предлагаем индивидуальный подход и готовы обсудить оптимальные условия.',
        category: 'Услуги',
        order: 2
    },
    {
        question: 'Как долго длится регистрация бизнеса?',
        answer: 'Регистрация ИП обычно занимает 3 рабочих дня, ООО — от 5 до 7 рабочих дней при электронной подаче документов.',
        category: 'Регистрация',
        order: 3
    }
];

// Sample team data
const teamData = [
    {
        name: 'Елена Иванова',
        role: 'Главный бухгалтер',
        imageUrl: 'https://ui-avatars.com/api/?name=Elena+Ivanova&size=200&background=0D8ABC&color=fff',
        bio: 'Опыт работы более 15 лет. Специализация: налоговый учет и оптимизация.',
        order: 1
    },
    {
        name: 'Михаил Петров',
        role: 'Специалист по регистрации',
        imageUrl: 'https://ui-avatars.com/api/?name=Mihail+Petrov&size=200&background=0D8ABC&color=fff',
        bio: 'Эксперт в области регистрации бизнеса. Более 500 успешных регистраций.',
        order: 2
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Service.deleteMany({}),
            News.deleteMany({}),
            TeamMember.deleteMany({}),
            FAQ.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Insert services
        console.log('📝 Inserting services...');
        const services = await Service.insertMany(servicesData);
        console.log(`✅ Inserted ${services.length} services`);

        // Insert FAQ
        console.log('❓ Inserting FAQ...');
        const faq = await FAQ.insertMany(faqData);
        console.log(`✅ Inserted ${faq.length} FAQ items`);

        // Insert team members
        console.log('👥 Inserting team members...');
        const team = await TeamMember.insertMany(teamData);
        console.log(`✅ Inserted ${team.length} team members`);

        // Insert sample news
        console.log('📰 Inserting news...');
        const news = await News.create({
            title: 'Добро пожаловать!',
            summary: 'Мы рады приветствовать вас на нашем обновленном сайте.',
            content: 'Наша компания предоставляет полный спектр бухгалтерских услуг для малого и среднего бизнеса.',
            category: 'News',
            date: new Date()
        });
        console.log('✅ Inserted news article');

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('----------------------------------------');
        console.log(`Services: ${services.length}`);
        console.log(`FAQ: ${faq.length}`);
        console.log(`Team: ${team.length}`);
        console.log(`News: 1`);
        console.log('----------------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
