/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Fonts} from '../../theme/index';
import Colors from '../../theme/Colors';
import {Icons} from '../../theme/icons';
import {Images} from '../../theme/images';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../theme/scalling';

const MainHeader = ({
  isShowLogo,
  text,
  bellAction,
  openProfile,
  logout = false,
  onLogout,
  profileUrl,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          height: isShowLogo
            ? Platform.OS === 'ios'
              ? moderateScale(60)
              : moderateScale(60)
            : Platform.OS === 'ios'
            ? moderateScale(60)
            : moderateScale(60),
          // paddingTop: Platform.OS === 'ios' ? moderateScale(30) : 0,
        },
      ]}>
      <View style={styles.logo_container}>
        {isShowLogo ? (
          <Image source={Images.whiteLogo} style={styles.logo_icon} />
        ) : (
          <Text style={styles.text}>{text}</Text>
        )}
      </View>
      <View style={styles.secondary_container}>
        <TouchableOpacity onPress={bellAction}>
          <Image
            source={Icons.bell}
            style={{width: moderateScale(19.19), height: moderateScale(21.65)}}
          />
        </TouchableOpacity>
        {logout ? (
          <TouchableOpacity onPress={onLogout}>
            <Image
              source={Icons.logout}
              style={{
                width: moderateScale(30),
                height: moderateScale(30),
                tintColor: 'white',
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openProfile}>
            <Image
              source={profileUrl ? {uri: profileUrl} : Icons.userDefault}
              style={[
                {
                  width: moderateScale(42),
                  height: moderateScale(42),
                  borderRadius: moderateScale(21),
                },
                !profileUrl && {tintColor: 'white'},
              ]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default MainHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blue[500],
    paddingHorizontal: horizontalScale(20),
  },
  logo_container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo_icon: {
    height: moderateScale(130),
    width: moderateScale(130),
    top: verticalScale(18),
  },
  secondary_container: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: Fonts.satoshi_bold,
    fontSize: moderateScale(20),
    color: Colors.white,
  },
});
