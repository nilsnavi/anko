# АНО ПБС «Экосистема учёта»

Профессиональное бухгалтерское сопровождение и комплексная поддержка бизнеса в Новороссийске.

## О проекте

Официальный сайт автономной некоммерческой организации по бухгалтерскому сопровождению «Экосистема учёта». Мы предоставляем полный спектр бухгалтерских услуг для малого и среднего бизнеса, а также специальные программы поддержки для ветеранов.

### Основные разделы

- **Главная** - информация о компании и ключевых услугах
- **О нас** - история, миссия и ценности организации
- **Услуги** - полный перечень бухгалтерских услуг
- **Ветераны** - специальные программы поддержки
- **Обучение** - образовательные программы для бизнеса
- **Контакты** - связь с нами

### Админ-панель

Управление контентом сайта (услуги, новости, команда, FAQ, клиенты).

## Технологии

- React 19 + TypeScript
- Vite (сборка)
- Tailwind CSS
- React Router (HashRouter для совместимости с Netlify)
- Lucide React (иконки)

## Запуск локально

### Требования

- Node.js 18+
- npm
- MongoDB (для backend)

### Быстрая проверка

Проверьте готовность среды разработки:

**Windows:**

```bash
scripts\health-check.bat
```

**Linux/MacOS:**

```bash
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

### Установка и запуск

#### Frontend

```bash
# Установка зависимостей
npm install

# Создайте .env файл на основе примера
cp .env.example .env

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

#### Backend (опционально для локальной разработки)

```bash
# Перейдите в директорию сервера
cd server

# Установка зависимостей
npm install

# Создайте .env файл на основе примера
cp .env.example .env
# Отредактируйте .env файл и укажите свои настройки

# Запуск dev-сервера с nodemon
npm run dev

# Или запуск production сервера
npm start
```

**Примечание**: Убедитесь, что MongoDB запущен перед стартом backend сервера.

## 🎉 Последние улучшения

### Backend API (Production-Ready)

✅ **MongoDB интеграция**

- Полноценная модель User с валидацией
- Автоматическое хеширование паролей
- Управление refresh токенами в БД

✅ **Безопасность**

- Rate limiting (защита от брутфорса)
- Улучшенная обработка ошибок
- JWT с refresh токенами
- Защита от email enumeration

✅ **Валидация и middleware**

- Валидация всех входных данных
- Role-based access control (RBAC)
- Централизованная обработка ошибок
- Graceful shutdown

✅ **DevOps**

- Health check endpoint
- Environment-based конфигурация
- Скрипт создания администратора
- Подробная документация

📖 **Подробнее**: См. [server/MIGRATION.md](server/MIGRATION.md) для инструкций по миграции.

### Frontend улучшения

✅ **Переменные окружения**

- API URL настраивается через `.env`
- Готовность к production деплою

✅ **Accessibility**

- Добавлены aria-labels для всех интерактивных элементов
- Улучшена доступность форм

✅ **Документация**

- Обновлённый README с подробными инструкциями
- Примеры конфигурации
- Полное руководство по деплою ([DEPLOYMENT.md](DEPLOYMENT.md))
- Скрипты для проверки здоровья системы

✅ **Улучшенные .env.example файлы**

- Подробные комментарии для всех переменных
- Примеры для разных окружений
- Рекомендации по безопасности
- Дополнительные опции конфигурации

## Деплой на Netlify

### Автоматический деплой

1. Подключите репозиторий к Netlify
2. Netlify автоматически определит настройки из `netlify.toml`
3. Сайт будет доступен по адресу `https://your-site.netlify.app`

### Ручной деплой

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Деплой директории dist
netlify deploy --prod --dir=dist
```

📖 **Подробная документация по деплою**: См. [DEPLOYMENT.md](DEPLOYMENT.md) для полного руководства по развертыванию в production.

## Скрипты

### Frontend (app)

```bash
npm run dev          # Запуск dev-сервера
npm run build        # Сборка для продакшена
npm run preview      # Предпросмотр сборки
```

### Backend

```bash
cd server
npm start            # Запуск production сервера
npm run dev          # Запуск dev-сервера с nodemon
npm run create-admin # Создание администратора
```

### Утилиты

**health-check** - Проверка готовности среды разработки

- Проверяет наличие Node.js, npm, MongoDB
- Проверяет зависимости и конфигурацию
- Проверяет уязвимости в зависимостях

```bash
# Windows
scripts\health-check.bat

# Linux/MacOS
./scripts/health-check.sh
```

## Структура проекта

```text
├── public/              # Статические файлы
├── scripts/            # Утилиты и скрипты
│   ├── health-check.sh # Проверка окружения (Linux/Mac)
│   ├── health-check.bat # Проверка окружения (Windows)
│   └── generate-secret.js # Генератор секретов
├── server/             # Backend API
│   ├── db/            # Database utilities
│   ├── middleware/    # Express middleware
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── scripts/       # Server scripts
│   └── utils/         # Utilities
├── src/               # Frontend React app
│   ├── components/    # Переиспользуемые компоненты
│   ├── context/       # React Context
│   ├── pages/         # Страницы приложения
│   │   └── admin/    # Админ-панель
│   ├── App.tsx
│   └── index.tsx
├── .env.example       # Пример конфигурации frontend
├── CHANGELOG.md       # История изменений
├── CODE_OF_CONDUCT.md # Кодекс поведения
├── CONTRIBUTING.md    # Руководство для контрибьюторов
├── DEPLOYMENT.md      # Руководство по деплою
├── SECURITY.md        # Политика безопасности
├── netlify.toml       # Конфигурация Netlify
└── vite.config.ts     # Конфигурация Vite
```

## Конфигурация Netlify

Файл `netlify.toml` настроен для:

- Использования Node.js 18
- Сборки командой `npm run build`
- Публикации директории `dist`
- Обработки SPA-роутинга (все запросы → index.html)

## Документация

- 📖 [Руководство по деплою](DEPLOYMENT.md) - Полное руководство по развертыванию в production
- 🤝 [Руководство для контрибьюторов](CONTRIBUTING.md) - Как внести вклад в проект
- 🔒 [Политика безопасности](SECURITY.md) - Рекомендации по безопасности и как сообщить об уязвимости
- 📜 [Кодекс поведения](CODE_OF_CONDUCT.md) - Правила поведения в сообществе
- 📝 [История изменений](CHANGELOG.md) - Список изменений между версиями
- 🔄 [Миграция на MongoDB](server/MIGRATION.md) - Инструкции по миграции backend

## Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с [руководством для контрибьюторов](CONTRIBUTING.md) перед началом работы.

### Быстрый старт для контрибьюторов

1. Форкните репозиторий
2. Создайте ветку для вашей функции: `git checkout -b feature/amazing-feature`
3. Закоммитьте изменения: `git commit -m 'feat: add amazing feature'`
4. Отправьте в ветку: `git push origin feature/amazing-feature`
5. Откройте Pull Request

## Лицензия

© 2024-2026 АНО ПБС «Экосистема учёта». Все права защищены.
