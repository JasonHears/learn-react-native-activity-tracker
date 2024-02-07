import { StyleSheet } from "react-native";
import { COLORS } from "../../variables/styles";
import { Text } from "react-native";

export const FlowText = ({ children, style }) => {
  return <Text style={{ ...styles.text, ...style }}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: COLORS.white,
  },
});
