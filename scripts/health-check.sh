#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "  Проверка здоровья приложения"
echo "========================================="
echo ""

# Проверка Node.js
echo -n "Проверка Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} установлен ($NODE_VERSION)"
else
    echo -e "${RED}✗${NC} не установлен"
    exit 1
fi

# Проверка npm
echo -n "Проверка npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} установлен ($NPM_VERSION)"
else
    echo -e "${RED}✗${NC} не установлен"
    exit 1
fi

# Проверка MongoDB (если запущен)
echo -n "Проверка MongoDB... "
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓${NC} запущен"
    else
        echo -e "${YELLOW}⚠${NC} установлен, но не запущен"
    fi
else
    echo -e "${YELLOW}⚠${NC} не установлен (опционально для локальной разработки)"
fi

echo ""
echo "========================================="
echo "  Проверка Frontend"
echo "========================================="
echo ""

# Проверка зависимостей frontend
echo -n "Проверка зависимостей frontend... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} установлены"
else
    echo -e "${RED}✗${NC} не установлены"
    echo "Запустите: npm install"
fi

# Проверка .env файла frontend
echo -n "Проверка .env файла frontend... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} существует"
    
    # Проверка VITE_API_URL
    if grep -q "VITE_API_URL" .env; then
        API_URL=$(grep "VITE_API_URL" .env | cut -d '=' -f2)
        echo "  API URL: $API_URL"
    else
        echo -e "  ${RED}✗${NC} VITE_API_URL не настроен"
    fi
else
    echo -e "${YELLOW}⚠${NC} не существует"
    echo "Создайте .env файл на основе .env.example"
fi

# Проверка сборки
echo -n "Проверка возможности сборки... "
if npm run build &> /dev/null; then
    echo -e "${GREEN}✓${NC} успешно"
else
    echo -e "${RED}✗${NC} ошибка при сборке"
fi

echo ""
echo "========================================="
echo "  Проверка Backend"
echo "========================================="
echo ""

cd server 2>/dev/null

if [ $? -eq 0 ]; then
    # Проверка зависимостей backend
    echo -n "Проверка зависимостей backend... "
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} установлены"
    else
        echo -e "${RED}✗${NC} не установлены"
        echo "Запустите: cd server && npm install"
    fi

    # Проверка .env файла backend
    echo -n "Проверка .env файла backend... "
    if [ -f ".env" ]; then
        echo -e "${GREEN}✓${NC} существует"
        
        # Проверка обязательных переменных
        echo "Проверка обязательных переменных:"
        
        if grep -q "PORT" .env; then
            PORT=$(grep "PORT" .env | cut -d '=' -f2)
            echo -e "  PORT: ${GREEN}✓${NC} ($PORT)"
        else
            echo -e "  PORT: ${RED}✗${NC}"
        fi
        
        if grep -q "MONGODB_URI" .env; then
            echo -e "  MONGODB_URI: ${GREEN}✓${NC}"
        else
            echo -e "  MONGODB_URI: ${RED}✗${NC}"
        fi
        
        if grep -q "JWT_SECRET" .env; then
            JWT_SECRET=$(grep "JWT_SECRET" .env | cut -d '=' -f2)
            if [ ${#JWT_SECRET} -lt 32 ]; then
                echo -e "  JWT_SECRET: ${YELLOW}⚠${NC} слишком короткий (рекомендуется 32+ символов)"
            else
                echo -e "  JWT_SECRET: ${GREEN}✓${NC}"
            fi
        else
            echo -e "  JWT_SECRET: ${RED}✗${NC}"
        fi
        
        if grep -q "CORS_ORIGIN" .env; then
            CORS_ORIGIN=$(grep "CORS_ORIGIN" .env | cut -d '=' -f2)
            echo -e "  CORS_ORIGIN: ${GREEN}✓${NC} ($CORS_ORIGIN)"
        else
            echo -e "  CORS_ORIGIN: ${YELLOW}⚠${NC} не настроен"
        fi
    else
        echo -e "${YELLOW}⚠${NC} не существует"
        echo "Создайте .env файл на основе .env.example"
    fi

    # Проверка структуры файлов
    echo ""
    echo "Проверка структуры файлов backend:"
    
    FILES=("server.js" "models/User.js" "middleware/auth.js" "routes/auth.js")
    for file in "${FILES[@]}"; do
        if [ -f "$file" ]; then
            echo -e "  $file: ${GREEN}✓${NC}"
        else
            echo -e "  $file: ${RED}✗${NC}"
        fi
    done

    cd ..
else
    echo -e "${RED}✗${NC} Папка server не найдена"
fi

echo ""
echo "========================================="
echo "  Проверка уязвимостей"
echo "========================================="
echo ""

# Проверка уязвимостей в frontend
echo "Frontend зависимости:"
npm audit --audit-level=moderate 2>&1 | head -n 10

echo ""
echo "Backend зависимости:"
cd server 2>/dev/null && npm audit --audit-level=moderate 2>&1 | head -n 10
cd ..

echo ""
echo "========================================="
echo "  Результат проверки"
echo "========================================="
echo ""
echo -e "${GREEN}Проверка завершена!${NC}"
echo ""
echo "Для запуска приложения:"
echo "  Frontend: npm run dev"
echo "  Backend: cd server && npm run dev"
echo ""
