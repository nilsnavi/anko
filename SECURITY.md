# Политика безопасности

## Поддерживаемые версии

Мы обеспечиваем обновления безопасности для следующих версий проекта:

| Версия | Поддержка         |
| ------ | ----------------- |
| 1.x.x  | :white_check_mark: |
| < 1.0  | :x:                |

## Сообщение об уязвимости

Безопасность нашего проекта и наших пользователей - наш главный приоритет. Если вы обнаружили уязвимость безопасности, пожалуйста, **не создавайте публичный issue**.

### Как сообщить об уязвимости

1. **Email**: Отправьте детальное описание на `security@ecosystem-pbs.ru`
2. **Включите**:
   - Тип уязвимости
   - Полное описание с шагами для воспроизведения
   - Потенциальное влияние
   - Предлагаемое исправление (если есть)

### Что ожидать

- **Подтверждение** в течение 48 часов
- **Оценка** уязвимости в течение 7 дней
- **Исправление** критических уязвимостей в течение 14 дней
- **Публикация** патча и advisory после исправления

### Ответственное раскрытие

- Дайте нам разумное время для исправления до публичного раскрытия
- При публикации упомяните нас (@nilsnavi)
- Мы упомянем вас в credits (если хотите)

## Рекомендации по безопасности

### Для разработчиков

#### 1. Переменные окружения

**✗ Плохо:**
```env
JWT_SECRET=secret123
MONGODB_URI=mongodb://admin:admin@localhost/db
```

**✓ Хорошо:**
```env
JWT_SECRET=8f7a3b2e9d1c4a5f6b8e7d9c2a1b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d
MONGODB_URI=mongodb://strong_user:Str0ng_P@ssw0rd_Here@localhost/db
```

Генерация безопасного ключа:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2. Зависимости

Регулярно проверяйте и обновляйте зависимости:

```bash
# Проверка уязвимостей
npm audit

# Исправление автоматически
npm audit fix

# Обновление зависимостей
npm update
```

#### 3. Аутентификация

- Используйте bcrypt с минимум 10 раундами для паролей
- Храните JWT в httpOnly cookies (не в localStorage)
- Используйте refresh токены
- Реализуйте rate limiting для логина

#### 4. Валидация данных

Всегда валидируйте входные данные:

```javascript
// Backend
const { body, validationResult } = require('express-validator');

app.post('/api/users', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ...
});
```

#### 5. CORS

В production используйте конкретные домены:

```javascript
// ✗ Плохо
app.use(cors({ origin: '*' }));

// ✓ Хорошо
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'https://your-domain.com',
  credentials: true 
}));
```

#### 6. Защита headers (Helmet)

```javascript
const helmet = require('helmet');
app.use(helmet());
```

#### 7. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов
});

app.use('/api/', limiter);
```

### Для администраторов

#### 1. MongoDB

**Аутентификация:**
```bash
# Создайте пользователя с ограниченными правами
use accounting_ecosystem
db.createUser({
  user: "app_user",
  pwd: "strong_password",
  roles: [{ role: "readWrite", db: "accounting_ecosystem" }]
})
```

**Firewall:**
```bash
# Закройте MongoDB от внешнего доступа
sudo ufw deny 27017
```

#### 2. HTTPS/SSL

Всегда используйте HTTPS в production:

**Nginx:**
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Современные SSL протоколы
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

#### 3. Firewall

```bash
# Базовая настройка UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

#### 4. Обновления системы

```bash
# Регулярные обновления
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

#### 5. Логирование

Настройте централизованное логирование:

```javascript
// Winston logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Логирование всех запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userId: req.user?.id
  });
  next();
});
```

#### 6. Backup

Автоматический backup MongoDB:

```bash
#!/bin/bash
# backup.sh
mongodump --db accounting_ecosystem --out /backup/$(date +%Y%m%d)
find /backup -type d -mtime +30 -exec rm -rf {} \;
```

Cron:
```bash
0 2 * * * /path/to/backup.sh
```

### Для пользователей

#### 1. Пароли

- Используйте уникальные пароли для каждого сервиса
- Минимум 12 символов
- Комбинация букв, цифр и специальных символов
- Используйте менеджер паролей

#### 2. Двухфакторная аутентификация

Включите 2FA везде, где возможно (GitHub, облачные сервисы, etc.)

#### 3. Обновления

- Обновляйте браузер
- Обновляйте операционную систему
- Следите за security advisories проекта

## Известные проблемы безопасности

### Решенные

| CVE ID | Описание | Затронутые версии | Исправлено в |
|--------|----------|-------------------|--------------|
| -      | -        | -                 | -            |

### В процессе решения

| Issue ID | Описание | Приоритет | ETA |
|----------|----------|-----------|-----|
| -        | -        | -         | -   |

## Security Checklist для Production

Перед деплоем в production убедитесь:

### Backend

- [ ] `NODE_ENV=production` установлен
- [ ] JWT_SECRET - сложный случайный ключ (32+ символа)
- [ ] MongoDB имеет аутентификацию
- [ ] MongoDB недоступен извне (firewall)
- [ ] CORS настроен на конкретные домены
- [ ] Rate limiting включен
- [ ] Helmet middleware используется
- [ ] HTTPS/SSL настроен
- [ ] Логирование настроено
- [ ] Backup настроен
- [ ] Error handling не раскрывает sensitive информацию
- [ ] Зависимости обновлены (`npm audit`)

### Frontend

- [ ] API calls используют HTTPS
- [ ] Sensitive данные не логируются в console
- [ ] Нет hardcoded credentials
- [ ] Environment variables настроены правильно
- [ ] Build минифицирован
- [ ] Source maps отключены в production

### Infrastructure

- [ ] Firewall настроен
- [ ] SSH доступ только по ключам
- [ ] Root login отключен
- [ ] Обновления безопасности автоматизированы
- [ ] Мониторинг и алерты настроены
- [ ] Backup протестирован
- [ ] Disaster recovery план существует

## Ресурсы

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

## Контакты

- **Email**: security@ecosystem-pbs.ru
- **GitHub**: [@nilsnavi](https://github.com/nilsnavi)

---

**Спасибо за помощь в обеспечении безопасности проекта!** 🔒
