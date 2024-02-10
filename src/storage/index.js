import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log("Data stored successfully!");
  } catch (error) {
    console.error("Error storing data:", error);
    return false;
  }
};

const getData = async (key) => {
  try {
    const storedData = await AsyncStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
};

const storeDayFlowItems = async (data) => {
  // store
  return storeData("dayFlowItems", data);
};

const loadDayFlowItems = async () => {
  // load
  return getData("dayFlowItems");
};

const storeIsTutorialWatched = async () => {
  // store
  return storeData("tutorialState", 1);
};

const loadIsTutorialWatched = async () => {
  // load
  const data = await getData("tutorialState");
  return data;
};

const isAsyncStorageEnabled = async () => {
  try {
    await AsyncStorage.setItem("testKey", "testValue");
    await AsyncStorage.removeItem("testKey");
    console.log("AsyncStorage is available.");
    return true;
  } catch (error) {
    console.error("AsyncStorage is not available:", error);
    return false;
  }
};

const clearStorage = () => {
  AsyncStorage.clear();
};

export {
  storeDayFlowItems,
  loadDayFlowItems,
  isAsyncStorageEnabled,
  storeIsTutorialWatched,
  loadIsTutorialWatched,
  clearStorage,
};
