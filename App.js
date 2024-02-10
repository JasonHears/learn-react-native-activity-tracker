import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";
import { ActivityHomeScreen } from "./src/screens/Home";
import { COLORS, SIZES } from "./src/variables/styles";
import { useEffect, useState } from "react";
import {
  clearStorage,
  isAsyncStorageEnabled,
  loadIsTutorialWatched,
} from "./src/storage";
import { TutorialScreen } from "./src/screens/Tutorial";

export default function App() {
  const [isStorageEnbaled, setIsStorageEnabled] = useState(null);
  const [isTutorialWatched, setIsTutorialWatched] = useState(null);

  // DEBUG
  // clearStorage();

  useEffect(() => {
    const checkStorage = async () => {
      const isEnabled = await isAsyncStorageEnabled();
      setIsStorageEnabled(isEnabled);
    };

    const checkTutorial = async () => {
      const data = await loadIsTutorialWatched();
      setIsTutorialWatched(!!data);
    };

    checkStorage();
    checkTutorial();
  }, []);

  const saveTutorial = async (state) => {
    setIsTutorialWatched(state);
  };

  const containerStyle =
    Platform.OS === "web"
      ? {
          maxWidth: 500,
          margin: "auto",
        }
      : {};

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={{ ...styles.container, ...containerStyle }}>
        {isStorageEnbaled == null || isTutorialWatched == null ? (
          <></>
        ) : (
          <>
            {!isTutorialWatched && (
              <TutorialScreen
                visible={true}
                onSkip={() => saveTutorial(true)}
              />
            )}
            <ActivityHomeScreen
              isStorageEnbaled={isStorageEnbaled}
              openTutorial={() => saveTutorial(false)}
            />
          </>
        )}
        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
