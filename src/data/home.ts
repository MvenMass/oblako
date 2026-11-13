// Тексты секций главной. Источник — объект HD в docs/design/Hero.dc.html.
// Данные городов (перелёт, цены, месяцы) берутся из src/data/cities, а не отсюда.
// При выводе тексты проходят через typograph().

export interface Tool {
  to: string;
  title: string;
  text: string;
  preview: 'folders' | 'route' | 'budget' | 'board' | 'booking' | 'packing' | 'journal' | 'profile';
}

export const TOOLS: Tool[] = [
  { to: '/destinations', title: 'Направления', text: 'Папки с досье на 11 городов', preview: 'folders' },
  { to: '/route', title: 'Маршрут', text: 'Дни поездки на 3D-карте', preview: 'route' },
  { to: '/budget', title: 'Бюджет', text: 'Траты по категориям и дням', preview: 'budget' },
  { to: '/board', title: 'Табло', text: 'Табло вылетов · демо', preview: 'board' },
  { to: '/booking', title: 'Бронирование', text: 'Место у окна и талон', preview: 'booking' },
  { to: '/packing', title: 'Сборы', text: 'Чемодан, вес и погода', preview: 'packing' },
  { to: '/journal', title: 'Дневник', text: 'Фото и истории поездок', preview: 'journal' },
  { to: '/profile', title: 'Профиль', text: 'Паспорт со штампами', preview: 'profile' },
];

export interface HowStep {
  title: string;
  text: string;
}

export const HOW_STEPS: HowStep[] = [
  { title: 'Подобрать', text: 'Пять вопросов — и готовый тур под настроение, даты и бюджет.' },
  { title: 'Собрать маршрут', text: 'Точки на карте по дням, время в пути и погода.' },
  { title: 'Забронировать', text: 'Место у окна и посадочный талон в кошельке.' },
  { title: 'Сохранить', text: 'Фото, истории и штамп в паспорте путешественника.' },
];

/** Приборы кабины: [значение, максимум шкалы, подпись] */
export const GAUGES: [number, number, string][] = [
  [11, 12, 'направлений'],
  [8, 10, 'инструментов'],
  [2, 4, 'источника живых данных'],
  [0, 10, 'рублей стоит пользоваться'],
];

/** Облако настроений: тег → города */
export const MOOD_TAGS: [string, string[]][] = [
  ['море', ['sochi', 'zanzibar', 'istanbul', 'kaliningrad']],
  ['вино', ['tbilisi', 'yerevan']],
  ['горы', ['altai', 'sochi', 'tbilisi', 'yerevan']],
  ['храмы', ['tbilisi', 'yerevan', 'kazan', 'beijing']],
  ['мегаполис', ['shanghai', 'beijing', 'istanbul']],
  ['экзотика', ['zanzibar', 'hanoi']],
  ['базары', ['istanbul', 'hanoi', 'yerevan']],
  ['канатка', ['tbilisi', 'sochi']],
  ['чай', ['sochi', 'istanbul', 'shanghai']],
  ['стрит-фуд', ['hanoi', 'istanbul', 'shanghai']],
  ['пляж', ['zanzibar', 'sochi', 'kaliningrad']],
  ['архитектура', ['kazan', 'beijing', 'shanghai', 'istanbul']],
  ['ночная жизнь', ['shanghai', 'istanbul', 'tbilisi']],
  ['история', ['beijing', 'yerevan', 'kazan', 'kaliningrad']],
  ['природа', ['altai', 'zanzibar', 'sochi']],
  ['острова', ['zanzibar', 'istanbul']],
  ['специи', ['zanzibar', 'istanbul']],
  ['небоскрёбы', ['shanghai']],
  ['дюны', ['kaliningrad']],
  ['озёра', ['altai', 'yerevan']],
  ['кухня', ['tbilisi', 'yerevan', 'kazan', 'hanoi']],
  ['снег', ['altai', 'sochi', 'kazan']],
];

export interface Story {
  title: string;
  cityId: string;
  /** Ключи фото из public/photos/<cityId>/ — по одному на слайд */
  photos: string[];
  slides: string[];
}

export const STORIES: Story[] = [
  {
    title: 'Неделя в Стамбуле',
    cityId: 'istanbul',
    photos: ['balat', 'ferry', 'galata'],
    slides: [
      'Начали с Балата: цветные дома лучше снимать утром',
      'Паром в Кадыкёй — самая дешёвая экскурсия по Босфору',
      'Итог: хотим вернуться осенью',
    ],
  },
  {
    title: 'Тбилиси на выходные',
    cityId: 'tbilisi',
    photos: ['oldtown', 'narikala', 'baths'],
    slides: [
      'Поселились в Сололаки — всё пешком',
      'Канатка к Нарикале на закате',
      'Серные бани — обязательно',
    ],
  },
  {
    title: 'Закат на Босфоре',
    cityId: 'istanbul',
    photos: ['night', 'ferry', 'sophia'],
    slides: [
      'Паром отходит от Эминёню каждые 20 минут',
      'Чай на палубе и чайки за кормой',
      'Лучший вид — с верхней палубы',
    ],
  },
  {
    title: 'Хинкали-тур',
    cityId: 'tbilisi',
    photos: ['khinkali', 'oldtown', 'aivani'],
    slides: [
      'Пять хинкальных за два дня',
      'Едят руками, хвостик оставляют',
      'Победила маленькая в Сололаки',
    ],
  },
  {
    title: 'Мцхета за полдня',
    cityId: 'tbilisi',
    photos: ['jvari', 'aivani', 'narikala'],
    slides: [
      'Маршрутка от Дидубе — 40 минут',
      'Джвари на холме над слиянием рек',
      'Обратно — через Светицховели',
    ],
  },
  {
    title: 'Базары и лампы',
    cityId: 'istanbul',
    photos: ['bazaar', 'lamps', 'simit'],
    slides: [
      'Гранд-базар: 60 улиц под одной крышей',
      'Торговаться — нормально',
      'Лампу везли в ручной клади',
    ],
  },
  {
    title: 'Ночной Тбилиси',
    cityId: 'tbilisi',
    photos: ['night', 'bridge', 'oldtown'],
    slides: [
      'Подсветка крепости видна отовсюду',
      'Мост Мира сияет после заката',
      'Ужин на набережной Куры',
    ],
  },
];

export const FAQ: [string, string][] = [
  ['Это бесплатно?', 'Да. Все инструменты бесплатны, регистрация не нужна.'],
  [
    'Можно купить билет прямо здесь?',
    'Нет. Бронирование в OBLAKO демонстрационное: показывает, как мог бы выглядеть процесс.',
  ],
  [
    'Откуда погода и курсы?',
    'Погода — из открытого сервиса Open-Meteo, курсы валют — с сайта Банка России.',
  ],
  [
    'Как работает подбор поездки?',
    'Пять вопросов: настроение, месяц, длительность, бюджет и компания. Алгоритм сравнивает ответы с данными 11 направлений и собирает готовый тур.',
  ],
  [
    'Где хранятся маршруты?',
    'В вашем браузере. На сервер ничего не уходит, поэтому на другом устройстве маршрутов не будет.',
  ],
  [
    'Насколько свежая информация о визах?',
    'Визовые данные — демо, отмечены звёздочкой. Перед поездкой сверяйтесь с официальными источниками.',
  ],
];

export const FAQ_FALLBACK =
  'Хороший вопрос! Это демо-чат, поэтому ответы есть только на вопросы слева. Загляните в подбор поездки — там всё по-настоящему.';
