import { Animated, StyleSheet, View } from "react-native";
import {
  FlowButton,
  FlowModal,
  FlowRow,
  FlowText,
} from "../components/overrides";
import { useRef, useState, useEffect } from "react";
import { ActivityItem } from "../components/activity/Item";
import { COLORS, SIZES } from "../variables/styles";
import { AntDesign } from "@expo/vector-icons";
import { storeIsTutorialWatched } from "../storage";

const MAX_STEPS = 3;
const empty = () => {};

const PreviewItem = ({ isActive }) => (
  <ActivityItem
    title={"Activity Item"}
    time={0}
    controls={false}
    isActive={isActive}
    onActivityChange={empty}
    onSwipeStart={empty}
    onSwipeEnd={empty}
    onDoubleClick={empty}
  />
);

export const TutorialScreen = ({ visible, onSkip }) => {
  const [step, setStep] = useState(1);
  const [isActive, setIsActive] = useState(false);

  const directionRef = useRef(150);
  const pan = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);

  const isNextEnabled = step < MAX_STEPS;
  const isBackEnbaled = step > 1;

  useEffect(() => {
    if (step === 1 && isActive) {
      timeoutRef.current = setTimeout(() => {
        setIsActive(false);
      }, 900);
    }

    if (step === 2 && !isActive) {
      timeoutRef.current = setTimeout(() => {
        setIsActive(true);
      }, 900);
    }
  }, [isActive]);

  useEffect(() => {
    if (step === 1) {
      setIsActive(false);
      directionRef.current = 150;
      animateSwipe();
    }

    if (step === 2) {
      setIsActive(true);
      directionRef.current = -150;
      animateSwipe();
    }

    if (step === 3) {
      setIsActive(false);
      animateDoubleTap();
    }

    return () => {
      animationRef.current?.reset();
      clearTimeout(timeoutRef.current);
    };
  }, [step]);

  const animateDoubleTap = () => {
    const sequence = Animated.sequence([
      Animated.delay(2000),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]);

    const loop = (animationRef.current = Animated.loop(sequence));
    loop.start();
  };

  const animateSwipe = () => {
    const swiping = Animated.timing(pan, {
      toValue: directionRef.current,
      delay: 1200,
      duration: 2000,
      useNativeDriver: false,
    });

    const defaultPos = Animated.timing(pan, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    });

    pan.addListener(({ value }) => {
      if (value === directionRef.current) {
        if (step === 1) setIsActive(true);
        if (step === 2) setIsActive(false);
      }
    });

    const sequence = Animated.sequence([defaultPos, swiping]);

    const loop = (animationRef.current = Animated.loop(sequence));
    loop.start();
  };

  const goNext = () => {
    if (isNextEnabled) setStep(step + 1);
  };

  const goBack = () => {
    if (isBackEnbaled) setStep(step - 1);
  };

  const skip = () => {
    onSkip();
    storeIsTutorialWatched();
  };

  const animatedStyle = {
    transform: [{ translateX: pan }, { scale }],
  };

  return (
    <FlowModal visible={visible} bgColor={COLORS.lightBlack}>
      <View style={{ marginBottom: 10 }}>
        <FlowRow style={{ marginBottom: 15, justifyContent: "space-between" }}>
          <FlowText style={{ fontWeight: "bold" }}>Step {step} / 3</FlowText>
          <FlowButton
            ghost
            onPressIn={skip}
            size={SIZES.fontLarge}
            content={(props) => <AntDesign name="close" {...props} />}
          />
        </FlowRow>
        {step === 1 && (
          <View>
            <View style={styles.view}>
              <FlowText>To start tracking an activity, swipe right.</FlowText>
            </View>
            <Animated.View style={animatedStyle}>
              <PreviewItem isActive={isActive} />
            </Animated.View>
          </View>
        )}
        {step === 2 && (
          <View>
            <View style={styles.view}>
              <FlowText>To stop tracking an activity, swipe left.</FlowText>
            </View>
            <Animated.View style={animatedStyle}>
              <PreviewItem isActive={isActive} />
            </Animated.View>
          </View>
        )}
        {step === 3 && (
          <View>
            <View style={styles.view}>
              <FlowText>To see activity detail, double tap.</FlowText>
            </View>
            <Animated.View style={animatedStyle}>
              <PreviewItem />
            </Animated.View>
          </View>
        )}
      </View>
      <View>
        <FlowRow style={{ justifyContent: "space-between" }}>
          <FlowButton
            onPressIn={goBack}
            type={"primary"}
            ghost
            content={"Back"}
            style={{ marginRight: 10 }}
            disabled={!isBackEnbaled}
          />
          <FlowButton
            onPressIn={goNext}
            type={"primary"}
            ghost
            content={"Next"}
            disabled={!isNextEnabled}
          />
        </FlowRow>
      </View>
    </FlowModal>
  );
};
const styles = StyleSheet.create({
  view: {
    marginBottom: 10,
  },
});
