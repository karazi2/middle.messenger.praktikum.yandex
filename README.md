# Messenger UI – Sprint 2

Учебный проект-мессенджер (2 спринт Яндекс.Практикума).

Во втором спринте проект переведён на TypeScript, добавлен компонентный подход на базе собственного класса `Block` и `EventBus`, реализована страница со списком чатов и лентой переписки, общая валидация форм, класс для HTTP-запросов и линтеры (ESLint, Stylelint, TypeScript type-check).

## Сделана страница чатов - есть страница со списком чатов и переход на конкретный чат по клику по элементу списка

## Деплой

Проект развёрнут на Netlify и доступен по адресу:

**https://astonishing-alfajores-0e4aef.netlify.app**

Автодеплой настроен из ветки `deploy` репозитория GitHub  
`https://github.com/karazi2/middle.messenger.praktikum.yandex`.

---

## Реализовано в рамках 2 спринта

### TypeScript

- Вся клиентская логика переписана на **TypeScript**.

# Запуск dev-сервера на http://localhost:3000

npm run start

# или

npm run dev

# Сборка проекта (TypeScript + Vite)

npm run build

# Предпросмотр собранной версии

npm run preview

# Линтинг TypeScript-кода

npm run lint:ts

# Линтинг стилей

npm run lint:styles

# Проверка типов TypeScript

npm run type-check

# Запуск тестов

npm test

# Полная проверка: ESLint + Stylelint + TS + тесты

npm run lint
npm run validate
