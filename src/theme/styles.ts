// theme/styles.ts
import { StyleSheet } from "react-native";
import { colors, radius } from "./theme";
import { type, fonts } from "../theme/fonts";

export const card = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    padding: 16,
  },
});

export const text = StyleSheet.create({
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  income: {
    color: colors.income,
    fontFamily: fonts.semiBold,
    fontWeight: "600",
  },
  expense: {
    color: colors.expense,
    fontFamily: fonts.semiBold,
    fontWeight: "600",
  },
});
