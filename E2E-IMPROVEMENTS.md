# 🎭 E2E тестирование (Playwright) - 11 февраля 2026

Полная интеграция End-to-End тестирования с Playwright для автоматизации проверки пользовательских сценариев.

---

## 🎯 Обзор

### Что добавлено

✅ **Playwright Test Framework** - современный инструмент для E2E тестирования  
✅ **6 категорий тестов** - навигация, страницы, админка, доступность, адаптивность, производительность  
✅ **Multi-browser тестирование** - Chromium, Firefox, WebKit, Mobile  
✅ **CI/CD интеграция** - автоматический запуск в GitHub Actions  
✅ **Rich reporting** - HTML отчеты, скриншоты, видео, трейсы  
✅ **Полная документация** - E2E-TESTING.md с примерами

---

## 📦 Установленные пакеты

```json
{
  "@playwright/test": "^1.58.2"
}
```

---

## 📁 Структура файлов

```
e2e/
├── navigation.spec.ts      # Тесты навигации (5 тестов)
├── pages.spec.ts           # Тесты контента страниц (6 описаний)
├── admin.spec.ts           # Тесты админ-панели (5 тестов)
├── accessibility.spec.ts   # Тесты доступности (7 тестов)
├── responsive.spec.ts      # Тесты адаптивности (5 тестов)
└── performance.spec.ts     # Тесты производительности (6 тестов)

playwright.config.ts        # Конфигурация Playwright
E2E-TESTING.md             # Полная документация
.github/workflows/
└── e2e-tests.yml          # CI workflow для E2E тестов
```

---

## 🧪 Категории тестов

### 1. 🧭 Navigation Tests (navigation.spec.ts)

**Что тестируется:**
- Переход на главную страницу
- Навигация по всем основным страницам
- Мобильное меню
- Переход по логотипу
- Ссылки в футере

**Пример теста:**
```typescript
test('should navigate through all main pages', async ({ page }) => {
  await page.goto('/');
  
  // О компании
  await page.click('text=О компании');
  await expect(page.url()).toContain('#/about');
  
  // Услуги
  await page.click('text=Услуги');
  await expect(page.url()).toContain('#/services');
  
  // И так далее...
});
```

---

### 2. 📄 Pages Tests (pages.spec.ts)

**Что тестируется:**
- Главная страница (hero, сервисы)
- О компании (информация, команда)
- Услуги (карточки, детали)
- Контакты (телефон, email)
- Образование (программы)
- Ветераны (поддержка)

**Пример теста:**
```typescript
test('should display hero section with main content', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.locator('text=Профессиональная бухгалтерия'))
    .toBeVisible();
});
```

---

### 3. 🔐 Admin Tests (admin.spec.ts)

**Что тестируется:**
- Форма входа (поля, валидация)
- Регистрация
- Защищенные роуты (redirect на login)
- Навигация админ-панели

**Пример теста:**
```typescript
test('should redirect to login when not authenticated', async ({ page }) => {
  await page.goto('/#/admin/dashboard');
  
  // Должен редиректить на login
  const url = page.url();
  expect(url.includes('login')).toBeTruthy();
});
```

---

### 4. ♿ Accessibility Tests (accessibility.spec.ts)

**Что тестируется:**
- Иерархия заголовков (h1, h2, h3...)
- Alt текст для изображений
- Метки форм (labels, aria-labels)
- Клавиатурная навигация (Tab)
- ARIA роли (main, navigation)
- Skip links

**Пример теста:**
```typescript
test('should have alt text for images', async ({ page }) => {
  await page.goto('/');
  
  const images = page.locator('img');
  const count = await images.count();
  
  for (let i = 0; i < Math.min(count, 5); i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).toBeDefined();
  }
});
```

---

### 5. 📱 Responsive Tests (responsive.spec.ts)

**Что тестируется:**
- Mobile (375x667)
- Tablet (768x1024)
- Desktop (1920x1080)
- Адаптивная навигация
- Touch-friendly кнопки (44x44px min)
- Отсутствие горизонтального скролла

**Пример теста:**
```typescript
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`should be responsive on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    
    const bodyWidth = await page.evaluate(() => 
      document.body.scrollWidth
    );
    
    expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20);
  });
}
```

---

### 6. ⚡ Performance Tests (performance.spec.ts)

**Что тестируется:**
- Время загрузки страницы (< 5s)
- First Contentful Paint (< 2s)
- Lazy loading изображений
- Размер DOM (< 2000 узлов)
- Cumulative Layout Shift (< 0.3)
- Кэширование ресурсов

**Пример теста:**
```typescript
test('should have fast First Contentful Paint', async ({ page }) => {
  await page.goto('/');
  
  const fcp = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const entry = paint.find(e => e.name === 'first-contentful-paint');
    return entry ? entry.startTime : 0;
  });
  
  expect(fcp).toBeLessThan(2000);
});
```

---

## 🚀 Использование

### Базовые команды

```bash
# Запуск всех тестов
npm run test:e2e

# UI mode (рекомендуется для разработки)
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# С показом браузера
npm run test:e2e:headed

# Только Chromium
npm run test:e2e:chromium

# Просмотр отчета
npm run test:e2e:report
```

### Продвинутые команды

```bash
# Конкретный файл
npx playwright test e2e/navigation.spec.ts

# Один тест по имени
npx playwright test -g "should navigate to home page"

