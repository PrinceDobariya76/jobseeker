/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RoutingConst} from './RoutingConst';
import Jobs from '../homeScreen/Jobs';
import Shifts from '../homeScreen/Shifts';
import Favorites from '../homeScreen/Favorites';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Icons} from '../theme/icons';
import {Fonts} from '../theme/index';
import {horizontalScale, moderateScale} from '../theme/scalling';
import Colors from '../theme/Colors';

const Tab = createBottomTabNavigator();

const DentalStaffTab = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen
        name={RoutingConst.Jobs}
        component={Jobs}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View
                style={[
                  styles.container,
                  {borderTopWidth: focused ? moderateScale(3) : 0},
                ]}>
                <Image
                  source={focused ? Icons.active_job : Icons.inactive_job}
                  style={{
                    width: moderateScale(15.57),
                    height: moderateScale(15.52),
                  }}
                />
                <Text
                  style={[
                    styles.label_text,
                    {color: focused ? Colors.blue[500] : Colors.gray[500]},
                  ]}>
                  Jobs
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name={RoutingConst.Shifts}
        component={Shifts}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View
                style={[
                  styles.container,
                  {borderTopWidth: focused ? moderateScale(3) : 0},
                ]}>
                <Image
                  source={focused ? Icons.active_shift : Icons.inactive_shift}
                  style={{
                    width: moderateScale(28.17),
                    height: moderateScale(12),
                  }}
                />
                <Text
                  style={[
                    styles.label_text,
                    {color: focused ? Colors.blue[500] : Colors.gray[500]},
                  ]}>
                  Shifts
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name={RoutingConst.Favorites}
        component={Favorites}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View
                style={[
                  styles.container,
                  {borderTopWidth: focused ? moderateScale(3) : 0},
                ]}>
                <Image
                  source={
                    focused ? Icons.active_favorite : Icons.inactive_favorite
                  }
                  style={{
                    width: moderateScale(15.7),
                    height: moderateScale(14),
                  }}
                />
                <Text
                  style={[
                    styles.label_text,
                    {color: focused ? Colors.blue[500] : Colors.gray[500]},
                  ]}>
                  Favorites
                </Text>
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
export default DentalStaffTab;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopColor: Colors.yellow[400],
  },
  label_text: {
    fontFamily: Fonts.satoshi_medium,
    fontSize: moderateScale(16),
    marginLeft: horizontalScale(8),
  },
});
