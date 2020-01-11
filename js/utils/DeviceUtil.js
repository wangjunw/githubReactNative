import {Platform, Dimensions} from 'react-native';

// iPoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

// 当前设备
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const isIPoneX = () => {
  return (
    Platform.OS === 'ios' &&
    ((SCREEN_HEIGHT === X_HEIGHT && SCREEN_WIDTH === X_HEIGHT) ||
      (SCREEN_WIDTH === X_HEIGHT && SCREEN_HEIGHT === X_WIDTH))
  );
};
