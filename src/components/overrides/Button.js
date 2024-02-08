import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS, SIZES } from "../../variables/styles";

// types: primary, danger, warning, (default)

export const FlowButton = ({
  content: Content,
  ghost,
  disabled,
  type,
  ...restProps
}) => {
  const color =
    type === "primary"
      ? COLORS.normalGreen
      : type === "danger"
      ? COLORS.brightRed
      : type === "warning"
      ? COLORS.brightYellow
      : COLORS.brightBlue;

  const isDisabled = disabled ?? false;
  const isGhost = ghost ?? false;

  const buttonStyle = isGhost
    ? { backgroundColor: "transparent", ...styles.button }
    : {
        backgroundColor: isDisabled ? COLORS.darkGray : color,
        padding: 10,
        borderRadius: 5,
        ...styles.button,
      };

  const textStyle = isGhost
    ? { color: isDisabled ? COLORS.semiDarkGray : color, ...styles.text }
    : {
        color: isDisabled ? COLORS.semiDarkGray : COLORS.white,
        ...styles.text,
      };

  return (
    <Pressable disabled={isDisabled} {...restProps} style={{ ...buttonStyle }}>
      {typeof Content === "string" ? (
        <Text style={{ ...textStyle }}>{Content}</Text>
      ) : (
        <Content color={textStyle.color} size={SIZES.fontExtraLarge} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
    userSelect: "none",
  },
  text: {
    padding: 2,
  },
});
