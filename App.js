import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";
import { ActivityHomeScreen } from "./src/screens/Home";
import { COLORS, SIZES } from "./src/variables/styles";
import { useEffect, useState } from "react";
import { isAsyncStorageEnabled } from "./src/storage";

export default function App() {
  const [isStorageEnbaled, setIsStorageEnabled] = useState(null);

  useEffect(() => {
    const checkStorage = async () => {
      const isEnabled = await isAsyncStorageEnabled();
      setIsStorageEnabled(isEnabled);
    };

    checkStorage();
  }, []);

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
        {isAsyncStorageEnabled == null ? null : (
          <ActivityHomeScreen isStorageEnbaled={isStorageEnbaled} />
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
