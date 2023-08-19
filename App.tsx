import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {navigationRef} from './src/helper/constant';
import StackNavigation from './src/route/StackNavigation';
import Colors from './src/theme/Colors';

const App = () => {
  // const myFunction = () => {
  //   console.log('generateNewToken');
  //   generateNewToken();
  // };
  // const interval = setInterval(myFunction, 20 * 60 * 1000);

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
