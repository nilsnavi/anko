#!/usr/bin/env node

/**
 * Утилита для генерации безопасных секретов
 * Используется для создания JWT_SECRET и других криптографических ключей
 */

const crypto = require('crypto');

console.log('='.repeat(50));
console.log('  Генератор безопасных секретов');
console.log('='.repeat(50));
console.log();

// Генерация разных типов ключей
const secrets = {
  'JWT_SECRET (32 байта)': crypto.randomBytes(32).toString('hex'),
  'JWT_SECRET (64 байта)': crypto.randomBytes(64).toString('hex'),
  'SESSION_SECRET (32 байта)': crypto.randomBytes(32).toString('hex'),
  'ENCRYPTION_KEY (32 байта)': crypto.randomBytes(32).toString('hex'),
  'API_KEY (16 байт, Base64)': crypto.randomBytes(16).toString('base64'),
  'RANDOM_PASSWORD (16 символов)': generatePassword(16)
};

console.log('Сгенерированные секреты:\n');

Object.entries(secrets).forEach(([name, value]) => {
  console.log(`${name}:`);
  console.log(value);
  console.log();
});

console.log('='.repeat(50));
console.log('Рекомендации:');
console.log('  1. Используйте минимум 32 байта для JWT_SECRET');
console.log('  2. Никогда не коммитьте секреты в Git');
console.log('  3. Используйте разные секреты для разных окружений');
console.log('  4. Регулярно меняйте секреты в production');
console.log('='.repeat(50));
console.log();

// Создание примера .env файла
console.log('Пример для .env файла:');
console.log('-'.repeat(50));
console.log(`# Backend Environment Variables
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/accounting_ecosystem

# JWT Configuration
JWT_SECRET=${secrets['JWT_SECRET (64 байта)']}
JWT_ACCESS_TOKEN_EXPIRY=24h
JWT_REFRESH_TOKEN_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15`);
console.log('-'.repeat(50));
console.log();

/**
 * Генерация безопасного пароля
 * @param {number} length - Длина пароля
 * @returns {string} - Сгенерированный пароль
 */
function generatePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  
  return password;
}

// Дополнительные опции из аргументов командной строки
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Использование: node generate-secret.js [опции]\n');
  console.log('Опции:');
  console.log('  --hex <length>     Генерировать hex строку (длина в байтах)');
  console.log('  --base64 <length>  Генерировать base64 строку (длина в байтах)');
  console.log('  --password <length> Генерировать пароль (длина в символах)');
  console.log('  --help, -h         Показать эту справку');
  console.log();
  console.log('Примеры:');
  console.log('  node generate-secret.js --hex 32');
  console.log('  node generate-secret.js --password 20');
  process.exit(0);
}

if (args[0] === '--hex' && args[1]) {
  const length = parseInt(args[1]);
  console.log('\nДополнительный hex ключ:');
  console.log(crypto.randomBytes(length).toString('hex'));
}

if (args[0] === '--base64' && args[1]) {
  const length = parseInt(args[1]);
  console.log('\nДополнительный base64 ключ:');
  console.log(crypto.randomBytes(length).toString('base64'));
}

if (args[0] === '--password' && args[1]) {
  const length = parseInt(args[1]);
  console.log('\nДополнительный пароль:');
  console.log(generatePassword(length));
}
