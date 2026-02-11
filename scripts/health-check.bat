@echo off
REM Скрипт проверки здоровья приложения для Windows

echo =========================================
echo   Проверка здоровья приложения
echo =========================================
echo.

REM Проверка Node.js
echo Проверка Node.js...
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    node -v
    echo [OK] Node.js установлен
) else (
    echo [ОШИБКА] Node.js не установлен
    exit /b 1
)
echo.

REM Проверка npm
echo Проверка npm...
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    npm -v
    echo [OK] npm установлен
) else (
    echo [ОШИБКА] npm не установлен
    exit /b 1
)
echo.

REM Проверка MongoDB (опционально)
echo Проверка MongoDB...
where mongod >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB установлен
) else (
    echo [ВНИМАНИЕ] MongoDB не установлен (опционально для локальной разработки)
)
echo.

echo =========================================
echo   Проверка Frontend
echo =========================================
echo.

REM Проверка зависимостей frontend
if exist "node_modules\" (
    echo [OK] Зависимости frontend установлены
) else (
    echo [ОШИБКА] Зависимости frontend не установлены
    echo Запустите: npm install
)

REM Проверка .env файла frontend
if exist ".env" (
    echo [OK] .env файл frontend существует
) else (
    echo [ВНИМАНИЕ] .env файл frontend не существует
    echo Создайте .env файл на основе .env.example
)
echo.

echo =========================================
echo   Проверка Backend
echo =========================================
echo.

cd server 2>nul
if %ERRORLEVEL% EQU 0 (
    REM Проверка зависимостей backend
    if exist "node_modules\" (
        echo [OK] Зависимости backend установлены
    ) else (
        echo [ОШИБКА] Зависимости backend не установлены
        echo Запустите: cd server ^&^& npm install
    )

    REM Проверка .env файла backend
    if exist ".env" (
        echo [OK] .env файл backend существует
    ) else (
        echo [ВНИМАНИЕ] .env файл backend не существует
        echo Создайте .env файл на основе .env.example
    )

    REM Проверка структуры файлов
    echo.
    echo Проверка структуры файлов backend:
    if exist "server.js" (echo   server.js: [OK]) else (echo   server.js: [ОШИБКА])
    if exist "models\User.js" (echo   models\User.js: [OK]) else (echo   models\User.js: [ОШИБКА])
    if exist "middleware\auth.js" (echo   middleware\auth.js: [OK]) else (echo   middleware\auth.js: [ОШИБКА])
    if exist "routes\auth.js" (echo   routes\auth.js: [OK]) else (echo   routes\auth.js: [ОШИБКА])

    cd ..
) else (
    echo [ОШИБКА] Папка server не найдена
)
echo.

echo =========================================
echo   Проверка уязвимостей
echo =========================================
echo.

echo Frontend зависимости:
call npm audit --audit-level=moderate 2>&1 | findstr /C:"vulnerabilities"
echo.

echo Backend зависимости:
cd server 2>nul && call npm audit --audit-level=moderate 2>&1 | findstr /C:"vulnerabilities"
cd ..
echo.

echo =========================================
echo   Результат проверки
echo =========================================
echo.
echo Проверка завершена!
echo.
echo Для запуска приложения:
echo   Frontend: npm run dev
echo   Backend: cd server ^&^& npm run dev
echo.

pause
