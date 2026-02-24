# 🎭 E2E тестирование с Playwright

Полное руководство по End-to-End тестированию проекта с использованием Playwright.

## 📋 Содержание

- [Установка](#-установка)
- [Запуск тестов](#запуск-тестов)
- [Структура тестов](#-структура-тестов)
- [Написание тестов](#написание-тестов)
- [Отладка](#-отладка)
- [CI/CD интеграция](#-cicd-интеграция)
- [Best Practices](#-best-practices)

---

## 🚀 Установка

Playwright уже установлен в проекте. Для установки браузеров выполните:

```bash
npx playwright install
```

Для системных зависимостей (Linux):

```bash
npx playwright install-deps
```

---

## Запуск тестов

### Все тесты

```bash
npm run test:e2e
```

### С UI интерфейсом

```bash
npm run test:e2e:ui
```

### Режим отладки

```bash
npm run test:e2e:debug
```

### Только Chromium

```bash
npm run test:e2e:chromium
```

### С показом браузера

```bash
npm run test:e2e:headed
```

### Просмотр отчета

```bash
npm run test:e2e:report
```

### Отдельный файл

```bash
npx playwright test e2e/navigation.spec.ts
```

### Один тест

```bash
npx playwright test -g "should navigate to home page"
```

---

## 📁 Структура тестов

```text
e2e/
├── navigation.spec.ts      # Тесты навигации
├── pages.spec.ts           # Тесты содержимого страниц
├── admin.spec.ts           # Тесты админ-панели
├── accessibility.spec.ts   # Тесты доступности
├── responsive.spec.ts      # Тесты адаптивности
└── performance.spec.ts     # Тесты производительности
```

### Что тестируется

#### 🧭 Navigation (navigation.spec.ts)

- ✅ Переходы между страницами
- ✅ Мобильное меню
- ✅ Логотип и навигация
- ✅ Футер и ссылки

#### 📄 Pages (pages.spec.ts)

- ✅ Домашняя страница
- ✅ О компании
- ✅ Услуги
- ✅ Контакты
- ✅ Образование
- ✅ Поддержка ветеранов

#### 🔐 Admin (admin.spec.ts)

- ✅ Форма входа
- ✅ Регистрация
- ✅ Защищенные маршруты
- ✅ Навигация админки

#### ♿ Accessibility (accessibility.spec.ts)

- ✅ Иерархия заголовков
- ✅ Alt текст для изображений
- ✅ Метки форм
- ✅ Клавиатурная навигация
- ✅ ARIA роли

#### 📱 Responsive (responsive.spec.ts)

- ✅ Мобильная версия (375px)
- ✅ Планшет (768px)
- ✅ Десктоп (1920px)
- ✅ Адаптивная навигация
- ✅ Touch-friendly элементы

#### ⚡ Performance (performance.spec.ts)

- ✅ Время загрузки
- ✅ First Contentful Paint
- ✅ Lazy loading
- ✅ Размер DOM
- ✅ Cumulative Layout Shift

---

## Написание тестов

### Базовая структура

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Открыть страницу
    await page.goto('/');

    // Взаимодействие
    await page.click('button');

    // Проверка
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Селекторы

```typescript
// Текст
page.locator('text=Hello')

// CSS селектор
page.locator('.button')

// По роли
page.getByRole('button', { name: 'Submit' })

// По тексту
page.getByText('Hello World')

// По метке
page.getByLabel('Email')

// По placeholder
page.getByPlaceholder('Enter email')
```

### Проверки (Assertions)

```typescript
// Видимость
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Содержимое
await expect(element).toHaveText('Hello')
await expect(element).toContainText('Hello')

// Атрибуты
await expect(element).toHaveAttribute('href', '/about')
await expect(element).toHaveClass('active')

// Количество
await expect(elements).toHaveCount(5)

// URL
await expect(page).toHaveURL(/about/)
await expect(page).toHaveTitle(/Home/)
```

### Навигация

```typescript
// Переход
await page.goto('/')
await page.goto('/#/about')

// Клик по ссылке
await page.click('a[href="/about"]')

// Назад/вперед
await page.goBack()
await page.goForward()

// Ожидание навигации
await page.waitForURL('**/about')
```

### Формы

```typescript
// Ввод текста
await page.fill('input[name="email"]', 'test@example.com')
await page.type('input', 'text', { delay: 100 })

// Клик
await page.click('button[type="submit"]')

// Выбор
await page.selectOption('select', 'value')

// Чекбокс
await page.check('input[type="checkbox"]')
await page.uncheck('input[type="checkbox"]')
```

### Ожидания

```typescript
// Элемент
await page.waitForSelector('.element')

// Загрузка сети
await page.waitForLoadState('networkidle')

// Timeout
await page.waitForTimeout(1000)

// Функция
await page.waitForFunction(() => window.ready === true)
```

---

## 🐛 Отладка

### UI Mode (рекомендуется)

```bash
npm run test:e2e:ui
```

Преимущества:

- 👀 Визуальный просмотр тестов
- ⏯️ Пошаговое выполнение
- 🔍 Инспектор элементов
- 📸 Скриншоты и видео

### Debug Mode

```bash
npm run test:e2e:debug
```

Откроет Playwright Inspector для пошаговой отладки.

### Headed Mode

```bash
npm run test:e2e:headed
```

Показывает браузер во время выполнения тестов.

### Скриншоты

```typescript
// В тесте
await page.screenshot({ path: 'screenshot.png' })

// Полная страница
await page.screenshot({ path: 'full.png', fullPage: true })
```

### Видео

Видео автоматически сохраняется при падении тестов (настройка в `playwright.config.ts`).

### Трейсы

```typescript
// Включить трейс
await page.context().tracing.start({ screenshots: true, snapshots: true })

// Остановить и сохранить
await page.context().tracing.stop({ path: 'trace.zip' })
```

Просмотр трейсов:

```bash
npx playwright show-trace trace.zip
```

---

## 🔄 CI/CD интеграция

### GitHub Actions

Workflow уже настроен в `.github/workflows/e2e-tests.yml`:

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
```

### Artifacts

После прогона тестов в CI доступны:

- 📊 HTML отчет (playwright-report/)
- 📸 Скриншоты и видео (test-results/)

---

## 🎯 Best Practices

### 1. Используйте data-testid

```typescript
// HTML
<button data-testid="submit-button">Submit</button>

// Тест
await page.click('[data-testid="submit-button"]')
```

### 2. Группируйте связанные тесты

```typescript
test.describe('Login Flow', () => {
  test('valid credentials', async ({ page }) => {})
  test('invalid credentials', async ({ page }) => {})
})
```

### 3. Используйте beforeEach для setup

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/login')
})
```

### 4. Создавайте Page Objects

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email)
    await this.page.fill('[name="password"]', password)
    await this.page.click('button[type="submit"]')
  }
}

// Использование
const loginPage = new LoginPage(page)
await loginPage.login('test@example.com', 'password')
```

### 5. Избегайте жестких задержек

```typescript
// ❌ Плохо
await page.waitForTimeout(5000)

// ✅ Хорошо
await page.waitForSelector('.element')
await page.waitForLoadState('networkidle')
```

### 6. Делайте атомарные тесты

Каждый тест должен быть независимым и не полагаться на другие тесты.

### 7. Используйте описательные имена

```typescript
// ✅ Хорошо
test('should display error message when email is invalid', async ({ page }) => {})

// ❌ Плохо
test('test1', async ({ page }) => {})
```

### 8. Проверяйте критичные user flows

Фокусируйтесь на тестировании основных пользовательских сценариев:

- Регистрация и вход
- Основные функции приложения
- Критичные бизнес-процессы

---

## 📊 Отчеты

### HTML отчет

```bash
npm run test:e2e:report
```

Откроет подробный HTML отчет с:

- Статистикой прогона
- Скриншотами
- Видео
- Трейсами

### CI Reports

В GitHub Actions отчеты загружаются как artifacts и доступны в разделе Actions.

---

## 🚨 Troubleshooting

### Браузеры не установлены

```bash
npx playwright install
```

### Тесты падают локально

1. Убедитесь, что dev server запущен: `npm run dev`
2. Проверьте, что порт 5173 свободен
3. Очистите кэш: `rm -rf playwright-report test-results`

### Таймауты в CI

Увеличьте timeout в `playwright.config.ts`:

```typescript
timeout: 60 * 1000, // 60 seconds
```

### Flaky тесты

Используйте:

- `page.waitForLoadState('networkidle')`
- Retry в конфигурации: `retries: 2`
- Более надежные селекторы

---

## 📚 Дополнительно

### Документация Playwright

- [Official Docs](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Полезные команды

```bash
# Генерация тестов
npx playwright codegen http://localhost:5173

# Запуск конкретного браузера
npx playwright test --project=chromium

# Только failed тесты
npx playwright test --last-failed

# С фильтром
npx playwright test --grep "should login"

# Обновить скриншоты
npx playwright test --update-snapshots
```

---

## ✅ Checklist перед деплоем

- [ ] Все E2E тесты проходят локально
- [ ] Тесты проходят в CI
- [ ] Критичные user flows покрыты
- [ ] Нет flaky тестов
- [ ] Отчеты доступны в CI
- [ ] Видео и скриншоты работают

---

🎉 **E2E тестирование настроено и готово к использованию!**
