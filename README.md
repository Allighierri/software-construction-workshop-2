# Практична робота №2

Навчальна TypeScript-бібліотека: npm, SemVer, типи, інтерфейси, generics,
класи, змінні оточення та автоматичні перевірки.

## Запуск

Потрібні Node.js 20+ та npm. Після клонування:

```sh
npm i
npm run typecheck
npm run lint
npm run format:check
npm run demo
npm run build
```

`dotenv`, `zod` — робочі залежності. Компілятор, збирач, ESLint, Prettier,
Husky, Commitlint, `tsx` та декларації Node.js — залежності розробки.

## Крок 1 — каркас (0.0.0)

Створено приватний репозиторій на GitHub і виконано його клонування.
`npm init` виконано інтерактивно, без `-y`: версія 0.0.0, автор Allighierri,
ліцензія UNLICENSED. Налаштовано TypeScript, ESLint 9, Prettier та Husky.
`pre-commit` запускає lint, format:check і typecheck; `commit-msg` перевіряє
Conventional Commits. `.npmrc` задає повідомлення релізу `chore: release v%s`.

TypeScript використовує ESNext/Bundler, оскільки бібліотеку збирає tsup.
Конфігурація tsup явно задає розширення `.cjs` і `.mjs`, щоб вони збігалися
з майбутніми полями exports. Згенерований dist виключено з ESLint і Prettier.
Для TypeScript застосовано правило невикористаних змінних із TS-плагіна,
щоб базове JS-правило не дублювало діагностику.

Результати команд зберігаються в `docs/verification/`; навмисно помилкові
приклади — у `docs/examples/` як текстові знімки. Перед кожним релізом
`src/demo.ts` виправляється, і повторні перевірки мають завершитися успішно.

## 0.1.0

Додано add і capitalize з any. Typecheck пропускає довільні типи; ESLint знаходить unused, Prettier — подвійні лапки. Після виправлення перевірки проходять; попередження про any на цьому етапі очікувані. MINOR: перша функціональність.

## 0.2.0

Замінено any на number/string. Компілятор відхиляє рядок у add і число у capitalize. Виклики виправлено. За сценарієм роботи використано MINOR у версії 0.x; звуження раніше довільних аргументів може порушувати сумісність для споживачів any.

## 0.3.0

Додано NumberFormatOptions та formatNumber з опційною precision. Рядок замість числа спричиняє помилку типу; правильний результат — 123.46. MINOR: нова функція без зміни попередніх сигнатур. Поле locale зарезервоване методичкою; поточний форматер використовує toFixed і не локалізує результат.

## 0.4.0

Додано User і groupBy<T> з keyof T. Ключ age відхиляється, name приймається. MINOR: нова можливість. Акумулятор без прототипу коректно обробляє значення **proto** і constructor. Prettier також виправив форматування reduce.

## 0.5.0

Додано Logger, LogLevel, config і zod-валідацію .env. verbose не входить у літеральний тип; config.LOG_LEVEL сумісний без приведення типу. Збережено User і groupBy попереднього релізу. MINOR: новий клас і конфігурація; formatNumber бере точність із APP_PRECISION.

## 1.0.0

Стабілізовано єдину точку входу src/index.ts, зокрема config і Config; any заборонено. Додано main/module/types/exports. Збірка створює CJS, ESM та декларації. MAJOR: перший стабільний контракт. Самоімпорти з ./index із методички не потрібні: оголошення вже експортовані.

## 2.0.0

Breaking change: add(a, b) замінено на add(values: number[]). Старий виклик дає TS2554, новий add([2, 3, 4]) повертає 9; порожній масив дає 0. MAJOR: порушено сумісність сигнатури.

## Приклади API 2.0.0

```ts
import {
  add,
  capitalize,
  formatNumber,
  groupBy,
  Logger,
  config,
  type User,
} from 'software-construction-workshop-2';

add([2, 3, 4]); // 9; до 2.0.0: add(2, 3)
capitalize('hello'); // 'Hello'
formatNumber(123.456, { precision: 2 }); // '123.46'
const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Alice' },
];
groupBy(users, 'name'); // { Alice: [обидва користувачі] }
const logger = new Logger(config.LOG_LEVEL);
logger.info('Application started');
logger.debug('Extra debug info');
```

Публічні функції, класи, конфігурація й типи доступні лише через кореневий
експорт пакета. `src/demo.ts` також використовує цю точку входу.

## Змінні оточення

```sh
cp .env.example .env
npm run demo
```

| Ключ          | Дозволені значення  | За замовчуванням | У локальному .env |
| ------------- | ------------------- | ---------------- | ----------------- |
| APP_PRECISION | ціле число 0–10     | 2                | 3                 |
| LOG_LEVEL     | silent, info, debug | info             | debug             |

`zod` перевіряє конфігурацію під час завантаження модуля. Некоректні значення
зупиняють програму з помилкою валідації. За відсутності .env діють стандартні
значення. Уже задані змінні процесу мають пріоритет над .env.
`silent` вимикає Logger, `info` друкує лише info, `debug` — обидва рівні.
Точність у параметрі `formatNumber` має пріоритет над APP_PRECISION;
вона підпорядковується обмеженням `Number.toFixed` (ціле число 0–100).
`.env` виключено з Git; `.env.example` містить лише навчальні значення.

## Релізи та докази виконання

- [v0.1.0](https://github.com/Allighierri/software-construction-workshop-2/tree/v0.1.0)
- [v0.2.0](https://github.com/Allighierri/software-construction-workshop-2/tree/v0.2.0)
- [v0.3.0](https://github.com/Allighierri/software-construction-workshop-2/tree/v0.3.0)
- [v0.4.0](https://github.com/Allighierri/software-construction-workshop-2/tree/v0.4.0)
- [v0.5.0](https://github.com/Allighierri/software-construction-workshop-2/tree/v0.5.0)
- [v1.0.0](https://github.com/Allighierri/software-construction-workshop-2/tree/v1.0.0)
- [v2.0.0](https://github.com/Allighierri/software-construction-workshop-2/tree/v2.0.0)

Релізи створено послідовними `npm version minor` / `npm version major`,
із push `--follow-tags`. Кожний тег є анотованим Git-тегом.
Додаткове створення GitHub Releases для цієї роботи не потрібне.

- `docs/examples/*-before.ts.txt` — точний знімок неправильного demo перед виправленням.
- `docs/verification/*-before.log` — реальна діагностика typecheck/lint/format.
- `docs/verification/*-after.log` — успішні повторні перевірки та demo.
- `docs/verification/00-scaffolding-commit.log` — робота Husky на першому коміті.
- `docs/verification/*-commit.log` — перевірки під час наступних комітів.
- `docs/verification/final.log` — фінальна збірка, перевірки, тестування API та .env.

Навмисні помилки виникали саме в `src/demo.ts`. Знімки збережені як `.txt`,
щоб фінальний проєкт компілювався. У логах 0.1.0 також зафіксовано обмеження
середовища запуску (`EPERM` для IPC tsx) і наступний успішний запуск.

## Відтворення перевірок

```sh
npm ci
npm run typecheck
npm run lint
npm run format:check
npm run demo
npm test
git log --oneline --decorate
git tag --list
git check-ignore .env
```

`npm test` спочатку збирає пакет, потім перевіряє реальні CJS/ESM exports,
поведінку функцій і Logger, валідну та невалідну конфігурацію в окремих процесах.
Команди не потребують глобальних TypeScript, ESLint або tsx.
