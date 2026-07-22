import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Colors, Radius, Spacing } from "../constants/theme";

export default function AppCard({
  children,
}: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});