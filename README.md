## githubReactNative

学习 react-native 构建基于 github API 的安卓 APP

#### 调试

###### 调出开发者菜单

- 安卓模拟器：按住`Ctrl`再按两次`M`
- IOS 模拟器：`Command`+`D`.
- 真机：摇一摇

###### 重启 app

可以再开发者菜单中点击`Reload`，也可以选择 debug 模式，这时会在在 chrome 浏览器打开：`http://localhost:8081/debugger-ui/`，页面中点击`Reload app`按钮

###### 查看日志

1. 在命令行输入：

```
adb logcat *:S ReactNative:V ReactNativeJS:V
```

2. debug 模式下，在浏览器控制台查看
