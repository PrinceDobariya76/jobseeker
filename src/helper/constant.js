import {showMessage} from 'react-native-flash-message';
import {moderateScale} from '../theme/scalling';
import makeAPIRequest from './global';
import {POST, apiConst} from './apiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/routers';
import {createRef, useNavigation} from 'react';
import axios from 'axios';

export const navigationRef = createRef();

export const errorMessage = ({message, description}) => {
  showMessage({
    message,
    description,
    icon: 'info',
    type: 'danger',
    textStyle: {marginRight: moderateScale(5)},
  });
};

export const successMessage = ({message, description}) => {
  showMessage({
    message,
    description,
    icon: 'info',
    type: 'danger',
    textStyle: {marginRight: moderateScale(5)},
  });
};

export const validateEmail = email => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validateNumber = number => {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(number);
};

const getTokenExpiredStatus = tokenExpiresTime => {
  const tokenExpiresDate = new Date(tokenExpiresTime);
  const currentDate = new Date();

  const timeDifferenceInSeconds = (tokenExpiresDate - currentDate) / 1000;
  console.log(timeDifferenceInSeconds, 'timeDifferenceInSeconds');

  return timeDifferenceInSeconds < 120;
};


export const generateNewToken = async () => {
  let tokenExpireTime = await AsyncStorage.getItem('expiresAt');
  console.log(tokenExpireTime, 'tokenExpiresTime');
  console.log(new Date(), 'current Time');

  const isTokenExpired = getTokenExpiredStatus(tokenExpireTime);

  console.log(isTokenExpired, 'isTokenExpired');

  if (isTokenExpired) {
    console.log('OKL');
    return await makeAPIRequest({
      method: POST,
      url: apiConst.refreshToken,
      token: true,
      isNeedToRegenerateToken: false,
    })
      .then(async response => {
        console.log('response_token', response.data.data.jwt.token);
        await AsyncStorage.setItem('token', response.data.data.jwt.token);
        await AsyncStorage.setItem(
          'expiresAt',
          response.data.data.jwt.expiresAt,
        );

        return response.data.data.jwt.token;
      })
      .catch(error => {
        console.log('eorooo', error.response.data);
      });
  } else {
    return null;
  }
};

export const commonActions = screenName => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: screenName}],
    }),
  );
};

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export const navigateToLogin = () => {
  const navigation = navigationRef.current;
  navigation.navigate('Login');
};

export const getLatitudeFromPincode = async pincode => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=AIzaSyBGUFTOrwWqd9MpOKSAWUoCi7wTNgSTj2E`,
      )
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
