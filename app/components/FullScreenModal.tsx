//app/components/FullScreenModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalAnimationType } from '../../Types';

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
  const {top} = useSafeAreaInsets();
  console.log('top inset', top);
  const screenHeight = Dimensions.get('window').height;

  // Calculate modal height: 100% of the screen height minus the top inset
  const screenWidth = Dimensions.get('window').width;
  const [contentHeight, setContentHeight] = useState(screenHeight - top);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS === 'android' && disableTouchableWrapper) {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
        const newHeight = screenHeight - e.endCoordinates.height - top;

        // Perform the fade-out/fade-in sequence
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }).start(({ finished }) => {
          // Check if the animation finished successfully.
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

      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        // When keyboard hides, just reset the height.
        setContentHeight(screenHeight - top);
        opacityAnim.setValue(1);
      });

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, [screenHeight, top, opacityAnim]);



  if (!visible) {
    return null;
  }

  /**
   * Note that in sone scenariousm the TouchableWithoutFeedback wrapper will cause the component to be non-scrollable.
   */
  if (disableTouchableWrapper) {
    return (
      <View style={StyleSheet.absoluteFill}>

      <Modal
        animationType={animationType}
        transparent={true}
        statusBarTranslucent={true}
        visible={visible}
        onShow={onShow}
        presentationStyle="overFullScreen"
        style={{ margin: 0, bottom: 0, justifyContent: 'flex-end' }}
        onRequestClose={onRequestClose}>
        <View style={{width: screenWidth, flex: 1}}  collapsable={false}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} onPress={onRequestClose} />
            <View style={[styles.modalContainer,{height: contentHeight}]}>
              <Animated.View style={[styles.modalContent, {height: contentHeight, opacity: opacityAnim}]}>
                <View style={styles.titleContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={onRequestClose}>
                    <Text style={styles.cancelText}>Close</Text>
                  </TouchableOpacity>
                  <Text style={styles.title}>{title}</Text>
                  {action && (
                    <View style={styles.actionButton}>
                      <TouchableOpacity onPress={action.onRequestAction}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#FFF',
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 5,
                            marginBottom: 5,
                          }}>
                          {action.label}
                        </Text>
                        {/*<RecordSVG size={32} color={'darkorange'} />*/}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {children}
              </Animated.View>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    );
  } else {
    return (
      <View style={StyleSheet.absoluteFill}>

      <Modal
        animationType={animationType}
        transparent={true}
        statusBarTranslucent={true}
        visible={visible}
        presentationStyle="overFullScreen"
        style={{ margin: 0, justifyContent: 'flex-end', height: contentHeight }}
        onRequestClose={onRequestClose}>
        <View style={{width: screenWidth, height: contentHeight, marginTop: 50} } collapsable={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.modalOverlay,{height: contentHeight}]}>
              <TouchableOpacity style={styles.modalBackdrop} onPress={onRequestClose} />
              <View style={[styles.modalContainer,{height: contentHeight}]}>
                <Animated.View style={[styles.modalContent, {height: contentHeight, opacity: opacityAnim}]}>
                  <View style={styles.titleContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onRequestClose}>
                      <Text style={styles.cancelText}>Close</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                    {action && (
                      <View style={styles.actionButton}>
                        <TouchableOpacity onPress={action.onRequestAction}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#FFF',
                              marginLeft: 10,
                              marginRight: 10,
                              marginTop: 5,
                              marginBottom: 5,
                            }}>
                            {action.label}
                          </Text>
                          {/*<RecordSVG size={32} color={'darkorange'} />*/}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {children}
                </Animated.View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          </View>
      </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1E1E2E',
    borderRadius: 40,
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: 20,
    marginTop: 5,
    backgroundColor: '#222244',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
  },
  cancelButton: {
    position: 'absolute',
    left: 20,
  },
  actionButton: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: 'darkorange',
  },
  cancelText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default FullScreenModal;