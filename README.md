# Messenger UI – Sprint 2

Учебный проект-мессенджер (2 спринт Яндекс.Практикума).

Во втором спринте проект переведён на TypeScript, добавлен компонентный подход на базе собственного класса `Block` и `EventBus`, реализована страница со списком чатов и лентой переписки, общая валидация форм, класс для HTTP-запросов и линтеры (ESLint, Stylelint, TypeScript type-check).

---

## Деплой

Проект развёрнут на Netlify и доступен по адресу:

**https://astonishing-alfajores-0e4aef.netlify.app**

Автодеплой настроен из ветки `deploy` репозитория GitHub  
`https://github.com/karazi2/middle.messenger.praktikum.yandex`.

---

## Реализовано в рамках 2 спринта

### TypeScript

- Вся клиентская логика переписана на **TypeScript**.
- Включён строгий режим и обязательные настройки из чеклиста:
  - `noImplicitAny: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `sourceMap: true`
  - `strictNullChecks: true`
  - `strict: true`
- Проверка типов выполняется командой:

```bash
npm run type-check   # tsc --noEmit
```
