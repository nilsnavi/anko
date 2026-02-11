# Руководство по деплою

Подробное руководство по развертыванию приложения "АНО ПБС Экосистема учёта" в production окружении.

## 📋 Содержание

- [Подготовка к деплою](#подготовка-к-деплою)
- [Frontend Деплой](#frontend-деплой)
- [Backend Деплой](#backend-деплой)
- [Настройка MongoDB](#настройка-mongodb)
- [Безопасность](#безопасность)
- [Мониторинг](#мониторинг)
- [Резервное копирование](#резервное-копирование)

## Подготовка к деплою

### Чеклист перед деплоем

- [ ] Все тесты проходят успешно
- [ ] Код прошел code review
- [ ] Обновлены зависимости до стабильных версий
- [ ] Настроены переменные окружения
- [ ] Создан и проверен backup БД
- [ ] Подготовлена документация

### Требования

**Frontend:**
- Node.js 18+ LTS
- npm 9+

**Backend:**
- Node.js 18+ LTS
- MongoDB 6.0+
- Nginx (рекомендуется)
- SSL сертификат (Let's Encrypt)

## Frontend Деплой

### Деплой на Netlify (рекомендуется)

#### Автоматический деплой через GitHub

1. Подключите репозиторий к Netlify:
   ```bash
   # Netlify автоматически определит настройки из netlify.toml
   ```

2. Настройте переменные окружения в Netlify Dashboard:
   ```
   VITE_API_URL=https://your-api-domain.com
   VITE_APP_NAME=АНО ПБС Экосистема учёта
   ```

3. Настройка кастомного домена:
   - Settings → Domain management → Add custom domain
   - Настройте DNS записи у вашего провайдера

4. SSL сертификат настроится автоматически

#### Ручной деплой

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Логин в Netlify
netlify login

# Деплой
netlify deploy --prod --dir=dist
```

### Деплой на Vercel

```bash
# Установка Vercel CLI
npm install -g vercel

# Логин
vercel login

# Деплой
vercel --prod
```

Настройте переменные окружения в Vercel Dashboard.

### Деплой на собственный сервер

```bash
# 1. Сборка проекта
npm run build

# 2. Загрузите содержимое папки dist на сервер
scp -r dist/* user@your-server:/var/www/html/

# 3. Настройте Nginx
```

#### Конфигурация Nginx для SPA

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    root /var/www/html;
    index index.html;
    
    # Gzip компрессия
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Backend Деплой

### Деплой на VPS (Ubuntu/Debian)

#### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Запуск MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Установка PM2 для управления процессами
sudo npm install -g pm2
```

#### 2. Загрузка и настройка приложения

```bash
# Клонирование репозитория
cd /var/www
sudo git clone https://github.com/your-username/anko.git
cd anko/server

# Установка зависимостей
npm install --production

# Создание .env файла
sudo nano .env
```

Настройте `.env`:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/accounting_ecosystem
JWT_SECRET=<сгенерируйте сложный ключ>
CORS_ORIGIN=https://your-frontend-domain.com
```

#### 3. Создание администратора

```bash
npm run create-admin
```

#### 4. Запуск с PM2

```bash
# Запуск приложения
pm2 start server.js --name anko-backend

# Автозапуск при перезагрузке сервера
pm2 startup
pm2 save

# Мониторинг
pm2 monit
```

#### 5. Настройка Nginx как reverse proxy

```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;
    
    # Логи
    access_log /var/log/nginx/api.access.log;
    error_log /var/log/nginx/api.error.log;
    
    # Proxy настройки
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Увеличенный timeout для загрузки файлов
    client_max_body_size 10M;
}
```

### Деплой на Railway

1. Установка Railway CLI:
```bash
npm install -g @railway/cli
```

2. Логин и инициализация:
```bash
railway login
cd server
railway init
```

3. Добавление переменных окружения:
```bash
railway variables set MONGODB_URI=<your-mongodb-uri>
railway variables set JWT_SECRET=<your-secret>
railway variables set CORS_ORIGIN=<your-frontend-url>
```

4. Деплой:
```bash
railway up
```

### Деплой на Heroku

```bash
# Установка Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Логин
heroku login

# Создание приложения
cd server
heroku create anko-backend

# Добавление MongoDB (MongoDB Atlas)
# Настройте Atlas отдельно и получите connection string

# Установка переменных окружения
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=<your-frontend-url>

# Деплой
git push heroku main
```

## Настройка MongoDB

### MongoDB Atlas (рекомендуется для production)

1. Создайте бесплатный кластер на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Настройте Network Access:
   - Добавьте IP адрес вашего сервера
   - Или разрешите доступ со всех IP (0.0.0.0/0) с сильным паролем

3. Создайте Database User с правами readWrite

4. Получите connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/accounting_ecosystem?retryWrites=true&w=majority
   ```

5. Используйте в `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accounting_ecosystem?retryWrites=true&w=majority
   ```

### Локальный MongoDB на VPS

```bash
# Настройка аутентификации
mongo

use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["root"]
})

use accounting_ecosystem
db.createUser({
  user: "app_user",
  pwd: "app_password",
  roles: [{ role: "readWrite", db: "accounting_ecosystem" }]
})
exit

# Включение аутентификации
sudo nano /etc/mongod.conf
```

Добавьте в `mongod.conf`:
```yaml
security:
  authorization: enabled
```

```bash
# Перезапуск MongoDB
sudo systemctl restart mongod

# Connection string
MONGODB_URI=mongodb://app_user:app_password@localhost:27017/accounting_ecosystem
```

## Безопасность

### Обязательные настройки безопасности

#### 1. Сильные секреты JWT

```bash
# Генерация безопасного ключа
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 2. Настройка Firewall (UFW на Ubuntu)

```bash
# Разрешить SSH
sudo ufw allow 22

# Разрешить HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Закрыть MongoDB от внешнего доступа
sudo ufw deny 27017

# Активировать firewall
sudo ufw enable
```

#### 3. SSL/TLS сертификат (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# Авто-обновление сертификата
sudo certbot renew --dry-run
```

#### 4. Обновление зависимостей

```bash
# Проверка уязвимостей
npm audit

# Автоматическое исправление
npm audit fix

# В production окружении
npm ci
```

#### 5. Rate Limiting

Настроено в `server/middleware/rateLimiter.js`. Проверьте настройки:
- Логин: 5 попыток за 15 минут
- API запросы: 100 запросов за 15 минут

#### 6. CORS настройки

Убедитесь, что `CORS_ORIGIN` установлен на конкретный домен:
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

Не используйте `*` в production!

## Мониторинг

### PM2 мониторинг

```bash
# Статус приложения
pm2 status

# Логи
pm2 logs anko-backend

# Мониторинг ресурсов
pm2 monit

# Просмотр метрик
pm2 show anko-backend
```

### Системный мониторинг

```bash
# Использование диска
df -h

# Использование памяти
free -h

# CPU и процессы
top

# MongoDB статистика
mongo --eval "db.serverStatus()"
```

### Настройка логирования

PM2 автоматически управляет логами. Расположение:
```
~/.pm2/logs/anko-backend-out.log  # stdout
~/.pm2/logs/anko-backend-error.log  # stderr
```

Ротация логов:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Резервное копирование

### Автоматический backup MongoDB

Создайте скрипт `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mongodb"
DB_NAME="accounting_ecosystem"

# Создание директории
mkdir -p $BACKUP_DIR

# Backup
mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# Сжатие
tar -czf $BACKUP_DIR/$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/$DATE.tar.gz"
```

Настройка cron:
```bash
# Редактирование crontab
crontab -e

# Добавление ежедневного backup в 2:00
0 2 * * * /path/to/backup.sh >> /var/log/mongodb-backup.log 2>&1
```

### Восстановление из backup

```bash
# Распаковка
tar -xzf backup_20260211_020000.tar.gz

# Восстановление
mongorestore --db accounting_ecosystem backup_20260211_020000/accounting_ecosystem
```

## Обновление приложения

### Стратегия Zero-Downtime

```bash
# 1. Backup БД
./backup.sh

# 2. Получение новой версии
cd /var/www/anko
git fetch origin
git checkout main
git pull origin main

# 3. Обновление зависимостей
cd server
npm install --production

# 4. Перезапуск с graceful reload
pm2 reload anko-backend

# 5. Проверка
pm2 logs anko-backend --lines 50
```

### Rollback в случае проблем

```bash
# Откат к предыдущей версии
git reset --hard HEAD~1

# Восстановление зависимостей
npm ci

# Перезапуск
pm2 reload anko-backend
```

## Troubleshooting

### Проблемы с подключением к БД

```bash
# Проверка статуса MongoDB
sudo systemctl status mongod

# Проверка логов MongoDB
sudo tail -f /var/log/mongodb/mongod.log

# Тест подключения
mongo "mongodb://localhost:27017/accounting_ecosystem"
```

### Высокое использование памяти

```bash
# Перезапуск с ограничением памяти
pm2 delete anko-backend
pm2 start server.js --name anko-backend --max-memory-restart 500M
```

### Проблемы с SSL

```bash
# Проверка сертификата
sudo certbot certificates

# Обновление сертификата
sudo certbot renew

# Тест SSL конфигурации
sudo nginx -t
```

## Полезные команды

```bash
# PM2
pm2 restart anko-backend     # Перезапуск
pm2 stop anko-backend        # Остановка
pm2 delete anko-backend      # Удаление из PM2
pm2 logs --lines 100         # Последние 100 строк логов

# Nginx
sudo nginx -t                # Тест конфигурации
sudo systemctl reload nginx  # Перезагрузка конфигурации
sudo systemctl restart nginx # Перезапуск

# MongoDB
sudo systemctl restart mongod
mongo --eval "db.stats()"

# Просмотр активных подключений
netstat -tulpn | grep LISTEN
```

## Контакты и поддержка

При возникновении проблем с деплоем:
- Проверьте логи: `pm2 logs`
- Проверьте переменные окружения: `pm2 env 0`
- Документация: [README.md](./README.md)
- Миграция на MongoDB: [server/MIGRATION.md](./server/MIGRATION.md)

---

**Важно:** Перед production деплоем обязательно протестируйте всё в staging окружении!
