import { StyleSheet, TextInput, View } from "react-native";
import {
  FlowButton,
  FlowHighlightView,
  FlowModal,
  FlowText,
} from "../overrides";
import { useEffect, useState } from "react";
import { COLORS, SIZES } from "../../variables/styles";
import { formatTime } from "../../utils/functions";
import { EvilIcons } from "@expo/vector-icons";
import { ConfirmationModal } from "../common/ConfirmationModal";

export const ItemDetail = ({
  focusedItem,
  activeTime,
  onItemEdit,
  onItemDelete,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (focusedItem) {
      setShowModal(true);
      setTitle(focusedItem.title);
      setDescription(focusedItem.description);
      setTime(focusedItem.time);
      setIsEditing(false);
    }
  }, [focusedItem]);

  const saveItem = () => {
    onItemEdit({ ...focusedItem, title, description });
    setIsEditing(false);
  };

  const deleteItem = () => {
    setShowModal(false);
    setShowPrompt(false);
    onItemDelete({ ...focusedItem });
  };

  return (
    <FlowModal
      fullScreen
      visible={showModal}
      animationType={"fade"}
      bgColor={COLORS.black}
    >
      <FlowButton
        ghost
        content={"Back"}
        style={styles.backButton}
        onPressIn={() => setShowModal(false)}
      />

      <FlowHighlightView>
        <View>
          <FlowText style={styles.timer}>
            {focusedItem?.isActive ? formatTime(activeTime) : formatTime(time)}
          </FlowText>
        </View>
        <View>
          {isEditing ? (
            <TextInput
              style={{ ...styles.title, ...styles.input }}
              value={title}
              placeholder="Activity Name"
              placeholderTextColor={COLORS.semiDarkGray}
              onChangeText={(text) => {
                setTitle(text);
              }}
            />
          ) : (
            <FlowText style={styles.title}>{title}</FlowText>
          )}
        </View>
        <View>
          {isEditing ? (
            <TextInput
              style={{
                ...styles.title,
                ...styles.multiLineInput,
                ...styles.input,
              }}
              value={description}
              placeholder="Activity Description"
              placeholderTextColor={COLORS.semiDarkGray}
              onChangeText={(text) => {
                setDescription(text);
              }}
            />
          ) : (
            <FlowText style={styles.description}>{description}</FlowText>
          )}
        </View>
        <View style={{ marginBottom: 20 }} />
      </FlowHighlightView>
      <View>
        {isEditing ? (
          <FlowButton
            onPressIn={saveItem}
            type={"primary"}
            content={"Confirm"}
            style={styles.editButton}
          />
        ) : (
          <FlowButton
            content={"Edit"}
            style={styles.editButton}
            onPressIn={() => setIsEditing(true)}
          />
        )}
      </View>
      <View>
        <ConfirmationModal
          visible={showPrompt}
          message={"Delete this activity item?"}
          onCancel={() => setShowPrompt(false)}
          onConfirm={deleteItem}
        />
        {isEditing ? (
          <FlowButton
            type={"danger"}
            content={"Cancel"}
            style={styles.editButton}
            onPressIn={() => setIsEditing(false)}
          />
        ) : (
          <FlowButton
            type={"danger"}
            content={"Delete"}
            style={styles.deleteButton}
            onPressIn={() => setShowPrompt(true)}
          />
        )}
      </View>
    </FlowModal>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 20,
  },
  timer: {
    color: COLORS.brightGreen,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: SIZES.fontSmall,
  },
  editButton: {
    marginVertical: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  deleteButton: {
    marginVertical: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  input: {
    color: COLORS.white,
    padding: 10,
    fontWeight: "500",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 5,
  },
  multiLineInput: {
    textAlignVertical: "top",
    height: 100,
  },
});
