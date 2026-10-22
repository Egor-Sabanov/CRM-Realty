# FORMA Realty CRM

Полноценная CRM-панель агентства недвижимости: каталог объектов, обращения клиентов, этапы работы, ответственные сотрудники и история контактов.

## Возможности

- Дашборд с актуальными показателями объектов, обращений и сделок.
- Каталог недвижимости: поиск, фильтр, создание, изменение и удаление карточки.
- Карточка объекта с фотографией, параметрами и связанными обращениями.
- Обращения клиентов: поиск, статусы, ответственные, бюджет, связанный объект, заметки и история изменений.
- Защищённые рабочие страницы и вход по переменным окружения.
- Реалистичные демонстрационные записи с вымышленными контактами.
- Адаптивный интерфейс для компьютеров и телефонов.

## Технологии

Next.js 16, React 19, TypeScript, PostgreSQL 17, Prisma 7, CSS Modules. Таблицы защищены RLS и не открыты для публичного API; приложение обращается к ним серверным подключением.

## Подготовка окружения

Требуются Node.js 24 и PostgreSQL. Отдельная база CRM создана в Supabase в регионе EU West (Paris) и наполнена демонстрационными записями. Она отдельна от других проектов аккаунта.

1. Клонируйте репозиторий и установите пакеты: npm install.
2. Откройте проект CRM в Supabase, нажмите Connect и возьмите строку подключения Session pooler. Задайте пароль базы в панели Supabase и замените пароль в строке. Подробности подключения: https://supabase.com/docs/guides/database/connecting-to-postgres.
3. Скопируйте .env.example в .env. Укажите DATABASE_URL, SESSION_SECRET (не короче 32 символов), ADMIN_EMAIL и собственный ADMIN_PASSWORD. Не отправляйте секреты в чат и не добавляйте .env в Git.
4. Так как таблицы этой базы уже созданы, отметьте три начальные миграции как применённые:
   - npx prisma migrate resolve --applied 20261021163000_init
   - npx prisma migrate resolve --applied 20261022111500_enable_rls
   - npx prisma migrate resolve --applied 20261022123000_add_crm_indexes
5. Повторно запустите seed при необходимости: npm run db:seed. Демо-наполнение идемпотентно.
6. Запустите npm run dev и откройте http://localhost:3000. Войдите с ADMIN_EMAIL и ADMIN_PASSWORD из .env.

На Windows, если PowerShell перехватывает команды, используйте npm.cmd и npx.cmd вместо npm и npx.

## Пустая база и деплой

Для другой, ещё пустой базы не выполняйте baseline-команды выше. Примените миграции обычным способом: npx prisma migrate deploy, затем npm run db:seed.

Для Vercel задайте DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL и ADMIN_PASSWORD в Project Settings → Environment Variables. Для serverless окружения возьмите строку подключения из Supabase Connect, предназначенную для pooler. Перед запуском приложения примените миграции командой npx prisma migrate deploy.

## Проверки

В репозитории добавлен GitHub Actions workflow для Prisma generation, ESLint и production build.