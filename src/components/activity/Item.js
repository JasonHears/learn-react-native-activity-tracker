import React, { useRef } from "react";
import { StyleSheet, PanResponder, Animated, Platform } from "react-native";
import { FlowHighlightView, FlowRow, FlowText } from "../overrides";
import { COLORS } from "../../variables/styles";
import { LoadingDots } from "../common/LoadingDots";
import { formatTime } from "../../utils/functions";

const THRESHOLD = 60;
const TAP_DELAY = 360;

export const ActivityItem = ({
  id,
  title,
  description,
  isActive = false,
  time,
  controls,
  onActivityChange,
  onSwipeStart,
  onSwipeEnd,
  onDoubleClick,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const lastPressTimeRef = useRef(0);
  const isSwipping = useRef(false);
  const canControl = controls ?? true;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (event, gestureState) => {
        const currentX = gestureState.dx;
        if (currentX > THRESHOLD) {
          // activate
          onActivityChange({ id, state: true });
        }
        if (currentX < -THRESHOLD) {
          //deactivate
          onActivityChange({ id, state: false });
        }
        if (Math.abs(currentX) > THRESHOLD && !isSwipping.current) {
          onSwipeStart();
        }
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(event, gestureState);
      },
      onPanResponderRelease: () => {
        isSwipping.current = false;
        onSwipeEnd();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handlePress = () => {
    const currentTime = new Date().getTime();
    const isDoubleClick = currentTime - lastPressTimeRef.current <= TAP_DELAY;
    if (isDoubleClick) {
      onDoubleClick();
    } else {
      lastPressTimeRef.current = currentTime;
    }
  };

  const itemBackground = isActive
    ? { backgroundColor: COLORS.semiDarkGray }
    : { backgroundColor: COLORS.darkGray };

  const handlers = canControl ? panResponder.panHandlers : null;

  return (
    <Animated.View
      onPointerDown={handlePress} // web
      onTouchStart={() => {
        if (Platform.OS !== "web") {
          handlePress();
        }
      }} // mobile device
      {...handlers}
      style={{
        userSelect: "none",
        touchAction: "none",
        transform: [{ translateX: pan.x }],
      }}
    >
      <FlowHighlightView style={{ ...styles.itemContainer, ...itemBackground }}>
        <FlowRow style={styles.row}>
          <FlowText>{title}</FlowText>
          {isActive ? (
            <LoadingDots />
          ) : (
            <FlowText style={styles.time}>{formatTime(time)}</FlowText>
          )}
        </FlowRow>
      </FlowHighlightView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 6,
    paddingVertical: 19,
    marginLeft: 5,
  },
  row: {
    justifyContent: "space-between",
  },
  time: {
    color: COLORS.brightGreen,
  },
});
