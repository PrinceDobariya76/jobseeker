import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Fonts} from '../../theme';
import {Icons} from '../../theme/icons';
import {moderateScale} from '../../theme/scalling';

const YesNoButton = props => {
  return (
    <View style={[styles.container_style, props.styles]}>
      <TouchableOpacity
        style={[
          styles.review_modal_button_style,
          {
            backgroundColor: props.first_button_backgroundColor,
            flex: props.flex1,
            opacity: props.first_button_Opacity,
          },
        ]}
        disabled={props.first_button_disable}
        activeOpacity={0.2}
        opa
        onPress={() => props.first_button_call()}>
        <Text
          style={[
            styles.review_modal_button_text,
            {color: props.first_button_color},
          ]}>
          {props.first_button_text}
        </Text>
      </TouchableOpacity>
      <View style={{flex: 0.1}}></View>
      <TouchableOpacity
        onPress={() => props.second_button_call()}
        disabled={props.second_button_disable}
        style={[
          styles.review_modal_button_style,
          {
            backgroundColor: props.second_button_backgroundColor,
            flex: props.flex2,
          },
        ]}>
        <Text
          style={[
            styles.review_modal_button_text,
            {color: props.second_button_color},
          ]}
          numberOfLines={1}>
          {props.second_button_text}
        </Text>
        {props.second_button_image === true ? (
          <Image source={Icons.arrow_forward} style={styles.forward_arrow} />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default YesNoButton;

const styles = StyleSheet.create({
  container_style: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(15),
  },
  review_modal_button_style: {
    flex: 1,
    alignItems: 'center',
    borderRadius: moderateScale(4),
    paddingVertical: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  review_modal_button_text: {
    fontFamily: Fonts.satoshi_bold,
    fontSize: moderateScale(15),
  },
  forward_arrow: {
    width: moderateScale(14),
    height: moderateScale(11),
    marginTop: moderateScale(3),
    marginLeft: moderateScale(5),
  },
});
