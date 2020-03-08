package com.example.trackshare;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;

import com.umeng.commonsdk.UMConfigure;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class TrackShare {
    public static void init(Context context){
        initRN("react-native","2.0");
        // 初始化
        UMConfigure.init(context,"5e647190895cca4f0a00026e","official",UMConfigure.DEVICE_TYPE_PHONE, null);
        // 启用log
        UMConfigure.setLogEnabled(BuildConfig.DEBUG);
    }
    @TargetApi(Build.VERSION_CODES.KITKAT)
    private static void initRN(String v, String t){
        Method method = null;
        try {
            Class<?> config = Class.forName("com.umeng.commonsdk.UMConfigure");
            method = config.getDeclaredMethod("setWraperType", String.class, String.class);
            method.setAccessible(true);
            method.invoke(null, v,t);
        } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
