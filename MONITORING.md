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
echo "alias nginx-access='sudo tail -f /var/log/nginx/access.log'" >> ~/.bashrc
echo "alias nginx-error='sudo tail -f /var/log/nginx/error.log'" >> ~/.bashrc

# Применить изменения
source ~/.bashrc
```

После этого можно использовать короткие команды:
- `logs` - логи приложения в реальном времени
- `app-status` - статус контейнеров
- `app-stats` - статистика ресурсов
- `nginx-access` - логи доступа Nginx
- `nginx-error` - логи ошибок Nginx

## 🚨 Устранение проблем

### Если сайт не отвечает

```bash
# 1. Проверить контейнер
docker ps

# 2. Посмотреть логи
docker logs --tail 100 alexika-new-app-1

# 3. Проверить Nginx
sudo systemctl status nginx

# 4. Проверить порт
sudo netstat -tlnp | grep 3000

# 5. Перезапустить контейнер если нужно
docker restart alexika-new-app-1
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
```

## 📝 Часто используемые команды

```bash
# Топ-3 самые используемые команды:

# 1. Мониторинг логов в реальном времени
docker logs -f alexika-new-app-1

# 2. Проверка статуса
docker ps

# 3. Логи Nginx (если проблемы с доступом)
sudo tail -f /var/log/nginx/access.log
```

---

**💡 Совет:** Держите открытыми 2 терминала - один для логов приложения (`docker logs -f`), другой для команд управления.