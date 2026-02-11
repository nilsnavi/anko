# 🚀 Backend API Improvements

## Обзор изменений

Проект был значительно улучшен для production-ready состояния:

### ✅ Реализованные улучшения

1. **MongoDB интеграция**
   - Модель User с полной валидацией
   - Автоматическое хеширование паролей (bcrypt)
   - Управление refresh токенами в БД
   - Поддержка сброса пароля

2. **Безопасность**
   - Rate limiting для всех эндпоинтов
   - Улучшенная обработка ошибок
   - Helmet для защиты заголовков
   - JWT с refresh токенами
   - Защита от email enumeration

3. **Валидация**
   - Валидация всех входных данных
   - Custom validators для email/username/password
   - Централизованная обработка ошибок

4. **Middleware**
   - Аутентификация с проверкой существования пользователя
   - Role-based access control (RBAC)
   - Rate limiters (auth, registration, password reset)
   - Глобальная обработка ошибок

5. **DevOps**
   - Graceful shutdown
   - Health check endpoint
   - Улучшенное логирование
   - Environment-based конфигурация

## 📁 Новая структура файлов

```
server/
├── models/
│   ├── User.js              ✨ Новая модель пользователя
│   └── Content.js
├── middleware/
│   ├── auth.js              🔄 Обновлен
│   ├── errorHandler.js      ✨ Новый
│   └── rateLimiter.js       ✨ Новый
├── routes/
│   ├── auth.js              🔄 Переписан
│   ├── content.js
│   └── media.js
├── utils/
│   ├── jwt.js               ✨ Новый
│   ├── crypto.js            ✨ Новый
│   └── validators.js        ✨ Новый
├── scripts/
│   └── createAdmin.js       ✨ Новый
├── server.js                🔄 Обновлен
├── server-new.js            ✨ Новая версия (рекомендуется)
└── .env.example
```

## 🔧 Миграция на новый backend

### Шаг 1: Установка зависимостей

```bash
cd server
npm install
```

Новая зависимость: `express-rate-limit`

### Шаг 2: Настройка переменных окружения

Убедитесь, что ваш `.env` файл содержит:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/accounting_ecosystem
JWT_SECRET=your-very-secure-secret-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

⚠️ **ВАЖНО**: Измените `JWT_SECRET` на уникальный секретный ключ!

### Шаг 3: Запуск MongoDB

Убедитесь, что MongoDB запущен:

```bash
# Windows (если установлен как служба)
net start MongoDB

# Или через mongod
mongod --dbpath "C:\data\db"

# Linux/Mac
sudo systemctl start mongod
```

### Шаг 4: Создание администратора

```bash
node scripts/createAdmin.js
```

Будет создан пользователь:
- **Username**: admin
- **Email**: admin@ecosystem-pbs.ru
- **Password**: admin123

⚠️ Измените пароль после первого входа!

### Шаг 5: Запуск сервера

#### Вариант A: Новая версия (рекомендуется)

```bash
# Переименуйте файлы
mv server.js server-old.js
mv server-new.js server.js

# Запустите сервер
npm run dev
```

#### Вариант B: Тестирование

```bash
# Временно запустите новую версию
node server-new.js
```

### Шаг 6: Проверка работоспособности

```bash
# Health check
curl http://localhost:5000/health

# Тест логина
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📊 API Endpoints

### Authentication

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/auth/register` | Регистрация | 3/час |
| POST | `/api/auth/login` | Вход | 5/15мин |
| POST | `/api/auth/refresh` | Обновление токена | - |
| POST | `/api/auth/logout` | Выход | - |
| POST | `/api/auth/reset-password/request` | Запрос сброса | 3/час |
| POST | `/api/auth/reset-password/confirm` | Подтверждение сброса | - |
| GET | `/api/auth/me` | Текущий пользователь | - |

### General

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api` | API информация |

## 🔒 Rate Limiting

- **API общий**: 100 запросов / 15 минут
- **Вход**: 5 попыток / 15 минут (не считая успешные)
- **Регистрация**: 3 попытки / час
- **Сброс пароля**: 3 попытки / час

## 🐛 Обработка ошибок

Все ошибки возвращаются в стандартном формате:

```json
{
  "status": "fail",
  "message": "Описание ошибки"
}
```

HTTP коды:
- `400` - Bad Request (валидация)
- `401` - Unauthorized (не авторизован)
- `403` - Forbidden (нет прав)
- `404` - Not Found
- `409` - Conflict (дубликат)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## 🔐 Безопасность

### Хеширование паролей
Все пароли хешируются с помощью bcrypt (10 раундов) перед сохранением.

### JWT токены
- **Access Token**: 24 часа
- **Refresh Token**: 7 дней (хранится в БД)

### Защита от атак
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ CORS конфигурация
- ✅ Email enumeration protection
- ✅ Password reset token hashing

## 📝 Лучшие практики

1. **Всегда используйте HTTPS в production**
2. **Храните JWT_SECRET в безопасности**
3. **Регулярно меняйте секретные ключи**
4. **Мониторьте логи на подозрительную активность**
5. **Включите логирование в production**

## 🧪 Тестирование

```bash
# Регистрация
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'

# Логин
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Профиль (требует токен)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚨 Важные замечания

### Удалить в production:
1. Строки с `debugToken` в password reset
2. Endpoint `GET /api/users` (в старом server.js)
3. `console.log` для токенов сброса пароля

### Добавить в production:
1. Email сервис для отправки писем
2. Логирование в файл (Winston)
3. Мониторинг (PM2, New Relic)
4. SSL сертификаты
5. Резервное копирование БД

## 🆘 Troubleshooting

**MongoDB не подключается**
```bash
# Проверьте, что MongoDB запущен
mongosh

# Проверьте MONGODB_URI в .env
```

**Rate limit ошибки**
```bash
# Временно увеличьте лимиты в middleware/rateLimiter.js
```

**Токены не работают**
```bash
# Проверьте JWT_SECRET
# Очистите refresh токены в БД:
db.users.updateMany({}, {$set: {refreshTokens: []}})
```

## 📚 Дополнительная информация

- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [JWT Introduction](https://jwt.io/introduction)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
