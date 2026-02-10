import { 
  Briefcase, 
  Calculator, 
  GraduationCap, 
  Medal, 
  Building2, 
  FileText, 
  Scale, 
  Printer 
} from "lucide-react";
import { ServiceItem, NavItem, TeamMember, NewsItem, FAQItem, Client, Inquiry } from "./types";

export const COMPANY_INFO = {
  fullName: "Автономная некоммерческая организация профессионального бухгалтерского сопровождения «Экосистема учёта»",
  shortName: "АНО ПБС «Экосистема учёта»",
  address: "Краснодарский край, г. Новороссийск, с. Цемдолина, ул. Спортивная, д. 2Б",
  phone: "+7 (918) 466-63-07",
  email: "info@ecosystem-pbs.ru",
  telegram: "https://t.me/ecosystemaucheta",
  vk: "https://vk.com/club235881364",
  max: "https://max.ru/id32355680905_biz",
  workingHours: "Пн-Пт: 09:00 - 18:00",
  coordinates: [44.75, 37.73] // Approximate coords for Tsemdolina
};

export const NAV_LINKS: NavItem[] = [
  { label: "Главная", path: "/" },
  { label: "О нас", path: "/about" },
  { label: "Услуги", path: "/services" },
  { label: "Ветеранам", path: "/veterans" },
  { label: "Обучение", path: "/education" },
  { label: "Контакты", path: "/contacts" },
];

export const SERVICES: ServiceItem[] = [
  {
    id: "registration",
    title: "Регистрация бизнеса",
    description: "Полный цикл регистрации ИП и ООО. Помощь в выборе системы налогообложения и подготовка документов.",
    icon: Building2,
    details: ["Регистрация ООО и ИП под ключ", "Внесение изменений в ЕГРЮЛ/ЕГРИП", "Ликвидация предприятий"]
  },
  {
    id: "accounting",
    title: "Бухгалтерское сопровождение",
    description: "Профессиональное ведение бухгалтерского учета, сдача отчетности и взаимодействие с фондами.",
    icon: Calculator,
    details: ["Аутсорсинг бухгалтерии", "Восстановление учета", "Кадровый учет и расчет зарплаты"]
  },
  {
    id: "veterans",
    title: "Поддержка ветеранов",
    description: "Специальные программы адаптации и помощи в запуске бизнеса для ветеранов боевых действий.",
    icon: Medal,
    details: ["Льготная регистрация бизнеса", "Менторская поддержка", "Помощь в получении грантов"]
  },
  {
    id: "education",
    title: "Обучение",
    description: "Семинары, тренинги и курсы повышения квалификации для предпринимателей.",
    icon: GraduationCap,
    details: ["Основы предпринимательства", "Налоговое планирование", "Финансовая грамотность"]
  },
  {
    id: "legal",
    title: "Правовая поддержка",
    description: "Консультации по правовым вопросам ведения бизнеса и договорная работа.",
    icon: Scale,
    details: ["Разработка договоров", "Правовой аудит", "Представительство в органах"]
  },
  {
    id: "technical",
    title: "Технические услуги",
    description: "Помощь с документацией, ККТ и электронным документооборотом.",
    icon: Printer,
    details: ["Регистрация ККТ", "Копирование и сканирование", "Настройка ЭДО"]
  }
];

export const TEAM: TeamMember[] = [
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

export const NEWS: NewsItem[] = [
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

export const FAQ_DATA: FAQItem[] = [
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

export const MOCK_CLIENTS: Client[] = [
  { id: 1, name: 'ООО "Вектор"', email: 'contact@vector.ru', company: 'ООО "Вектор"', status: 'active' },
  { id: 2, name: 'ИП Смирнов', email: 'smirnov@mail.ru', company: 'ИП Смирнов А.А.', status: 'active' },
  { id: 3, name: 'АО "ТехноСтрой"', email: 'info@technostroy.com', company: 'АО "ТехноСтрой"', status: 'active' },
  { id: 4, name: 'ИП Ковалева', email: 'kovaleva.art@gmail.com', company: 'ИП Ковалева М.С.', status: 'inactive' },
  { id: 5, name: 'ООО "ГринЛайт"', email: 'gl@bk.ru', company: 'ООО "ГринЛайт"', status: 'active' },
];

export const MOCK_INQUIRIES: Inquiry[] = [
  { id: 1001, name: 'Алексей', email: 'alex@example.com', phone: '+7 (900) 123-45-67', subject: 'Регистрация ООО', message: 'Добрый день, сколько стоит регистрация?', date: '25 Окт 2023', status: 'pending' },
  { id: 1002, name: 'Мария', email: 'maria@test.com', phone: '+7 (900) 111-22-33', subject: 'Консультация', message: 'Нужна помощь с налогами.', date: '24 Окт 2023', status: 'pending' },
  { id: 1003, name: 'Иван', email: 'ivan@work.ru', phone: '+7 (900) 999-88-77', subject: 'Вопрос', message: 'Как к вам проехать?', date: '20 Окт 2023', status: 'read' },
  { id: 1004, name: 'Дмитрий', email: 'dmitry@mail.ru', phone: '+7 (900) 555-44-22', subject: 'Обучение', message: 'Когда следующий семинар?', date: '19 Окт 2023', status: 'replied' },
];