# 🍳 Recipe AI Hub

Веб-приложение, которое генерирует рецепты по ингредиентам или свободному описанию того, что есть под рукой — с помощью AI. Пет-проект с несколькими фичами для вау-эффекта.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3a0b142f-0ece-423c-8c88-dbbb9238bdd4" />


## ✨ Возможности

- 🌍 Три языка интерфейса и генерации: English, Русский, Português
- 🥘 Генерация рецепта по списку ингредиентов
- 🧊 Режим "Из остатков" — опиши свободным текстом, что есть в холодильнике
- 🌶️ Быстрые вариации рецепта: острее / проще / быстрее / полезнее
- ❤️ Избранное — сохранение и удаление рецептов
- 🔐 Вход через Google (NextAuth v5)

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/715ee471-94ae-40af-bb0a-77dc27281e78" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f045b623-2ba2-42d4-bf5f-d4e3a0839e71" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3a3003df-5405-404a-a093-5b2f84b97173" />
<img width="300" height="667" alt="image" src="https://github.com/user-attachments/assets/34328469-1272-4e18-b0b0-111242144fbd" />
<img width="300" height="667" alt="image" src="https://github.com/user-attachments/assets/b4753a36-5943-4635-819e-87ecc884538a" />





## 🛠️ Стек

| Категория | Технология |
|---|---|
| Фреймворк | [Next.js](https://nextjs.org) (App Router) |
| Стили | [Tailwind CSS](https://tailwindcss.com) |
| UI-компоненты | [Headless UI](https://headlessui.com) |
| Интернационализация | [next-intl](https://next-intl.dev) |
| База данных | [Supabase](https://supabase.com) (PostgreSQL) |
| Авторизация | [NextAuth v5](https://authjs.dev) (Google OAuth) |
| AI-генерация | [Groq](https://groq.com) (OpenAI-совместимый API, `openai/gpt-oss-120b`) |
| Деплой | [Vercel](https://vercel.com) |

## 🚀 Запуск локально

```bash
git clone https://github.com/supermangaka/recipe-ai-hub.git
cd recipe-ai-hub
npm install
```

Создай `.env.local` в корне проекта:

```
GROQ_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
```

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## 📐 Архитектура

```
src/
├── app/
│   ├── [locale]/          # локализованные страницы (en/ru/pt)
│   │   ├── generate/      # генерация рецепта
│   │   └── favorites/     # избранное
│   └── api/
│       ├── auth/          # NextAuth
│       ├── recipes/       # генерация через Groq
│       └── favorites/     # CRUD избранного
├── components/
├── lib/                   # клиенты Supabase, Groq, NextAuth
└── types/
```


### Схема БД (Supabase)

- `users` — профили пользователей (создаются при первом входе через Google)
- `recipes` — сохранённые рецепты
- `favorites` — связь пользователь ↔ рецепт
