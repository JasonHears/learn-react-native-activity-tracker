import { View, StyleSheet } from "react-native";
import { FlowHighlightView, FlowText, FlowRow } from "./overrides";
import { COLORS } from "../variables/styles";

export const ActivityTimer = () => {
  return (
    <FlowHighlightView style={styles.timerContainer}>
      <FlowRow style={styles.row}>
        <FlowText>No Activity</FlowText>
      </FlowRow>
      <FlowRow style={styles.row}>
        <FlowText style={styles.time}>00:00:00</FlowText>
      </FlowRow>
    </FlowHighlightView>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    marginVertical: 10,
  },
  row: {
    justifyContent: "center",
    marginBottom: 5,
  },
  time: {
    color: COLORS.brightGreen,
  },
});
