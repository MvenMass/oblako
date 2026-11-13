// Контракт данных направлений. Источник — src/data/cities/*.json.
// Все тексты уже оттипографированы (неразрывные пробелы   после предлогов).

export type MoodId = 'sea' | 'mountains' | 'food' | 'history' | 'city' | 'exotic';
export type PlaceCategory = 'see' | 'eat' | 'nature' | 'evening';

export interface TodPalette {
  far: string; snow: string; mid: string; mid2: string; city: string; city2: string;
  roof: string; wood: string; winBase: string; win: number; water: string; near: string;
  grape: string; sun: string; stars: number; cloud: number; wire: string; gull: string;
  sky: string; // CSS linear-gradient
  sx: number; sy: number; // положение солнца/луны во viewBox 1440×780
  ink: string; // цвет заголовка поверх сцены
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  district: string;
  duration: string;
  price: string; // ориентир, демо
  description: string;
  photo: string; // путь от /public
  map: { x: number; y: number }; // координаты на мини-карте 440×300
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  iata: string;
  hit: boolean;
  utc: number;
  coords: { lat: number; lon: number };
  theme: {
    bg: string; ink: string; muted: string; accent: string; accent2: string;
    folder: [string, string]; // градиент папки и карточки результата квиза
    gradient?: string; // живой градиент акцентных слов
    font: { family: string; googleParam: string } | null; // доп. шрифт для местной письменности
  };
  greeting: { native: string; translit: string; ru: string; lang: string };
  lead: string;
  facts: {
    flight: string; flightMinutes: number; visa: string; language: string; languageNote: string;
    timeDiff: string; plugs: string;
    currency: { code: string; name: string; demoRateRub: number; rateCode: string };
  };
  climate: { avgHighC: number[]; bestMonths: number[]; note: string };
  quiz: { moods: MoodId[]; dailyRub: number; flightRub: number };
  know: { title: string; text: string }[];
  places: Place[];
  dishes: { name: string; text: string }[];
  itinerary: string[][]; // 3 дня × 3 пункта
  phrases: { speechLang: string; items: { native: string; translit: string; ru: string }[] };
  prices: { demo: boolean; items: { item: string; local: number; moscowRub: number }[] };
  scene: { description: string; todPalettes: TodPalette[] | null };
}

export interface CitiesIndex {
  order: string[];
  hits: string[];
  moods: { id: MoodId; label: string }[];
}
