import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Slider from '@react-native-community/slider';
import Colors from '../../theme/Colors';
import {Images} from '../../theme/images';
import {Dimensions} from 'react-native/Libraries/Utilities/Dimensions';
import {horizontalScale, moderateScale} from '../../theme/scalling';

// import { Range, getTrackBackground } from "react-range";

const RangeSelect = props => {
  return (
    <Slider
      style={{width: '100%', height: 60}}
      value={props.range}
      minimumValue={0}
      maximumValue={100}
      step={1}
      thumbTintColor={Colors.yellow[400]}
      // onValueChange={(value)=> console.log(value)}
      onSlidingComplete={props.selectRange}
      minimumTrackTintColor={Colors.yellow[400]}
      maximumTrackTintColor={Colors.yellow[200]}
    />
  );
};
export default RangeSelect;
