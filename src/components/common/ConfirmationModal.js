import { StyleSheet } from "react-native";
import { FlowButton, FlowModal, FlowRow, FlowText } from "../overrides";
import { SIZES } from "../../variables/styles";

export const ConfirmationModal = ({
  visible,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <FlowModal visible={visible} animationType={"fade"}>
      <FlowText style={{ marginBottom: 20, fontSize: SIZES.fontMedium }}>
        {message}
      </FlowText>
      <FlowRow style={{ justifyContent: "space-around" }}>
        <FlowButton
          ghost
          type={"danger"}
          content={"Yes"}
          onPressIn={onConfirm}
        />
        <FlowButton
          ghost
          type={"primary"}
          content={"No"}
          onPressIn={onCancel}
        />
      </FlowRow>
    </FlowModal>
  );
};

const styles = StyleSheet.create({
  button: {},
});
