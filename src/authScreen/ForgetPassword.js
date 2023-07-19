import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AuthHeader from '../Component/AuthComponent/AuthHeader';
import SigningTextInpute from '../Component/AuthComponent/SigningTextInpute';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';
import YesNoButton from '../Component/HomeComponent/YesNoButton';
import {apiConst, POST} from '../helper/apiConstants';
import {errorMessage, validateEmail, validateNumber} from '../helper/constant';
import makeAPIRequest from '../helper/global';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {horizontalScale, moderateScale, verticalScale} from '../theme/scalling';

const ForgetPassword = ({navigation}) => {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, isLoading] = useState(false);

  const onSendOtp = async () => {
    if (showOTP) {
      if (otp.length != 6) {
        errorMessage({message: 'Please enter correct otp '});
      } else if (!validateNumber(otp)) {
        errorMessage({message: 'Please enter correct otp '});
      } else {
        navigation.navigate('ChangePassword', {otp: otp, email: email});
      }
    } else {
      if (email == '') {
        errorMessage({message: 'Please enter Email '});
      } else if (!validateEmail(email)) {
        errorMessage({message: 'Please enter valid Email '});
      } else {
        isLoading(true);
        let data = {
          email: email,
          role: 'applicant',
        };
        return makeAPIRequest({
          method: POST,
          url: apiConst.forgetPassowrd,
          data: data,
        })
          .then(response => {
            console.log('response', response.data);
            isLoading(false);
            if (response.data) {
              setShowOTP(true);
            }
          })
          .catch(error => {
            isLoading(false);
          });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AcitvityLoader visible={loading} />
      <AuthHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
          <View style={{padding: moderateScale(20)}}>
            <Text style={styles.description_text}>
              Forgot your password? We have got you covered.
            </Text>
            <Text style={styles.change_password_text}>
              Change your password
            </Text>
            <View style={styles.inpute_view}>
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.satoshi_medium,
                  fontSize: moderateScale(16),
                }}>
                Enter your registered email
              </Text>
              <SigningTextInpute
                placeholderText={'Enter email here...'}
                iconName={'person-outline'}
                secretText={false}
                value={email}
                onChangeText={text => {
                  setEmail(text);
                }}
                autoCapitalize={false}
              />
            </View>
            {/* <YesNoButton
                  first_button_backgroundColor={Colors.borderColor}
                  first_button_color={Colors.black}
                  first_button_text={'Discard'}
                  second_button_backgroundColor={Colors.sky_color}
                  second_button_color={Colors.white}
                  second_button_text={'Send OTP'}
                  first_button_call={() => navigation.goBack()}
                  second_button_call={() => setShowOTP(true)}
                  flex1={1}
                  flex2={1}
                  second_button_image={true}
                  styles={{marginTop: verticalScale(50)}}
                /> */}
            {/* <TouchableOpacity
                  style={styles.getstarted_button}
                  onPress={() => {
                    setShowOTP(true);
                  }}>
                  <Text style={styles.getStarted_text}>Send OTP </Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={Colors.white}
                    style={{marginTop: 4}}
                  />
                </TouchableOpacity> */}
            {showOTP && (
              <View style={styles.inpute_view}>
                <Text
                  style={{
                    color: Colors.black,
                    fontFamily: Fonts.satoshi_medium,
                    fontSize: moderateScale(16),
                  }}>
                  Enter the OTP sent on your email
                </Text>
                <OTPInputView
                  pinCount={6}
                  style={{width: '100%', height: 70}}
                  autoFocusOnLoad={false}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  onCodeChanged={text => {
                    setOtp(text);
                  }}
                  code={otp}
                />
              </View>
            )}

            <YesNoButton
              first_button_backgroundColor={Colors.borderColor}
              first_button_color={Colors.black}
              first_button_text={'Discard'}
              second_button_backgroundColor={Colors.sky_color}
              second_button_color={Colors.white}
              second_button_text={!showOTP ? 'Send OTP' : 'Continue'}
              first_button_call={() => navigation.goBack()}
              second_button_call={() => {
                onSendOtp();
              }}
              flex1={1}
              flex2={1}
              second_button_image={true}
            />
            {/* <TouchableOpacity
                  style={styles.getstarted_button}
                  onPress={() => navigation.navigate('ChangePassword')}>
                  <Text style={styles.getStarted_text}>Save and Continue </Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={Colors.white}
                    style={{marginTop: 4}}
                  />
                </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  underlineStyleBase: {
    width: 50,
    height: 45,
    color: Colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFF',
  },
  description_text: {
    color: Colors.text,
    fontSize: moderateScale(14),
    marginTop: verticalScale(5),
    fontFamily: Fonts.roboto_Regular,
  },
  change_password_text: {
    fontSize: moderateScale(24),
    fontFamily: Fonts.satoshi_bold,
    color: Colors.black,
  },
  inpute_view: {
    marginTop: verticalScale(40),
    fontSize: moderateScale(16),
    fontFamily: Fonts.satoshi_regular,
  },
  getstarted_button: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    padding: moderateScale(10),
    paddingHorizontal: horizontalScale(15),
    backgroundColor: Colors.sky_color,
    borderRadius: moderateScale(5),
    marginTop: verticalScale(50),
  },
  getStarted_text: {
    color: Colors.white,
    fontFamily: Fonts.satoshi_bold,
    fontSize: moderateScale(14),
  },
});
