// In-memory database for demonstration purposes
// This simulates MongoDB collections without requiring actual database installation

class InMemoryDB {
    constructor() {
        this.collections = {
            services: [],
            teamMembers: [],
            news: [],
            faqs: [],
            clients: [],
            inquiries: []
        };
        this.nextIds = {
            services: 1,
            teamMembers: 1,
            news: 1,
            faqs: 1,
            clients: 1,
            inquiries: 1001
        };
    }

    // Generic methods
    find(collection, query = {}) {
        return this.collections[collection].filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
    }

    findOne(collection, query) {
        return this.collections[collection].find(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });
    }

    insertOne(collection, doc) {
        const newDoc = { ...doc, _id: this.generateId(collection) };
        this.collections[collection].push(newDoc);
        return newDoc;
    }

    insertMany(collection, docs) {
        return docs.map(doc => this.insertOne(collection, doc));
    }

    updateOne(collection, query, update) {
        const index = this.collections[collection].findIndex(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });

        if (index !== -1) {
            this.collections[collection][index] = {
                ...this.collections[collection][index],
                ...update,
                updatedAt: new Date()
            };
            return this.collections[collection][index];
        }
        return null;
    }

    deleteOne(collection, query) {
        const index = this.collections[collection].findIndex(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
        });

        if (index !== -1) {
            const deleted = this.collections[collection].splice(index, 1);
            return deleted[0];
        }
        return null;
    }

    deleteMany(collection, query = {}) {
        const deleted = [];
        this.collections[collection] = this.collections[collection].filter(item => {
            const shouldDelete = Object.keys(query).every(key => item[key] === query[key]);
            if (shouldDelete) deleted.push(item);
            return !shouldDelete;
        });
        return deleted;
    }

    count(collection, query = {}) {
        return this.find(collection, query).length;
    }

    generateId(collection) {
        return this.nextIds[collection]++;
    }

    // Collection-specific methods
    getServices() {
        return [...this.collections.services];
    }

    getTeamMembers() {
        return [...this.collections.teamMembers];
    }

    getNews() {
        return [...this.collections.news];
    }

    getFAQs() {
        return [...this.collections.faqs];
    }

    getClients() {
        return [...this.collections.clients];
    }

    getInquiries() {
        return [...this.collections.inquiries];
    }

    // Initialize with sample data
    initializeSampleData() {
        // Clear existing data
        Object.keys(this.collections).forEach(collection => {
            this.collections[collection] = [];
        });

        // Services
        const services = [
            {
                id: "registration",
                title: "Регистрация бизнеса",
                description: "Полный цикл регистрации ИП и ООО. Помощь в выборе системы налогообложения и подготовка документов.",
                icon: "Building2",
                details: ["Регистрация ООО и ИП под ключ", "Внесение изменений в ЕГРЮЛ/ЕГРИП", "Ликвидация предприятий"]
            },
            {
                id: "accounting",
                title: "Бухгалтерское сопровождение",
                description: "Профессиональное ведение бухгалтерского учета, сдача отчетности и взаимодействие с фондами.",
                icon: "Calculator",
                details: ["Аутсорсинг бухгалтерии", "Восстановление учета", "Кадровый учет и расчет зарплаты"]
            },
            {
                id: "veterans",
                title: "Поддержка ветеранов",
                description: "Специальные программы адаптации и помощи в запуске бизнеса для ветеранов боевых действий.",
                icon: "Medal",
                details: ["Льготная регистрация бизнеса", "Менторская поддержка", "Помощь в получении грантов"]
            },
            {
                id: "education",
                title: "Обучение",
                description: "Семинары, тренинги и курсы повышения квалификации для предпринимателей.",
                icon: "GraduationCap",
                details: ["Основы предпринимательства", "Налоговое планирование", "Финансовая грамотность"]
            },
            {
                id: "legal",
                title: "Правовая поддержка",
                description: "Консультации по правовым вопросам ведения бизнеса и договорная работа.",
                icon: "Scale",
                details: ["Разработка договоров", "Правовой аудит", "Представительство в органах"]
            },
            {
                id: "technical",
                title: "Технические услуги",
                description: "Помощь с документацией, ККТ и электронным документооборотом.",
                icon: "Printer",
                details: ["Регистрация ККТ", "Копирование и сканирование", "Настройка ЭДО"]
            }
        ];

        // Team Members
        const team = [
            {
                id: 1,
                name: "Иванова Мария Сергеевна",
                role: "Директор, Главный бухгалтер",
                imageUrl: "https://picsum.photos/200/200?random=1"
            },
            {
                id: 2,
                name: "Петров Алексей Дмитриевич",
                role: "Руководитель юридического отдела",
                imageUrl: "https://picsum.photos/200/200?random=2"
            },
            {
                id: 3,
                name: "Смирнова Елена Викторовна",
                role: "Координатор образовательных программ",
                imageUrl: "https://picsum.photos/200/200?random=3"
            }
        ];

        // News
        const news = [
            {
                id: 1,
                date: "15 Окт 2023",
                title: "Изменения в налоговом законодательстве с 2024 года",
                summary: "Обзор ключевых изменений для малого бизнеса: новые лимиты по УСН и ставки страховых взносов.",
                category: "Analytics"
            },
            {
                id: 2,
                date: "10 Окт 2023",
                title: "Семинар для начинающих предпринимателей",
                summary: "Приглашаем на бесплатный семинар «От идеи до первого клиента» который пройдет в нашем центре.",
                category: "Event"
            },
            {
                id: 3,
                date: "05 Окт 2023",
                title: "Запуск программы поддержки ветеранов СВО",
                summary: "Мы запускаем специальный трек акселерации для ветеранов, желающих открыть свое дело.",
                category: "News"
            }
        ];

        // FAQ
        const faqs = [
            {
                id: 1,
                question: "Какие документы нужны для регистрации ИП?",
                answer: "Паспорт гражданина РФ, ИНН и заявление по форме Р21001. Мы поможем подготовить весь пакет."
            },
            {
                id: 2,
                question: "Как работает поддержка ветеранов?",
                answer: "Ветеранам предоставляются льготные условия на обслуживание, бесплатные консультации и приоритетное участие в образовательных программах."
            },
            {
                id: 3,
                question: "Можно ли получить консультацию удаленно?",
                answer: "Да, мы проводим консультации по телефону, видеосвязи и через электронную почту."
            }
        ];

        // Clients
        const clients = [
            { id: 1, name: 'ООО "Вектор"', email: 'contact@vector.ru', company: 'ООО "Вектор"', status: 'active' },
            { id: 2, name: 'ИП Смирнов', email: 'smirnov@mail.ru', company: 'ИП Смирнов А.А.', status: 'active' },
            { id: 3, name: 'АО "ТехноСтрой"', email: 'info@technostroy.com', company: 'АО "ТехноСтрой"', status: 'active' },
            { id: 4, name: 'ИП Ковалева', email: 'kovaleva.art@gmail.com', company: 'ИП Ковалева М.С.', status: 'inactive' },
            { id: 5, name: 'ООО "ГринЛайт"', email: 'gl@bk.ru', company: 'ООО "ГринЛайт"', status: 'active' }
        ];

        // Inquiries
        const inquiries = [
            { id: 1001, name: 'Алексей', email: 'alex@example.com', phone: '+7 (900) 123-45-67', subject: 'Регистрация ООО', message: 'Добрый день, сколько стоит регистрация?', date: '25 Окт 2023', status: 'pending' },
            { id: 1002, name: 'Мария', email: 'maria@test.com', phone: '+7 (900) 111-22-33', subject: 'Консультация', message: 'Нужна помощь с налогами.', date: '24 Окт 2023', status: 'pending' },
            { id: 1003, name: 'Иван', email: 'ivan@work.ru', phone: '+7 (900) 999-88-77', subject: 'Вопрос', message: 'Как к вам проехать?', date: '20 Окт 2023', status: 'read' },
            { id: 1004, name: 'Дмитрий', email: 'dmitry@mail.ru', phone: '+7 (900) 555-44-22', subject: 'Обучение', message: 'Когда следующий семинар?', date: '19 Окт 2023', status: 'replied' }
        ];

        // Insert sample data
        this.insertMany('services', services);
        this.insertMany('teamMembers', team);
        this.insertMany('news', news);
        this.insertMany('faqs', faqs);
        this.insertMany('clients', clients);
        this.insertMany('inquiries', inquiries);

        console.log('✅ Sample data initialized');
        console.log(`📊 Data counts: ${services.length} services, ${team.length} team members, ${news.length} news, ${faqs.length} FAQs, ${clients.length} clients, ${inquiries.length} inquiries`);
    }
}

// Export singleton instance
const db = new InMemoryDB();
db.initializeSampleData();

module.exports = db;