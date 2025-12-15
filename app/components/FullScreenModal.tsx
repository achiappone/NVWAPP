// app/components/FullScreenModal.tsx
import { modalTheme } from "@/theme/modalTheme";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalAnimationType } from "../../Types";

console.log("FullScreenModal render");


interface ModalAction {
  label: string;
  onRequestAction: () => void;
}

interface CustomModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  action?: ModalAction;
  disableTouchableWrapper?: boolean;
  children?: React.ReactNode;
  animationType: ModalAnimationType;
  onShow?: () => void;
}

const FullScreenModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  onRequestClose,
  action,
  disableTouchableWrapper = false,
  children,
  animationType,
  onShow = () => {},
}) => {
  const { top } = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [contentHeight, setContentHeight] = useState(screenHeight - top);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS === "android" && disableTouchableWrapper) {
      const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
        const newHeight = screenHeight - e.endCoordinates.height - top;

        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setContentHeight(newHeight);
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }).start();
          }
        });
      });

      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        setContentHeight(screenHeight - top);
        opacityAnim.setValue(1);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }
  }, [screenHeight, top, opacityAnim, disableTouchableWrapper]);

  if (!visible) {
    return null;
  }

  const ModalBody = (
    <View style={[styles.modalContainer, { height: contentHeight }]}>
      <Animated.View
        style={[
          styles.modalContent,
          { height: contentHeight, opacity: opacityAnim },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => {
              console.log("Close pressed");
              onRequestClose();
            }}
          >
            <Text style={styles.cancelText}>Close</Text>
          </TouchableOpacity>


          <Text style={styles.title}>{title}</Text>

          {action && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={action.onRequestAction}
            >
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );

  return (
      <Modal
        animationType={animationType}
        transparent
        statusBarTranslucent
        visible={visible}
        presentationStyle="overFullScreen"
        onRequestClose={onRequestClose}
        onShow={onShow}
      >
        <View style={[styles.modalOverlay, { width: screenWidth }]}>


          {ModalBody}
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
    pointerEvents: "auto",
  },

  container: {
  flex: 1,
  backgroundColor: modalTheme.background,
  paddingHorizontal: 20,

  // ✅ THIS was missing
  alignItems: "center",
  },
  modalContainer: {
    width: "100%",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    pointerEvents: "auto",
    position: "relative",
  },

/* Header */
header: {
  position: "relative",
  zIndex: 1,
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: modalTheme.divider,
  backgroundColor: "#19191a",
},
title: {
  flex: 1,                 // ✅ CRITICAL
  textAlign: "center",     // ✅ CRITICAL
  color: modalTheme.titleColor,
  fontSize: 22,
  fontWeight: "600",
},
  cancelButton: {
    position: "absolute",
    left: 20,
    zIndex: 9999,
    elevation: 9999,
  },
  cancelText: {
    color: "orange",
    fontSize: 16,
  },
  actionButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "orange",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Content */
  content: {
    flex: 1,
  },
});

export default FullScreenModal;
