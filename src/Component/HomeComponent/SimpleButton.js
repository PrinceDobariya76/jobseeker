import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {Fonts} from '../../theme';
import Colors from '../../theme/Colors';
import {Icons} from '../../theme/icons';
import {moderateScale} from '../../theme/scalling';

const SimpleButton = ({
  imagePositio,
  image,
  buttonname,
  buttonPress,
  manually_add,
  backPosition,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: manually_add ? Colors.gray[200] : Colors.sky_color,
          paddingHorizontal: manually_add
            ? moderateScale(10)
            : moderateScale(0),
        },
      ]}
      onPress={buttonPress}>
      {imagePositio === true ? (
        <Image
          source={image}
          style={[
            styles.button_image,
            {tintColor: manually_add ? Colors.black : Colors.white},
          ]}
        />
      ) : null}

      <Text
        style={[
          styles.button_text,
          {color: manually_add ? Colors.black : Colors.white},
        ]}>
        {buttonname}
      </Text>
      {backPosition === true ? (
        <Image
          source={image}
          style={[
            styles.button_image,
            {
              tintColor: manually_add ? Colors.black : Colors.white,
              marginLeft: moderateScale(7),
            },
          ]}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default SimpleButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: moderateScale(13),
    backgroundColor: Colors.sky_color,
    borderRadius: moderateScale(4),
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: moderateScale(15),
  },
  button_image: {
    width: moderateScale(15),
    height: moderateScale(15),
    tintColor: Colors.white,
    marginTop: moderateScale(1),
  },
  button_text: {
    marginLeft: moderateScale(5),
    fontSize: moderateScale(14),
    fontFamily: Fonts.satoshi_bold,
    color: Colors.white,
  },
});
