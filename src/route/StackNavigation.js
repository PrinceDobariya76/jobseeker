import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

// Auth Screen
import ForgetPassword from '../authScreen/ForgetPassword';
import Login from '../authScreen/Login';
import Splashscreen1 from '../authScreen/Splashscreen1';

// Home Stack
import DentalStaffTab from './DentalStaffTab';

import ChangePassword from '../authScreen/changePassword';
import EditProfile from '../homeScreen/EditProfile';
import JobDetails from '../homeScreen/jobDetails';
import MyProfile from '../homeScreen/MyProfile';
import Notification from '../homeScreen/Notification';
import Profile from '../homeScreen/Profile';
import Splash from '../SplashScreen/Splash';

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
      <Stack.Screen
        name="Login"
        component={Login}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen
        name="DentalStaffTab"
        component={DentalStaffTab}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="JobDetails" component={JobDetails} />
    </Stack.Navigator>
  );
};
export default StackNavigation;
