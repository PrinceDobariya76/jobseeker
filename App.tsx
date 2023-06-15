/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/route/StackNavigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Platform, StatusBar} from 'react-native';
import Colors from './src/theme/Colors';
import FlashMessage from 'react-native-flash-message';
import {AppState} from 'react-native';
import {generateNewToken, navigationRef} from './src/helper/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const myFunction = () => {
    console.log('generateNewToken');
    generateNewToken();
  };
  const interval = setInterval(myFunction, 20 * 60 * 1000);

  useEffect(() => {
    registerAppWithFCM();
    generateToken();
  }, []);

  const registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
  };

  const generateToken = async () => {
    const token = await messaging().getToken();

    console.log('token--*****-', token);
    if (token == null || token == undefined) {
      const token1 = await messaging().getToken();
      await AsyncStorage.setItem('deviceToken', token1);
    } else {
      await AsyncStorage.setItem('deviceToken', token);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={Colors.blue[500]}
      />
      <FlashMessage position="top" duration={2000} />
      <NavigationContainer ref={navigationRef}>
        <StackNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
};
export default App;