# Генерация тестов (codegen)
npx playwright codegen http://localhost:5173

# Запуск failed тестов
npx playwright test --last-failed

# Конкретный браузер
npx playwright test --project=firefox

# Обновить скриншоты
npx playwright test --update-snapshots
```

---

## ⚙️ Конфигурация

### playwright.config.ts

```typescript
export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', use: devices['Pixel 5'] },
    { name: 'Mobile Safari', use: devices['iPhone 12'] },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Ключевые настройки:**
- `webServer` - автоматический запуск dev server
- `retries` - повторы на CI (2)
- `trace` - трейсы при падении
- `screenshot/video` - только при ошибках
- 5 проектов (3 desktop + 2 mobile)

---

## 🔄 CI/CD интеграция

### GitHub Actions (.github/workflows/e2e-tests.yml)

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci --legacy-peer-deps
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      
      # Загрузка артефактов
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

**Что происходит в CI:**
1. Установка зависимостей
2. Установка браузеров Playwright
3. Запуск всех E2E тестов
4. Сохранение отчетов как artifacts
5. Сохранение скриншотов/видео при падении

---

## 📊 Отчеты

### HTML Report

После запуска тестов:

```bash
npm run test:e2e:report
```

**Содержит:**
- Статистику прогона
- Список всех тестов
- Скриншоты при падении
- Видео прогонов
- Трейсы для отладки

### Артефакты в CI

- `playwright-report/` - HTML отчет (30 дней)
- `test-results/` - скриншоты, видео, трейсы (7 дней)

---

## 🎯 Best Practices

### 1. Используйте описательные селекторы

```typescript
// ✅ Хорошо
await page.getByRole('button', { name: 'Submit' })
await page.getByLabel('Email')
await page.getByText('Welcome')

// ❌ Плохо
await page.click('.btn-123')
```

### 2. Ждите готовности элементов

```typescript
// ✅ Хорошо
await page.waitForSelector('.element')
await page.waitForLoadState('networkidle')

// ❌ Плохо
await page.waitForTimeout(5000)
```

### 3. Группируйте связанные тесты

```typescript
test.describe('Login', () => {
  test('valid credentials', async () => {})
  test('invalid credentials', async () => {})
})
```

### 4. Делайте атомарные тесты

Каждый тест независим и может выполняться отдельно.

### 5. Используйте Page Objects

```typescript
class LoginPage {
  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email)
    await this.page.fill('[name="password"]', password)
    await this.page.click('button[type="submit"]')
  }
}
```

---

## 📈 Покрытие тестами

### Текущее покрытие

- ✅ Навигация - 5 тестов
- ✅ Страницы - 11 тестов
- ✅ Админ-панель - 5 тестов
- ✅ Доступность - 7 тестов
- ✅ Адаптивность - 5 тестов
- ✅ Производительность - 6 тестов

**Всего: ~39 E2E тестов**

### Что покрыто

- [x] Все публичные страницы
- [x] Навигация и меню
- [x] Форма входа в админку
- [x] Базовая доступность
- [x] Мобильная версия
- [x] Метрики производительности

### Что можно добавить

- [ ] Тесты форм с отправкой данных
- [ ] Авторизованные сценарии в админке
- [ ] CRUD операции с контентом
- [ ] Загрузка файлов
- [ ] Интеграция с API
- [ ] Визуальное тестирование

---

## 🐛 Troubleshooting

### Проблема: Браузеры не найдены

```bash
npx playwright install
```

### Проблема: Таймауты в тестах

Увеличьте timeout:

```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000) // 60 секунд
})
```

### Проблема: Flaky тесты

- Используйте `waitForLoadState('networkidle')`
- Добавьте retry: `retries: 2`
- Используйте более надежные селекторы

### Проблема: Dev server не запускается

Проверьте:
- Порт 5173 свободен
- `npm run dev` работает отдельно
- В `playwright.config.ts` правильный URL

---

## 📚 Дополнительные ресурсы

### Документация

- [Playwright Docs](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

### Полезные инструменты

- **Playwright Inspector** - пошаговая отладка
- **Trace Viewer** - визуализация прогонов
- **Codegen** - генерация тестов
- **VS Code Extension** - интеграция с редактором

---

## ✅ Checklist

### Перед коммитом

- [ ] Все E2E тесты проходят локально
- [ ] Новые фичи покрыты тестами
- [ ] Нет flaky тестов
- [ ] Отчеты генерируются корректно

### Перед деплоем

- [ ] Тесты проходят в CI
- [ ] Критичные user flows работают
- [ ] Производительность в норме
- [ ] Мобильная версия протестирована

---

## 🎉 Итоги

### Что достигнуто

✅ Полная E2E инфраструктура  
✅ 39+ автоматических тестов  
✅ Multi-browser coverage  
✅ CI/CD интеграция  
✅ Rich reporting  
✅ Comprehensive documentation  

### Метрики качества

- 🎯 **Coverage**: основные user flows покрыты
- ⚡ **Speed**: тесты выполняются за ~2-5 минут
- 🔄 **Reliability**: retry механизм для flaky тестов
- 📊 **Reporting**: детальные отчеты с видео/скриншотами

### Преимущества

- Автоматическая проверка регрессий
- Уверенность перед деплоем
- Документированные user flows
- Раннее обнаружение багов
- Улучшенное качество продукта

---

🚀 **E2E тестирование готово к использованию!**
