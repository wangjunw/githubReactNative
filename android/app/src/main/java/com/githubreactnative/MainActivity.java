package com.githubreactnative;

import android.os.Bundle;
import android.os.PersistableBundle;
import androidx.annotation.Nullable;
import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;

import org.devio.rn.splashscreen.SplashScreen;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "githubReactNative";
  }

  @Override
  public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
    //SplashScreen.show(this);  // here显示启动屏
    super.onCreate(savedInstanceState, persistentState);
    // 设置发送间隔
    MobclickAgent.setSessionContinueMillis(30000);
  }

  //如果需要统计 Android 4.0 以下版本设备统计数据，则必须选择手动模式(MANUAL)，
  // 对宿主App中所有Activity都手动调用MobclickAgent.onResume/MobclickAgent.onPause手动埋点。
  // Session启动、App使用时长等基础数据统计接口API
  @Override
  public void onResume() {
    super.onResume();
    MobclickAgent.onResume(this);
  }

  @Override
  public void onPause() {
    super.onPause();
    MobclickAgent.onPause(this);
  }
}
