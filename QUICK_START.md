# Быстрый старт - Команды для разработки

Коллекция часто используемых команд для работы с проектом.

## 🚀 Первоначальная настройка

```bash
# Клонирование репозитория
git clone https://github.com/nilsnavi/anko.git
cd anko

# Установка зависимостей
npm install
cd server && npm install && cd ..

# Создание .env файлов
cp .env.example .env
cp server/.env.example server/.env

# Редактирование .env файлов
# Windows: notepad .env && notepad server\.env
# Linux/Mac: nano .env && nano server/.env

# Проверка окружения
# Windows:
scripts\health-check.bat

# Linux/Mac:
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

## 💻 Разработка

```bash
# Запуск Frontend (терминал 1)
npm run dev
# http://localhost:5173

# Запуск Backend (терминал 2)
cd server
npm run dev
# http://localhost:5000

# Или используйте одновременно в разных терминалах
npm run dev          # Frontend
npm run dev:server   # Backend
```

## 🏗️ Сборка

```bash
# Frontend
npm run build        # Создает dist/
npm run preview      # Предпросмотр сборки

# Backend (обычно не требуется)
cd server
npm start           # Production запуск
```

## 🔑 Администратор

```bash
# Создание администратора
cd server
npm run create-admin

# Следуйте инструкциям в консоли
# Введите username, email, password
```

## 🗄️ MongoDB

```bash
# Локальный MongoDB
# Windows: Запустите MongoDB как сервис
# Linux:
sudo systemctl start mongod
sudo systemctl status mongod

# Подключение через CLI
mongosh
use accounting_ecosystem
show collections

# Просмотр пользователей
db.users.find().pretty()

# Очистка БД (осторожно!)
db.dropDatabase()
```

## 🔐 Генерация секретов

```bash
# Базовая генерация
node scripts/generate-secret.js

# Кастомная генерация
node scripts/generate-secret.js --hex 32
node scripts/generate-secret.js --password 20
node scripts/generate-secret.js --base64 16

# Или используйте Node.js напрямую
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Или через npm команду
npm run generate-secret
```

## 🧪 Тестирование

```bash
# Backend тесты
cd server

# Тест подключения к БД
npm run test:db

# Тест API
npm run test

# Тест Content API
npm run test:content

# Все тесты
npm run test:all
```

## 🔍 Проверка уязвимостей

```bash
# Frontend
npm audit
npm audit fix           # Автоматическое исправление
npm audit fix --force   # Принудительное исправление

# Backend
cd server
npm audit
npm audit fix

# Оба сразу (из корня)
npm run audit:fix
```

## 📦 Обновление зависимостей

```bash
# Проверка устаревших пакетов
npm outdated
cd server && npm outdated && cd ..

# Обновление
npm update
cd server && npm update && cd ..

# Или используйте команду
npm run update:deps

# Обновление конкретного пакета
npm install package-name@latest
cd server && npm install package-name@latest
```

## 🗂️ Git команды

```bash
# Базовый workflow
git status
git add .
git commit -m "feat: добавлена новая функция"
git push origin main

# Создание feature ветки
git checkout -b feature/my-feature
# ...работа...
git add .
git commit -m "feat(scope): описание"
git push origin feature/my-feature

# Обновление из upstream
git fetch upstream
git merge upstream/main
# или
git rebase upstream/main

# Отмена последнего коммита (сохраняя изменения)
git reset --soft HEAD~1

# Просмотр истории
git log --oneline --graph --all
```

## 📤 Деплой

### Netlify (Frontend)

```bash
# CLI деплой
npm install -g netlify-cli
netlify login
netlify deploy --prod

# Или через Git
# 1. Подключите репозиторий в Netlify Dashboard
# 2. Push в main ветку автоматически задеплоит
```

### VPS (Backend)

```bash
# SSH подключение
ssh user@your-server-ip

# Обновление кода
cd /var/www/anko/server
git pull origin main
npm install --production

