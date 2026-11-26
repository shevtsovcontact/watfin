export const fonts = {
  display: "Unbounded_700Bold", // баланс, заголовки
  heading: "Unbounded_500Medium", // заголовки секций
  body: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semiBold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
} as const;

export const type = {
  balance: { fontFamily: fonts.display, fontSize: 34, lineHeight: 42 },
  h1: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 30 },
  h2: { fontFamily: fonts.heading, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 17 },
  amount: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22 },
} as const;
