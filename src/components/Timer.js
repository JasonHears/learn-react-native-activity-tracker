import { View, StyleSheet } from "react-native";
import { FlowHighlightView, FlowText, FlowRow } from "./overrides";
import { COLORS } from "../variables/styles";
import { formatTime } from "../utils/functions";

export const ActivityTimer = ({ time, title }) => {
  return (
    <FlowHighlightView style={styles.timerContainer}>
      <FlowRow style={styles.row}>
        <FlowText>{title ? title : "No Activity"}</FlowText>
      </FlowRow>
      <FlowRow style={styles.row}>
        <FlowText style={{ ...styles.time, fontVariant: ["tabular-nums"] }}>
          {formatTime(time)}
        </FlowText>
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
