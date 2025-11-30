import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';

// Import your SVG icons
import {
    BackIcon,
    EditIcon,
    ExportIcon,
    HomeIcon,
    NextIcon
} from '../../assets/icons/svgIcons';

interface Props {
  onPressBack?: () => void;
  onPressNext?: () => void;
  onPressHome?: () => void;
  onPressExport?: () => void;
  onPressEdit?: () => void;
  progress?: number;     // 0–1
}

const BottomNavWithProgress: React.FC<Props> = ({
  onPressBack,
  onPressNext,
  onPressHome,
  onPressExport,
  onPressEdit,
  progress
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Navigation Row */}
      <View style={styles.navContainer}>
        {onPressBack && (
          <TouchableOpacity onPress={onPressBack} style={styles.navButton}>
            <BackIcon />
            <Text style={styles.label}>Back</Text>
          </TouchableOpacity>
        )}

        {onPressHome && (
          <TouchableOpacity
            onPress={() => router.push('/home')}
            style={styles.navButton}
          >
            <HomeIcon />
            <Text style={styles.label}>Home</Text>
          </TouchableOpacity>
        )}

        {onPressNext && (
          <TouchableOpacity onPress={onPressNext} style={styles.navButton}>
            <NextIcon />
            <Text style={styles.label}>Next</Text>
          </TouchableOpacity>
        )}

        {onPressExport && (
          <TouchableOpacity onPress={onPressExport} style={styles.navButton}>
            <ExportIcon />
            <Text style={styles.label}>Export</Text>
          </TouchableOpacity>
        )}

        {onPressEdit && (
          <TouchableOpacity onPress={onPressEdit} style={styles.navButton}>
            <EditIcon />
            <Text style={styles.label}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar */}
      {typeof progress === 'number' && (
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}
            width={320}
            height={6}
            borderWidth={0}
            color="#FFFFFF"
            unfilledColor="#333"
            borderRadius={5}
          />
        </View>
      )}
    </View>
  );
};

export default BottomNavWithProgress;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#101010',
    paddingBottom: 30,
    paddingTop: 10,
    borderTopColor: '#222',
    borderTopWidth: 1,
  },

  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 8,
  },

  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },

  label: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },

  progressContainer: {
    marginTop: 8,
    alignItems: 'center',
  }
});
