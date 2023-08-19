import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthHeader from '../Component/AuthComponent/AuthHeader';
import SigningTextInpute from '../Component/AuthComponent/SigningTextInpute';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';
import {apiConst, GET, POST} from '../helper/apiConstants';
import {errorMessage, validateEmail} from '../helper/constant';
import makeAPIRequest from '../helper/global';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {Icons} from '../theme/icons';
import {moderateScale} from '../theme/scalling';

const Login = ({navigation}) => {
  // const [userName,setUserName] = useState('rajankpatel07@gmail.com')
  // const [password,setPassword] = useState('r12345678')
  // const [userName, setUserName] = useState('rajankpatel1107@gmail.com');
  // const [password, setPassword] = useState('r12345678');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  // const [userName, setUserName] = useState('varun@webfixerr.com');
  // const [password, setPassword] = useState('Hash@123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '338055406961-2j8loeink968krtr5a14adhoefrs5epk.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
  }, []);

  const onGetStartedPress = async () => {
    if (userName === '') {
      errorMessage({message: 'Please enter Email '});
    } else if (!validateEmail(userName)) {
      errorMessage({message: 'Please enter valid Email '});
    } else if (password === '') {
      errorMessage({message: 'Please enter Password'});
    } else if (password.length < 8) {
      errorMessage({message: 'Password minimum length should be 8'});
    } else {
      setLoading(true);
      let fcmToken = await AsyncStorage.getItem('deviceToken');
      console.log(fcmToken, 'fcmToken');
      let data = {
        email: userName,
        password: password,
        role: 'applicant',
        fcmToken: fcmToken ?? 'fcmToken',
      };
      return makeAPIRequest({
        method: POST,
        url: apiConst.login,
        data: data,
        isNeedToRegenerateToken: false,
      })
        .then(async response => {
          console.log('token', response.data.data.jwt.token);
          AsyncStorage.setItem('token', response.data.data.jwt.token);

          return makeAPIRequest({
            method: GET,
            url: apiConst.getUserProfileDetails,
            token: true,
          })
            .then(response => {
              setLoading(false);
              console.log('response.data', response.data);
              if (response.data.data.name == null) {
                navigation.replace('Profile');
              } else {
                navigation.replace('DentalStaffTab');
              }
            })
            .catch(error => setLoading(false));
        })
        .catch(error => {
          setLoading(false);
          errorMessage({message: error.response.data.errors.error});
        });
    }
  };

  const onForgetPasswordPress = () => {
    navigation.navigate('ForgetPassword');
  };

  const onPressGoogleIcon = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    const userInfo = await GoogleSignin.signIn();

    console.log('userInfo =====>', userInfo);
    let fcmToken = await AsyncStorage.getItem('deviceToken');

    setLoading(true);

    let data = {
      email: userInfo.user.email,
      googleId: userInfo.user.id,
      role: 'applicant',
      fcmToken: fcmToken ?? 'fcmToken',
    };

    return makeAPIRequest({
      method: POST,
      url: apiConst.googleLogin,
      data: data,
      isNeedToRegenerateToken: false,
    })
      .then(async response => {
        console.log('token', response.data.data.jwt.token);
        AsyncStorage.setItem('token', response.data.data.jwt.token);

        const userProfileDetails = await makeAPIRequest({
          method: GET,
          url: apiConst.getUserProfileDetails,
          token: true,
        })
          .then(res => res.data.data)
          .catch(error => error);

        if (!userProfileDetails?.name) {
          setLoading(false);
          navigation.replace('Profile');
        } else {
          setLoading(false);
          navigation.replace('DentalStaffTab');
        }
      })
      .catch(error => {
        setLoading(false);
        errorMessage({message: error.response.data.errors.error});
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AcitvityLoader visible={loading} />
      <>
        <AuthHeader />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1, marginHorizontal: moderateScale(16)}}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}>
              <View style={{padding: moderateScale(20)}}>
                <Text style={styles.enter_credential_text}>
                  Enter your credentials
                </Text>
                <Text style={styles.description_text}>
                  Or create new ones, our system will guide you.
                </Text>
                <View style={styles.inpute_view}>
                  <Text style={{color: Colors.black}}>Username</Text>
                  <SigningTextInpute
                    value={userName}
                    placeholderText={'Enter name here...'}
                    iconName={'person-outline'}
                    secretText={false}
                    onChangeText={text => {
                      setUserName(text);
                    }}
                    autoCapitalize={false}
                  />
                </View>
                <View style={styles.inpute_view}>
                  <Text style={{color: Colors.black}}>Password</Text>
                  <SigningTextInpute
                    value={password}
                    placeholderText={'Enter password here...'}
                    iconName={'lock-outline'}
                    secretText={true}
                    onChangeText={text => {
                      setPassword(text);
                    }}
                    autoCapitalize={false}
                  />
                </View>
                <TouchableOpacity onPress={() => onForgetPasswordPress()}>
                  <Text style={styles.forgotpassword_text}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.getstarted_button}
                  onPress={() => onGetStartedPress()}>
                  <Text style={styles.getStarted_text}>Get Started</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={Colors.white}
                    // style={{marginTop: 4}}
                  />
                </TouchableOpacity>
                <Text style={[styles.description_text, {textAlign: 'center'}]}>
                  or
                </Text>
                <TouchableOpacity
                  style={[
                    styles.getstarted_button,
                    {
                      backgroundColor: Colors.white,
                      marginTop: moderateScale(10),
                    },
                  ]}
                  onPress={onPressGoogleIcon}>
                  <Text style={[styles.getStarted_text, {color: Colors.black}]}>
                    Enter With Google
                  </Text>
                  <Image source={Icons.Google} style={styles.google_image} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </>
    </SafeAreaView>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkWhite,
  },
  enter_credential_text: {
    color: Colors.black,
    fontSize: moderateScale(24),
    fontFamily:
      Platform.OS == 'android'
        ? Fonts.notoSerif_Regular
        : Fonts.satoshi_regular,
    marginTop: moderateScale(5),
  },
  description_text: {
    color: Colors.text,
    fontSize: moderateScale(14),
    marginTop: moderateScale(5),
    fontFamily: Fonts.roboto_Regular,
  },
  inpute_view: {
    marginTop: moderateScale(30),
    fontSize: moderateScale(16),
    fontFamily: Fonts.satoshi_regular,
  },
  forgotpassword_text: {
    marginTop: moderateScale(5),
    fontSize: moderateScale(16),
    color: Colors.sky_color,
  },
  getstarted_button: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    padding: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    backgroundColor: Colors.sky_color,
    borderRadius: moderateScale(5),
    marginTop: moderateScale(25),
  },
  getStarted_text: {
    color: Colors.white,
    fontFamily: Fonts.satoshi_bold,
    fontSize: moderateScale(14),
  },
  google_image: {
    width: moderateScale(20),
    height: moderateScale(20),
    marginLeft: moderateScale(10),
  },
});
