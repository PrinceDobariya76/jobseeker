/* eslint-disable react-native/no-inline-styles */
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';
import {apiConst, GET} from '../helper/apiConstants';
import makeAPIRequest from '../helper/global';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {Icons} from '../theme/icons';
import {horizontalScale, moderateScale, verticalScale} from '../theme/scalling';

const Notification = ({navigation}) => {
  const [mainLoading, setMainLoading] = useState(false);
  const [notificationData, setNotificationData] = useState([]);

  const getNotification = async () => {
    setMainLoading(true);
    return makeAPIRequest({
      method: GET,
      url: apiConst.getNotifications,
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        console.log('response', response.data.data.results);
        setNotificationData(response.data.data.results);
      })
      .catch(error => {
        setMainLoading(false);
        console.log('error', error.response);
      });
  };

  const getIcon = type => {
    switch (type) {
      case 'success':
      case 'new':
        return Icons.Notification5;
      case 'error':
      case 'cancelled':
        return Icons.Notification1;
      case 'closed':
        return Icons.Notification3;
      case 'posted':
        return Icons.Notification4;
      case 'completed':
        return Icons.Notification2;
      default:
        return Icons.Notification5;
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getNotification();
    }
  }, [isFocused]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.render_container}>
        <View style={{paddingTop: verticalScale(5)}}>
          <Image
            source={getIcon(item?.type)}
            resizeMode="contain"
            style={{
              height: moderateScale(21),
              width: moderateScale(21),
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            paddingLeft: horizontalScale(10),
          }}>
          <Text style={styles.render_title}>{item.title}</Text>
          <Text style={styles.render_description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={25} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.header_title_container}>
          <Text style={styles.title_text}>Notifications</Text>
        </View>
      </View>
      {/* -----> Main Component <----- */}
      <View style={{flex: 1}}>
        <AcitvityLoader visible={mainLoading} />
        <FlatList
          data={notificationData}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[200],
  },
  headerContainer: {
    backgroundColor: Colors.blue[500],
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  header_title_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title_text: {
    fontFamily: Fonts.satoshi_bold,
    color: Colors.white,
    fontSize: 16,
  },
  render_container: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(20),
    marginBottom: verticalScale(15),
  },
  contentContainerStyle: {
    paddingHorizontal: horizontalScale(15),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(15),
  },
  render_title: {
    fontFamily: Fonts.satoshi_bold,
    fontSize: 16,
    color: Colors.gray[900],
  },
  render_description: {
    fontFamily: Fonts.satoshi_regular,
    fontSize: 14,
    color: Colors.gray[900],
    marginVertical: verticalScale(5),
  },
  inMiddle: {justifyContent: 'center', zIndex: 1},
});
