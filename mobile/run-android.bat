@echo off
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.20.8-hotspot"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%"

echo ===================================================
echo   Starting NutriLens Mobile Application...
echo   JAVA_HOME: %JAVA_HOME%
echo   ANDROID_HOME: %ANDROID_HOME%
echo ===================================================

echo Stopping any running Gradle daemons...
call android\gradlew.bat --stop >nul 2>&1

echo Cleaning stale build cache...
if exist "android\app\build" rmdir /s /q "android\app\build"

echo Building and installing...
"%ANDROID_HOME%\platform-tools\adb.exe" reverse tcp:8081 tcp:8081 >nul 2>&1
npx react-native run-android
