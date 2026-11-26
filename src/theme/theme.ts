export const colors = {
  // фон и поверхности
  background: "#1B1C22", // глубокий фон экранов
  surface: "#2A2B33", // карточки
  surfaceLight: "#33354F", // прессованные элементы, инпуты
  border: "#3D3F4A",

  // текст
  textPrimary: "#F2F4F8",
  textSecondary: "#9CA3B5",
  textMuted: "#5C6270",

  // акценты из логотипа
  ice: "#61EBFF", // основной акцент — ледяной циан
  iceSoft: "#A6FBF8", // светлый лёд
  iceDeep: "#3193C8", // глубокий синий, вторичные элементы
  gold: "#D39F3B", // золото — главный акцент
  goldBright: "#FFE26D", // блики золота, highlights
  goldDeep: "#975F0F", // тень золота, pressed-состояния

  // семантика
  income: "#61EBFF", // доход — лёд
  expense: "#E86A5E", // расход — тёплый коралл (единственный цвет вне логотипа)
} as const;

export const lightColors = {
  ...colors,
  background: "#F4F6F9",
  surface: "#FFFFFF",
  surfaceLight: "#E9EDF3",
  border: "#DDE2EA",
  textPrimary: "#22242C",
  textSecondary: "#5C6270",
  ice: "#1BA7C9", // затемнённый лёд для читаемости
  income: "#0E8CA8",
  gold: "#B8831F",
} as const;

export const spacing = { xs: 4, s: 8, m: 16, l: 24, xl: 32 } as const;
export const radius = { s: 8, m: 14, l: 22, pill: 999 } as const;
export const currency = "Б";
