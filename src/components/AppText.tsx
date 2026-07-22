import { StyleSheet, Text, TextProps } from "react-native";
import { Colors, FontSize } from "../constants/theme";

type AppTextProps = TextProps & {
  variant?: "title" | "subtitle" | "body" | "caption";
};

export default function AppText({
  variant = "body",
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[styles.base, styles[variant], style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: Colors.text,
  },

  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: FontSize.subtitle,
    fontWeight: "600",
  },

  body: {
    fontSize: FontSize.body,
  },

  caption: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
});