import React from 'react';
import {View, TextInput, StyleSheet, Platform} from 'react-native';
import Colors from '../../theme/Colors';
import {moderateScale} from '../../theme/scalling';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SigningTextInpute = props => {
  return (
    <View style={Styles.container}>
      <MaterialIcons name={props.iconName} size={20} color={Colors.gray[500]} />
      <TextInput
        placeholder={props.placeholderText}
        style={{
          color: Colors.black,
          paddingVertical: Platform.OS == 'ios' ? 10 : 0,
          marginLeft: 5,
          flex: 1,
        }}
        placeholderTextColor={Colors.gray[500]}
        secureTextEntry={props.secretText}
        onChangeText={props.onChangeText}
        value={props.value}
        autoCapitalize={props.autoCapitalize}
      />
    </View>
  );
};

export default SigningTextInpute;

const Styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: moderateScale(4),
    backgroundColor: Colors.white,
    alignItems: 'center',
    marginTop: moderateScale(10),
    padding: moderateScale(4),
  },
});
