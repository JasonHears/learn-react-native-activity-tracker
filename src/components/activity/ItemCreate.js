import { Pressable, StyleSheet, TextInput } from "react-native";
import {
  FlowButton,
  FlowButtons,
  FlowModal,
  FlowRow,
  FlowText,
} from "../overrides";
import { COLORS } from "../../variables/styles";
import { useState } from "react";
import { generateRandomId } from "../../utils/functions";
import { storeDayFlowItems } from "../../storage";

export const ItemCreate = ({ visible, onClose, onConfirm }) => {
  const [newItem, setNewItem] = useState({
    title: "",
    id: "",
    isActive: false,
    time: 0,
  });

  const confirm = () => {
    const _newItem = { ...newItem, id: generateRandomId() };
    onConfirm(_newItem);
    cancel();
  };

  const cancel = () => {
    onClose();
  };

  const isError = newItem.title === String("");

  return (
    <FlowModal visible={visible} animationType={"fade"}>
      <FlowText style={styles.label}>Choose the name of the activity.</FlowText>
      <TextInput
        placeholder="Activity Name"
        placeholderTextColor={COLORS.semiDarkGray}
        style={styles.input}
        onChangeText={(title) => setNewItem({ ...newItem, title })}
      />
      <FlowRow style={{ justifyContent: "space-around" }}>
        <FlowButton
          disabled={isError}
          content={"Confirm"}
          ghost
          type="primary"
          onPress={confirm}
        />
        <FlowButton ghost content={"Cancel"} type="danger" onPress={cancel} />
      </FlowRow>
    </FlowModal>
  );
};

const styles = StyleSheet.create({
  label: {},
  input: {
    color: COLORS.white,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: COLORS.semiDarkGray,
    borderRadius: 5,
    marginVertical: 10,
  },
});
