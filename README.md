## Тестовое задание для boothelp.io


### Задание
 Нужно разработать back-end приложения для хранения информаци о вкаладх клиентов банка. Приложением будет пользов    аться
 администратор, ему нужно иметь возможность добавлять, удалять и просматривать вклады. Информация о вкладах должн    а.
 храниться в виде текстового файла, где каждая строка - это JSON сериализованный объект с информацией о вкаладе.     Файл со
 стартовыми данными(то есть списком вкладов, которые уже сделаны) будет предоставлен.
 
 У вкалада есть следующие свойства
 - идентификатор
 - имя клиента
 - сумма в RUR
 - сумма в USD
 
 Нужно создать HTTP API для прсмотра, доавбления и удаления вкладов. При создании вклада указывается имя клиента     и сумма
 в рублях. Сумма в USD должна быть вычислена исходя из актуального курса обмена.
 ..
 Кроме того, раз в час приложение должно получать актуальный курс USD к RUR и обновлять сумму в долларах для.
 всех существующих вкладов.

 Актуальный курс обмена можно получить используя API: https://www.cbr-xml-daily.ru/daily_json.js
 
 Помните, что важно эффективно использовать ресурсы сервера, на котором будет запущено приложение. Также учитывай    те, что
 код должен быть поддерживаемым. Вместе с решением тестового задания предоставьте описание того, как запустить
 созданное приложение. Плюсом будет применение Docker, наличие автотестов.

 ### Вклады пользователя (deposits)
 Работа со вкладами пользователя осушествляеться, через repository DepositsRepository.
 В нем содержится работа с текстовым файлом. 
 При создании вкладв deposits обращаются к exchage, где содержиться информация по текущему курсу валют. Echange хранит информацию о полученных с api(https://www.cbr-xml-daily.ru/daily_json.js) в файле. Почасовые запросы реализованы с помощью ExchangeScheduler реализованного с помощью cron([@nest/schedule](https://www.npmjs.com/package/nest-schedule))

 ### Запуск приложения
Приложение запyскается командой 
```
docker compose buld dev && docker compose up dev
```
### Переменные окружения
Переменные окружения лежат в .env файле:
- EXCHANGE_API - путь запроса до курсов валют
- EXCHANGE_REPOSITORY_FILE_PATH - путь до файла с результом апи
- DEPOSITS_REPOSITORY_FILE_PATH - путь до файла с депозитами
- DEPOSIT_SHEDULER_PATTERN- паттерн для интервала повторения

[swagger](http://localhost:3000/api)