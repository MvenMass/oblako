# Данные и API

## Направления

- `src/data/cities/<id>.json` — 11 файлов, контракт в `src/types/city.ts`.
- `src/data/cities/index.json`: порядок папок, хиты (Стамбул, Сочи, Занзибар), список настроений для квиза.
- Фото: `public/photos/<id>/<place>.jpg` — 1100×760, около 150 КБ. Авторство и ссылки — в `src/data/photo-credits.json`. Лицензия Pexels: бесплатно, указывать автора не обязательно, но в галерее выводим подпись «Фото: Pexels».
- Тексты уже с неразрывными пробелами после предлогов. Для чисел с единицами («2 ч», «23 кг») — хелпер `nbsp()` при рендере.
- Пометки «демо»:
  - `prices.demo = true`;
  - `facts.currency.demoRateRub` — запасной курс, пока не пришёл ЦБ;
  - `climate.avgHighC` — ориентир.

  Визы со звёздочкой (`*`) показываем со сноской «демо, в продукте — с датой проверки».
- У Тбилиси и Стамбула заполнен `scene.todPalettes` (три палитры сцены), у остальных — `null`. Для них сцена строится по текстовому описанию `scene.description`; палитру подобрать из `theme` (см. `pages/city.md`).
- Разговорник пуст у Сочи, Алтая и Калининграда — секция тогда не рендерится.

## Состояние пользователя (localStorage)

Zustand + `persist`, ключ `oblako:v1`, миграции по полю `version`.

```ts
interface UserState {
  favorites: string[];                 // id городов
  quiz: { answers: QuizAnswers | null; result: string | null };
  route: { cityId: string; days: { stops: Stop[] }[] } | null;
  routeAdded: Record<string, string[]>;  // cityId → place ids из галереи «В маршрут»
  packing: { cityId: string; packed: Record<string, boolean> } | null;
  booking: { seat: string | null; shade: boolean; passes: Pass[] };
  journal: { trips: Trip[] };
  passport: { stamps: string[]; achievements: string[] };
  ui: { boardSound: boolean; reducedMotionOverride?: boolean };
}
```
Связки: квиз → «Открыть маршрут» создаёт `route`; «В маршрут» в галерее добавляет точку; «Сборы» берут город и погоду из маршрута; оформленная бронь кладёт талон в кошелёк и штамп в паспорт.

## Погода — Open-Meteo (без ключа)

- Текущая: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&timezone=auto`.
- 7 дней (для сборов): `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code`.
- Кеш в sessionStorage на 30 минут.
- Ошибка или офлайн — показываем «—» и подпись «нет связи с Open-Meteo», без поломки вёрстки.
- `weather_code` переводится в иконку: солнце / облачно / дождь / снег / гроза.

## Курсы — ЦБ РФ через зеркало

- `https://www.cbr-xml-daily.ru/daily_json.js` → `Valute[CODE].Value / Valute[CODE].Nominal` = рублей за 1 единицу.
- Кеш в localStorage на 12 часов.
- Фолбэк — последний сохранённый курс, иначе `facts.currency.demoRateRub` с пометкой «демо».
- Для RUB чип курса не показываем. Для Занзибара берём `rateCode` (`USD`).
- Подпись: «ЦБ РФ на {дата}».

## Озвучка — Web Speech API

`speechSynthesis.speak(new SpeechSynthesisUtterance(text))`, `lang = phrases.speechLang`, `rate = 0.85`. Если голоса для языка нет (`getVoices()` без совпадения по первым двум буквам), браузер читает как сможет, а под карточкой появляется подсказка. Если API нет — подсказка вместо звука.

## Подбор тура (алгоритм квиза)

Ответы: `moods` (1–2), `month` (0–11), `days` (3–14), `budget` (30–300 тыс. ₽, на человека), `company` (`solo|pair|family|friends`).

```
mood    = moods.length ? совпавшие / moods.length : 0.5
season  = bestMonths включает month+1
cost    = flightRub + dailyRub × days
fit     = cost ≤ budget
bonus   = город в BONUS[company]
score   = min(99, round(22 + mood×42 + (season?22:0) + (fit?10:max(0,10-(cost-budget)/8000)) + (bonus?6:0) + (hit?2:0)))
BONUS = { solo:[altai,hanoi,beijing], pair:[zanzibar,yerevan,tbilisi], family:[sochi,kaliningrad,kazan], friends:[istanbul,tbilisi,shanghai] }
```
Сортировка по `score`, топ-3. Причины в результате: «Сезон в мае», совпавшие настроения, «Укладываетесь в бюджет», бонус компании.

Бюджет результата делится так:
- перелёт = `flightRub`;
- жильё = 45% от `dailyRub × days`;
- еда = 30%;
- впечатления = 25%.

Эту функцию покрыть юнит-тестами.
