# Бот для отслежения ноды
## Порядок установки:

#Изменения

1. обновляем пакеты
```
sudo apt update && sudo apt upgrade -y
```
2. скачиваем репозиторий
```
git clone https://github.com/nadyacoin/neutron_bot.git
```
3. Устанавливаем nodejs и npm
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - && \
sudo apt-get install nodejs -y && \
echo -e "\nnodejs > $(node --version).\nnpm  >>> v$(npm --version).\n"
```
> результат выполнения должен быть примерно такой:

> ![resultatnpm](https://user-images.githubusercontent.com/56988566/195841827-4764e964-0a8a-4ebd-b867-1cd641280008.png)

4. переходим в папку проекта
```
cd /$USER/neutron_bot
```
5. устанавливаем необходимые модули
```
npm i
```
6. создаем файл .env 
```
nano .env
```
и вводим необходимые данные для работы бота в файл .env
```
BOT_TOKEN=TOKEN
VALOPER=valoper_address
CHATID=chat_id
INFOTIME=10
LASTPROPOSAL=0
```
> TOKEN - телеграм токен <br>
> valoper_address - валопер адрес <br>
> chat_id - id чата <br>
> 10 - задержка повторных отправок сообщений в секундах при критических ошибках (можно редактировать в самом боте) <br>
> 0 - последний известный пропозал. Можно всегда поставить 0, тогда бот уведомит о последнем пропозале и перезапишет значение.

>> где взять TOKEN и chat_id можете посмотреть в статье [Настройка телеграм бота](https://nodera.org/panic_bot#gugm)
7. устанавливаем pm2 для запуска бота в фоне
```
npm i pm2 -g
```
8. запуск бота (обязательно выполняется в папке бота)
```
pm2 start index.js
```
> ![npm_start](https://user-images.githubusercontent.com/56988566/195844549-5aaae4d7-af1a-44d2-acb0-eaeb207d14a6.png)
> статус online говорит о том, что бот запущен
9. для остановки бота выполняется команда: (расширение файла .js необязательна)
```
pm2 stop index
```
> ![npm_st](https://user-images.githubusercontent.com/56988566/195845413-1b9281d9-df54-4e59-9a0e-0a2a9a85c914.png)
> бот остановлен

## Что умеет бот (для рабоы бота нет необходимости открывать порты)

Бот каждые INFOTIME проверяет синхронизацию ноды, jailed, выход нового пропозала, количество пиров. В случае плохих результатов уведомляет пользователя. <br>

А также имеет команды для проверки вручную:
```
  /start - Приветствие
  /info - Информация о валидаторе
  /aprop - Список активных proposal
  /allprop - Список всех proposals
  /df - Информация о жестком диске
  /peer - Количество пиров
  /free - Информация об ОЗУ
  /vsync - Информация о синхронизации
  /settime - Частота отправки сообщений при критических ошибках ноды
```

## Подробнее о коде:
![loop](https://user-images.githubusercontent.com/103100190/202829617-28f2dcc0-ab79-4e70-aa40-4d9974df9171.png)
 <br>
Функция loop() каждые infotime секунда запускает функцию prov() <br>
Функция `let valiki = await infop('infoval',valoper)` возвращает состояние валидатора: <br>
![code2](https://user-images.githubusercontent.com/56988566/195886216-6ae6ee2b-c077-4a14-9d23-63993f0ea7e2.png) <br>
если `jailed` станет `true`, то отправит сообщение `valoper jailed` <br>
Функция `let vsync = await infop('vsync')` возвращает состояние синхронизации ноды: <br>
![code3](https://user-images.githubusercontent.com/56988566/195887012-69145bd2-e71b-463e-86b6-56bc92dad1ef.png) <br>
Если `catching_up` станет `true`, то отправит сообщение `the node is not synchronized, check the synchronization information with the /vsync command` <br>
Функция `let allprop = await infop('allprop')` возвращает список всех пропозалов:  <br>
![code4](https://user-images.githubusercontent.com/56988566/195887982-113516e4-e1db-42e1-afd7-94f14672b222.png)  <br>
Функция `peer` проверяет количество пиров, если пиров менее 2-х, то перезагружает ноду в надежде поймать пир
Потом берется последний пропозал и сравниватся с `LASTPROPOSAL`. Если последний пропозал больше, чем в `LASTPROPOSAL`, то отправляется сообщение пользователю и `LASTPROPOSAL` перезаписывается.
## О ручных командах:
### /start - Бот имеет меню для удобной навигации
![menu](https://user-images.githubusercontent.com/103100190/202829836-c16dfcd1-5370-431f-b841-7dfdbab31e84.png)

### /info - Информация о ноде
![info](https://user-images.githubusercontent.com/103100190/202829884-7aae8038-04d1-49ac-a68d-75f590cc9a8d.png)

### /aprop - Список активных proposal
![r3](https://user-images.githubusercontent.com/56988566/195890052-affac785-41a1-4923-bc12-c019accad3ed.png)
### /allprop - Список всех proposals
![r4](https://user-images.githubusercontent.com/56988566/195890241-95892ae6-3a3b-49e7-98dc-bbe741d47e52.png)
### /df - Информация о жестком диске
![r5](https://user-images.githubusercontent.com/56988566/195890492-58c9f148-cb7e-4099-b014-c8b42679efdb.png)
### /free - Информация об ОЗУ
![r6](https://user-images.githubusercontent.com/56988566/195890750-545afafd-f0d9-46d1-b914-271bfe5980ba.png)
### /vsync - Информация о синхронизации
![r7](https://user-images.githubusercontent.com/56988566/195890968-c06ce3ee-4f05-41a3-9cb6-030acc0a537c.png)
### /settime - Частота отправки сообщений при критических ошибках ноды
![r8](https://user-images.githubusercontent.com/56988566/195891234-2e22a9f7-8e35-46fe-b4e6-91e4ad5dfb6f.png)