# Перезапуск с PM2
pm2 reload anko-backend
pm2 logs anko-backend

# Или перезапуск сервиса
sudo systemctl restart anko-backend
```

## 🐛 Отладка

```bash
# Проверка логов Backend
cd server

# Development
npm run dev  # Автоматически выводит логи

# Production (PM2)
pm2 logs anko-backend
pm2 logs anko-backend --lines 100

# MongoDB логи
# Linux:
sudo tail -f /var/log/mongodb/mongod.log

# Windows: Просмотрите в MongoDB Compass
```

## 🔧 Утилиты

```bash
# Генерация хеша пароля
cd server
node generate-hash.js

# Seeding данных
cd server
node seed.js

# Тестирование API endpoints
cd server
node test-api.js
```

## 📊 Мониторинг (Production)

```bash
# PM2 мониторинг
pm2 monit                    # Интерактивный монитор
pm2 status                   # Статус процессов
pm2 show anko-backend       # Детали процесса

# Системные ресурсы
htop                        # CPU/RAM
df -h                       # Дисковое пространство
free -h                     # Использование памяти

# MongoDB статус
mongosh --eval "db.serverStatus()"
mongosh --eval "db.stats()"
```

## 💾 Backup & Restore

```bash
# Backup MongoDB
mongodump --db accounting_ecosystem --out ./backup/

# С сжатием
mongodump --db accounting_ecosystem --gzip --archive=backup.gz

# Restore
mongorestore --db accounting_ecosystem ./backup/accounting_ecosystem/

# Из архива
mongorestore --gzip --archive=backup.gz
```

## 🔄 PM2 команды

```bash
# Запуск
pm2 start server.js --name anko-backend

# Управление
pm2 stop anko-backend
pm2 restart anko-backend
pm2 reload anko-backend      # Zero-downtime restart
pm2 delete anko-backend

# Логи
pm2 logs
pm2 logs anko-backend
pm2 logs --lines 200
pm2 flush                    # Очистить логи

# Автозапуск
pm2 startup                  # Создать startup script
pm2 save                     # Сохранить конфигурацию

# Мониторинг
pm2 monit
pm2 status
pm2 show anko-backend
```

## 🌐 Nginx команды

```bash
# Тестирование конфигурации
sudo nginx -t

# Перезагрузка
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo systemctl status nginx

# Логи
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Редактирование конфига
sudo nano /etc/nginx/sites-available/default
```

## 🔒 SSL/TLS (Let's Encrypt)

```bash
# Получение сертификата
sudo certbot --nginx -d your-domain.com

# Обновление сертификата
sudo certbot renew
sudo certbot renew --dry-run  # Тест

# Список сертификатов
sudo certbot certificates

# Отзыв сертификата
sudo certbot revoke --cert-path /path/to/cert.pem
```

## 📱 Полезные alias'ы

Добавьте в `~/.bashrc` или `~/.zshrc`:

```bash
# Проект
alias anko='cd ~/path/to/anko'
alias anko-dev='cd ~/path/to/anko && npm run dev'
alias anko-server='cd ~/path/to/anko/server && npm run dev'

# Git
alias gs='git status'
alias ga='git add'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline --graph --all'

# Docker (если используется)
alias dc='docker-compose'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
```

## 🔧 Troubleshooting

```bash
# Порт занят
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# Очистка node_modules
rm -rf node_modules package-lock.json
npm install

# Очистка build кэша
rm -rf dist
npm run build

# Очистка MongoDB Collections
mongosh
use accounting_ecosystem
db.users.deleteMany({})
db.services.deleteMany({})
```

## 📚 Дополнительные ресурсы

- [README.md](../README.md) - Основная документация
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Деплой
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Контрибуция
- [SECURITY.md](../SECURITY.md) - Безопасность
- [server/MIGRATION.md](../server/MIGRATION.md) - Миграция

---

**Совет**: Добавьте эту страницу в закладки для быстрого доступа к командам!
