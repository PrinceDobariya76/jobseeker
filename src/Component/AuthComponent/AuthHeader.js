import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Fonts} from '../../theme/index';
import Colors from '../../theme/Colors';
import {Images} from '../../theme/images';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../theme/scalling';

const AuthHeader = ({profileTextEnable, smallText, bigText}) => {
  return (
    <View style={styles.row_container}>
      <View
        style={[
          styles.logo_container,
          {
            paddingTop: profileTextEnable
              ? verticalScale(40)
              : verticalScale(60),
          },
        ]}>
        <Image
          source={Images.splashLogo}
          style={{width: moderateScale(151), height: moderateScale(26)}}
        />
        {profileTextEnable ? (
          <>
            <Text style={styles.tell_us_text}>{smallText}</Text>
            <Text style={styles.profile_text}>{bigText}</Text>
          </>
        ) : null}
      </View>
      <Image
        source={Images.upperDesign}
        style={{marginTop: moderateScale(-25)}}
      />
    </View>
  );
};
export default AuthHeader;

const styles = StyleSheet.create({
  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo_container: {
    flex: 1,
    paddingLeft: horizontalScale(20),
  },
  tell_us_text: {
    fontFamily: Fonts.satoshi_regular,
    color: Colors.gray[700],
    marginTop: verticalScale(40),
  },
  profile_text: {
    fontFamily: Fonts.satoshi_bold,
    color: Colors.gray[900],
    fontSize: moderateScale(24),
  },
});
