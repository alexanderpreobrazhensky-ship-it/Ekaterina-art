# SETUP GUIDE: Supabase для Ekaterina Art Platform

## 1. Создать проект Supabase

1. Откройте [supabase.com](https://supabase.com/) и создайте новый проект.
2. Выберите организацию, задайте имя проекта и надежный пароль базы данных.
3. Дождитесь статуса `Project is ready`.
4. Откройте `Project Settings → API` и скопируйте:
   - `Project URL`;
   - `anon public` key.

> Важно: не публикуйте `service_role`, `sb_secret_*` и другие секретные ключи в репозитории, чатах и клиентском коде. Если ключ был случайно раскрыт, ротируйте его в Supabase Dashboard.

## 2. Запустить SQL-схему

1. Откройте `SQL Editor` в Supabase Dashboard.
2. Создайте новый query.
3. Скопируйте содержимое файла `supabase-schema.sql` из корня репозитория.
4. Нажмите `Run`.

Скрипт создаёт:

- таблицу `profiles`;
- таблицу `orders`;
- таблицу `technical_specifications`;
- таблицу `consent_records`;
- таблицу `order_history`;
- индексы;
- RLS-политики;
- trigger для автоматического создания профиля при регистрации пользователя;
- Storage buckets `portfolio` и `order-files`.

## 3. Настроить роли администратора

Админский доступ проверяется через JWT `app_metadata` пользователя:

```json
{
  "role": "admin"
}
```

Вариант настройки:

1. Создайте пользователя через `Authentication → Users` или зарегистрируйтесь через форму сайта.
2. Откройте пользователя в Supabase Dashboard.
3. В `Raw app meta data` добавьте `"role": "admin"`.
4. Перелогиньтесь на сайте, чтобы JWT обновился.

Обычный клиент видит только свои заказы. Администратор видит все заказы.

## 4. Настроить ENV

Создайте локальный файл `.env.local` в корне проекта:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Эти переменные используются в браузере, поэтому здесь должен быть только публичный `anon` key. Не добавляйте в `.env.local` секретный service key для клиентского приложения.

## 5. Настроить Auth

В Supabase Dashboard откройте `Authentication → Providers`:

### Email + пароль

1. Включите `Email` provider.
2. Оставьте `Confirm email` включенным или выключенным в зависимости от нужного сценария MVP.
3. На странице `/login` используйте вкладку `Email + пароль`.

### Email + magic link

1. Включите `Email` provider.
2. Проверьте SMTP-шаблон для magic link или используйте тестовую отправку Supabase.
3. В `Authentication → URL Configuration` добавьте локальный адрес в redirects:

```text
http://localhost:3000/account
```

4. На странице `/login` используйте вкладку `Magic link`.

### Будущий вход по телефону

Архитектура уже подготовлена:

- в `profiles` есть поле `phone`;
- на `/login` есть отдельная вкладка `Телефон`;
- для запуска потребуется включить Phone Auth в Supabase, подключить SMS-провайдера и заменить заглушку на `supabase.auth.signInWithOtp({ phone })`.

## 6. Запуск локально

Установите зависимости:

```bash
npm install
```

Запустите dev-сервер:

```bash
npm run dev
```

Откройте приложение:

```text
http://localhost:3000
```

Основные страницы для проверки:

- `/login` — авторизация через Supabase Auth;
- `/account` — создание заявки и список заказов текущего пользователя;
- `/admin` — список заказов для администратора.

## 7. Проверка сценария заказа

1. Зарегистрируйтесь или войдите на `/login`.
2. Перейдите на `/account`.
3. Заполните форму новой заявки.
4. После отправки в Supabase появятся записи:
   - `profiles` — профиль пользователя;
   - `orders` — заказ;
   - `consent_records` — фиксация согласий с версиями документов;
   - `order_history` — событие `заявка создана`.
5. Обычный клиент увидит только свои заказы.
6. Пользователь с `app_metadata.role = admin` увидит все заказы на `/admin`.

## 8. Storage buckets

SQL создает два bucket:

- `portfolio` — публичное чтение, запись только для администратора;
- `order-files` — приватные файлы заказов.

Для `order-files` используйте путь с первым сегментом `auth.uid()`, например:

```text
<user-id>/<order-id>/reference-1.jpg
```

Так RLS-политики Storage смогут ограничить чтение файлов владельцем и администратором.
