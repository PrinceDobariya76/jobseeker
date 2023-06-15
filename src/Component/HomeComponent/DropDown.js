import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Fonts} from '../../theme';
import Colors from '../../theme/Colors';
import {horizontalScale, moderateScale} from '../../theme/scalling';

const DropDown = props => {
  return (
    <Dropdown
      style={props.dropdown}
      containerStyle={styles.shadow}
      data={props.data}
      value={props.selectedValue}
      // search
      // searchPlaceholder="Search"
      labelField={props.labelField}
      valueField={props.valueField}
      placeholder={props.placeholder}
      onChange={props.selected}
      inputSearchStyle={{fontSize: moderateScale(10)}}
      dropdownPosition={'auto'}
      selectedTextStyle={{
        color: Colors.black,
        fontFamily: Fonts.satoshi_medium,
        marginLeft: horizontalScale(10),
      }}
      placeholderStyle={{color: Colors.gray[900]}}
    />
  );
};

export default DropDown;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
