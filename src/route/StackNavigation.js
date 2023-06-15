/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Auth Screen
import Splashscreen1 from '../authScreen/Splashscreen1';
import Login from '../authScreen/Login';
import ForgetPassword from '../authScreen/ForgetPassword';

// Home Stack
import DentalStaffTab from './DentalStaffTab';

import Notification from '../homeScreen/Notification';
import Profile from '../homeScreen/Profile';
import EditProfile from '../homeScreen/EditProfile';
import JobDetails from '../homeScreen/jobDetails';
import Splash from '../SplashScreen/Splash';
import MyProfile from '../homeScreen/MyProfile';
import ChangePassword from '../authScreen/changePassword';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={Splash}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Splashscreen1" component={Splashscreen1} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="DentalStaffTab" component={DentalStaffTab} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="JobDetails" component={JobDetails} />
    </Stack.Navigator>
  );
};
export default StackNavigation;
