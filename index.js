/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
console.disableYellowBox = true; //屏蔽黄色警告
AppRegistry.registerComponent(appName, () => App);
