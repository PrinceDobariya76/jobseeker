import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Fonts} from '../../theme';
import {moderateScale} from '../../theme/scalling';
import RangeSelect from './RangeComponent';

const ProfilePincodeRadius = ({selectRange, setSelectRange}) => {
  return (
    <>
      <View style={styles.flexDirection_row}>
        <Text style={[styles.field_title, {marginTop: moderateScale(17)}]}>
          Radius from Pincode
        </Text>
        <Text style={[styles.field_title, {marginTop: moderateScale(17)}]}>
          {selectRange} km Radius
        </Text>
      </View>
      <RangeSelect selectRange={setSelectRange} range={selectRange} />
    </>
  );
};

export default ProfilePincodeRadius;

const styles = StyleSheet.create({
  flexDirection_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  field_title: {
    color: Colors.black,
    fontSize: moderateScale(15),
    fontFamily: Fonts.satoshi_medium,
  },
});
