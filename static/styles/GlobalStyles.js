import {Dimensions} from 'react-native';

/**
 * 全局通用样式
 */
const BACKGROUND_COLOR = '#f3f3f4';
const {width, height} = Dimensions.get('window');
export default {
  window_height: height,
  line: {
    height: 0.5,
    opacity: 0.5,
    backgroundColor: 'darkgray',
  },
  root_container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  backgroundColor: BACKGROUND_COLOR,
};
