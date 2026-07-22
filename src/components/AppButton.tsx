import { Pressable, StyleSheet } from "react-native";
import { Colors, Radius, Spacing } from "../constants/theme";
import AppText from "./AppText";

type Props = {
  title: string;
  onPress?: () => void;
};

export default function AppButton({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <AppText style={styles.text}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: "center",
  },

  pressed: {
    opacity: 0.8,
  },

  text: {
    color: "#fff",
    fontWeight: "600",
  },
});