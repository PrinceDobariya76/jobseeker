import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Fonts} from '../../theme';
import Colors from '../../theme/Colors';
import {moderateScale} from '../../theme/scalling';

const ProfileBottomView = () => {
  return (
    <View>
      <Text style={styles.how_for_can_you_travel}>How far can you travel?</Text>
      <Text style={styles.paragraph_text}>
        As a temping professional it’s important for you to be able to travel to
        the clinics. Please select your prefered range of operations from your
        Pincode.
      </Text>
    </View>
  );
};

export default ProfileBottomView;

const styles = StyleSheet.create({
  how_for_can_you_travel: {
    color: Colors.black,
    fontSize: moderateScale(22),
    fontFamily: Fonts.satoshi_medium,
    marginTop: moderateScale(17),
  },
  paragraph_text: {
    color: Colors.gray[500],
    fontFamily: Fonts.satoshi_regular,
    fontSize: moderateScale(14),
    marginTop: moderateScale(5),
  },
});
