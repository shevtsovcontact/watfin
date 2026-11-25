# 💸 WATFIN

Личный трекер финансов для Android и iOS. Тёмная тема, золото, никаких лишних кнопок — только баланс, операции и доход/расход.

![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-202020?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

## Возможности

- 📊 **Баланс за месяц** — доходы, расходы и остаток на главном экране
- ➕ **Добавление операций** — сумма с мгновенной подсветкой типа: зелёный доход, красный расход
- 🕒 **История операций** — свежие записи прямо на главном экране
- 🌙 **Тёмная тема** — единая палитра с золотыми акцентами
- 💰 **Валюта** — белорусский рубль (Б)

## Стек

| Технология                 | Зачем                                    |
| -------------------------- | ---------------------------------------- |
| [Expo](https://expo.dev)   | Сборка и запуск без Xcode/Android Studio |
| React Native + expo-router | Интерфейс и навигация (tabs + stack)     |
| TypeScript                 | Типизация без сюрпризов                  |

## Запуск

git clone https://github.com/shevtsovcontact/watfin.git
cd watfin
npm install
npx expo start

Приложение откроется в **Expo Go** — отсканируй QR-код из терминала камерой телефона.

## Структура проекта

app/
\_layout.tsx # корневая навигация и общая тема хедеров
(tabs)/
\_layout.tsx # таб-навигатор
index.tsx # главный экран: баланс + история
add.tsx # добавление операции
settings.tsx # настройки
theme/
theme.ts # палитра, радиусы, валюта
fonts.ts # типографика (Unbounded)

## Roadmap

- [ ] Категории расходов: список, добавление своих
- [ ] Статистика по категориям за месяц
- [ ] Редактирование и удаление операций
- [ ] Локальное хранение истории
- [ ] Светлая тема

## Лицензия

MIT
