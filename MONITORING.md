# 📊 Руководство по мониторингу логов сайта

## 🚀 Быстрый доступ к серверу

```bash
# Подключение к серверу
ssh alexika
```

## 📱 Логи приложения (Docker)

### Основные команды

```bash
# Показать последние логи контейнера
docker logs alexika-new-app-1

# Мониторинг логов в реальном времени (самая используемая)
docker logs -f alexika-new-app-1

# Показать последние 50 строк логов
docker logs --tail 50 alexika-new-app-1

# Логи с временными метками
docker logs -t alexika-new-app-1

# Показать логи за последний час
docker logs --since 1h alexika-new-app-1
```

### Полезные фильтры

```bash
# Только ошибки (фильтр по ERROR)
docker logs alexika-new-app-1 2>&1 | grep ERROR

# Логи аутентификации Better Auth
docker logs alexika-new-app-1 2>&1 | grep "auth.ts"

# Логи запросов к API
docker logs alexika-new-app-1 2>&1 | grep "/api/"
```

## 🔐 Проверка ENV переменных в контейнере

### Основные команды для ENV

```bash
# Показать все ENV переменные в контейнере
docker exec alexika-new-app-1 env

# Показать ENV переменные с фильтром
docker exec alexika-new-app-1 env | grep BETTER_AUTH

# Показать конкретную переменную
docker exec alexika-new-app-1 printenv DATABASE_URL

# Зайти внутрь контейнера для детального анализа
docker exec -it alexika-new-app-1 sh

# Внутри контейнера можно использовать:
# env | grep AUTH
# echo $DATABASE_URL
# cat .env.production
```

### Быстрая проверка ключевых переменных

```bash
# Проверить основные переменные окружения
docker exec alexika-new-app-1 env | grep -E "(DATABASE_URL|BETTER_AUTH|NEXTAUTH|NODE_ENV)"

# Проверить переменные Better Auth
docker exec alexika-new-app-1 env | grep -E "(BETTER_AUTH_URL|BETTER_AUTH_SECRET)"

# Проверить переменные базы данных
docker exec alexika-new-app-1 env | grep -E "(DATABASE|POSTGRES)"
```

### Сравнение ENV файлов

```bash
# Посмотреть .env файлы на хосте
cat /var/www/alexika-new/.env.production
cat /var/www/alexika-new/.env.local

# Посмотреть что загрузилось в контейнер
docker exec alexika-new-app-1 cat .env.production
docker exec alexika-new-app-1 cat .env.local
```

## 🌐 Логи Nginx

```bash
# Логи доступа (все запросы к сайту)
sudo tail -f /var/log/nginx/access.log

# Логи ошибок Nginx
sudo tail -f /var/log/nginx/error.log

# Последние 100 запросов
sudo tail -100 /var/log/nginx/access.log

# Фильтр по статусу ошибок (4xx, 5xx)
sudo tail -f /var/log/nginx/access.log | grep " [45][0-9][0-9] "
```

## 🔧 Системные логи

```bash
# Логи Docker службы
sudo journalctl -u docker -f

# Системные логи
sudo journalctl -f

# Логи за последние 30 минут
sudo journalctl --since "30 minutes ago"
```

## 📈 Мониторинг состояния

### Проверка контейнеров

```bash
# Список запущенных контейнеров
docker ps

# Статистика использования ресурсов
docker stats

# Информация о конкретном контейнере
docker inspect alexika-new-app-1
```

### Проверка портов и соединений

```bash
# Проверить какие порты слушаются
sudo netstat -tlnp | grep 3000

# Активные соединения
sudo netstat -an | grep :3000

# Проверка доступности сайта
curl -I https://alexika.es
```

## 🛠️ Полезные алиасы

Добавьте в `~/.bashrc` для быстрого доступа:

```bash
# Добавить алиасы
echo "alias logs='docker logs -f alexika-new-app-1'" >> ~/.bashrc
echo "alias app-status='docker ps'" >> ~/.bashrc
echo "alias app-stats='docker stats'" >> ~/.bashrc
echo "alias app-env='docker exec alexika-new-app-1 env'" >> ~/.bashrc
echo "alias app-shell='docker exec -it alexika-new-app-1 sh'" >> ~/.bashrc
echo "alias nginx-access='sudo tail -f /var/log/nginx/access.log'" >> ~/.bashrc
echo "alias nginx-error='sudo tail -f /var/log/nginx/error.log'" >> ~/.bashrc

# Применить изменения
source ~/.bashrc
```

После этого можно использовать короткие команды:
- `logs` - логи приложения в реальном времени
- `app-status` - статус контейнеров
- `app-stats` - статистика ресурсов
- `app-env` - ENV переменные контейнера
- `app-shell` - войти в контейнер
- `nginx-access` - логи доступа Nginx
- `nginx-error` - логи ошибок Nginx

## 🚨 Устранение проблем

### Если сайт не отвечает

```bash
# 1. Проверить контейнер
docker ps

# 2. Посмотреть логи
docker logs --tail 100 alexika-new-app-1

# 3. Проверить ENV переменные
docker exec alexika-new-app-1 env | grep -E "(DATABASE|BETTER_AUTH)"

# 4. Проверить Nginx
sudo systemctl status nginx

# 5. Проверить порт
sudo netstat -tlnp | grep 3000

# 6. Перезапустить контейнер если нужно
docker restart alexika-new-app-1
```

### Если проблемы с аутентификацией

```bash
# Проверить переменные Better Auth
docker exec alexika-new-app-1 env | grep BETTER_AUTH

# Проверить доступность базы данных
docker exec alexika-new-app-1 printenv DATABASE_URL

# Проверить логи аутентификации
docker logs alexika-new-app-1 2>&1 | grep -i "auth"
```

### Если GitHub Actions не деплоит

```bash
# Проверить последний деплой
cd /var/www/alexika-new
git log --oneline -5

# Проверить права
ls -la /var/www/alexika-new

# Проверить .env файл
cat .env.production

# Сравнить с тем что в контейнере
docker exec alexika-new-app-1 cat .env.production
```

## 📝 Часто используемые команды

```bash
# Топ-5 самые используемые команды:

# 1. Мониторинг логов в реальном времени
docker logs -f alexika-new-app-1

# 2. Проверка статуса
docker ps

# 3. Проверка ENV переменных
docker exec alexika-new-app-1 env | grep -E "(DATABASE|BETTER_AUTH)"

# 4. Логи Nginx (если проблемы с доступом)
sudo tail -f /var/log/nginx/access.log

# 5. Вход в контейнер для детального анализа
docker exec -it alexika-new-app-1 sh
```

## 🔍 Диагностика Better Auth

```bash
# Полная диагностика Better Auth переменных
docker exec 3bf1e180f1e env | grep -E "(BETTER_AUTH|DATABASE|NEXTAUTH)" | sort

# Проверить структуру базы данных (если доступно)
docker exec alexika-new-app npx prisma db pull --preview-feature

# Логи связанные с аутентификацией
docker logs alexika-new-app 2>&1 | grep -i -E "(auth|sign|login|register)"
```

---

**💡 Совет:** Держите открытыми 3 терминала - один для логов приложения (`docker logs -f`), один для ENV переменных (`docker exec ... env`), третий для команд управления.