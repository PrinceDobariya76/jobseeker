import React from 'react-native';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Fonts} from '../../theme';
import Colors from '../../theme/Colors';
import {moderateScale, verticalScale} from '../../theme/scalling';

const ButtonHeader = props => {
  return (
    <View style={styles.button_view}>
      <TouchableOpacity
        onPress={() => props.selectFirstButton()}
        style={[
          styles.button_style,
          {
            backgroundColor:
              props.selectedButton === 1 ? Colors.blue[600] : Colors.blue[500],
            borderBottomColor:
              props.selectedButton === 1
                ? Colors.brandSecondary
                : Colors.blue[500],
          },
        ]}>
        <Text
          style={[
            styles.button_text,
            {
              fontFamily: Fonts.satoshi_bold,
              opacity: props.selectedButton === 1 ? 1 : 0.8,
              //   props.selectedButton === 1
              //     ? Fonts.satoshi_bold
              //     : Fonts.satoshi_regular,
              fontSize: moderateScale(15),
              // props.selectedButton === 1
              //   ? moderateScale(15)
              //   : moderateScale(16),
            },
          ]}>
          {props.first_button}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.selectsecondButton()}
        style={[
          styles.button_style,
          {
            backgroundColor:
              props.selectedButton === 2 ? Colors.blue[600] : Colors.blue[500],
            borderBottomColor:
              props.selectedButton === 2
                ? Colors.brandSecondary
                : Colors.blue[500],
          },
        ]}>
        <Text
          style={[
            styles.button_text,
            {
              fontFamily: Fonts.satoshi_bold,
              opacity: props.selectedButton === 2 ? 1 : 0.8,
              //   props.selectedButton === 2
              //     ? Fonts.satoshi_bold
              //     : Fonts.satoshi_regular,
              fontSize: moderateScale(15),
              // props.selectedButton === 2
              //   ? moderateScale(15)
              //   : moderateScale(16),
            },
          ]}>
          {props.second_button}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonHeader;

const styles = StyleSheet.create({
  button_style: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 3,
    paddingVertical: verticalScale(15),
  },
  button_text: {
    color: Colors.white,
  },
  button_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
