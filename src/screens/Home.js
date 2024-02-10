import { FlatList, StyleSheet, View, Platform, AppState } from "react-native";
import { ActivityItem } from "../components/activity/Item";
import { ItemCreate } from "../components/activity/ItemCreate";
import { ItemDetail } from "../components/activity/ItemDetail";
import { ActivityTimer } from "../components/Timer";
import defaultItems from "../data/activities.json";
import {
  FlowText,
  FlowRow,
  FlowModal,
  FlowButton,
} from "../components/overrides";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadDayFlowItems, storeDayFlowItems } from "../storage";
import { getCurrentDate, usePrevious } from "../utils/functions";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../variables/styles";

export const ActivityHomeScreen = ({ isStorageEnbaled, openTutorial }) => {
  // loading data
  const [activities, setActivities] = useState([]);
  const [time, setTime] = useState(0);
  const [showItemCreate, setShowItemCreate] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [focusedItem, setFocusedItem] = useState(null);

  const startTimeRef = useRef(0);
  const timeRef = useRef(0);
  const timerRequestRef = useRef(-1);

  const activeItem = useMemo(() => {
    return activities?.find((a) => a?.isActive);
  }, [activities]);

  const prevActiveItem = usePrevious(activeItem);

  // load activities
  useEffect(() => {
    const load = async () => {
      const items = await loadDayFlowItems();
      // const cleaned = items.filter((i) => i?.id); // fix for bad data

      items ? setActivities(items) : setActivities(defaultItems);
    };
    load();
  }, []);

  // handle saving data before refresh or background/inactive
  useEffect(() => {
    const save = () => {
      setActivities((activities) => {
        updateTimeOnActiveItem(activities);
        saveToStorage(activities);
        return activities;
      });
    };
    if (Platform.OS === "web") {
      // web browser
      window.addEventListener("beforeunload", save);
      return () => {
        window.removeEventListener("beforeunload", save);
      };
    } else {
      // mobile device
      const handleAppStateChange = (appState) => {
        if (appState === "background" || appState === "inactive") {
          save();
        }
      };
      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );
      return () => {
        subscription.remove();
      };
    }
  });

  useEffect(() => {
    const isSameItem = activeItem && activeItem.id === prevActiveItem?.id;
    if (activeItem) {
      if (!isSameItem) {
        timeRef.current = activeItem.time;
        startTimeRef.current = new Date();
      }
      startTimeRef.current = new Date();
      tick();
    } else {
      timeRef.current = 0;
      setTime(0);
      cancelAnimationFrame(timerRequestRef.current);
    }
    return () => {
      cancelAnimationFrame(timerRequestRef.current);
    };
  }, [activeItem]);

  const tick = () => {
    const currentTime = Date.now();
    const timeDelta = currentTime - startTimeRef.current;
    if (timeDelta >= 100) {
      timeRef.current += timeDelta;
      setTime(timeRef.current);
      startTimeRef.current = Date.now();
    }
    timerRequestRef.current = requestAnimationFrame(tick);
  };

  const saveToStorage = (data) => {
    if (isStorageEnbaled) {
      storeDayFlowItems(data);
    }
  };

  const updateTimeOnActiveItem = (activities) => {
    const activeIdx = activities.findIndex((a) => a.isActive);
    if (activeIdx > -1) {
      activities[activeIdx].time = timeRef.current;
    }
  };

  const checkActivity = ({ id, state }) => {
    //change state for id

    setActivities((activities) => {
      const candidateIdx = activities.findIndex((a) => a.id === id);
      if (candidateIdx > -1 && activities[candidateIdx].isActive !== state) {
        updateTimeOnActiveItem(activities);
        const newActivities = activities.map((a) =>
          a.id === id ? { ...a, isActive: state } : { ...a, isActive: false }
        );

        saveToStorage(newActivities);
        return newActivities;
      }
      return activities;
    });
  };

  const addItem = (newItem) => {
    setActivities((activities) => {
      const newActivities = [...activities, newItem];
      saveToStorage(newActivities);
      return newActivities;
    });
  };

  const deleteItem = (item) => {
    if (activeItem && activeItem?.id === item.id) {
      cancelAnimationFrame(timerRequestRef.current);
      timeRef.current = 0;
      setTime(0);
    }
    setActivities((activities) => {
      const newActivities = activities.filter((a) => a.id !== item.id);
      saveToStorage(newActivities);
      return newActivities;
    });
  };

  const updateItem = (itemData) => {
    setActivities((activities) => {
      const newActivities = activities.map((a) => {
        if (a.id === itemData.id) {
          return { ...a, ...itemData };
        }
        return a;
      });

      updateTimeOnActiveItem(newActivities);
      saveToStorage(newActivities);
      return newActivities;
    });
  };

  // return view to render
  return (
    <View style={styles.screenContainer}>
      <FlowRow style={{ justifyContent: "space-between" }}>
        <FlowText style={{ color: COLORS.lightGray }}>
          {getCurrentDate()}
        </FlowText>
        <FlowButton content={"See Tutorial"} ghost onPressIn={openTutorial} />
      </FlowRow>
      <ItemDetail
        focusedItem={focusedItem}
        activeTime={time}
        onItemEdit={updateItem}
        onItemDelete={deleteItem}
      />
      <ItemCreate
        visible={showItemCreate}
        onClose={() => setShowItemCreate(false)}
        onConfirm={addItem}
      />
      <ActivityTimer time={time} title={activeItem?.title} />
      <FlowRow style={styles.listHeading}>
        <FlowText style={styles.text}>Activities</FlowText>
        <FlowButton
          ghost
          size={SIZES.fontExtraLarge}
          type="primary"
          onPressIn={() => setShowItemCreate(true)}
          content={(props) => (
            <MaterialIcons name="playlist-add" size={24} {...props} />
          )}
        />
      </FlowRow>
      <FlatList
        data={activities}
        scrollEnabled={scrollEnabled}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <ActivityItem
            {...item}
            onActivityChange={checkActivity}
            onSwipeStart={() => setScrollEnabled(false)}
            onSwipeEnd={() => setScrollEnabled(true)}
            onDoubleClick={() => setFocusedItem({ ...item })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
  },
  listHeading: {
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
