import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {errorMessage, generateNewToken} from './constant';
import {navigateToLogin} from './constant';

const makeAPIRequest = async ({
  method,
  url,
  data,
  token = false,
  isNeedToRegenerateToken = true,
}) =>
  new Promise(async (resolve, reject) => {
    console.log(url, 'makeAPIRequest');
    let generatedToken;
    if (isNeedToRegenerateToken) {
      generatedToken = await generateNewToken();
    }

    let tokenID = await (generatedToken ??
      (await AsyncStorage.getItem('token')));

    let apiHeader = token
      ? {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${tokenID}`,
        }
      : {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

    const options = {
      method,
      url,
      data,
      headers: apiHeader,
      token,
    };

    axios(options)
      .then(async response => {
        if (
          response?.status === 200 ||
          response?.status === 201 ||
          response?.status === 204
        ) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(async error => {
        console.log(error.response.status, 'API Error');
        errorMessage({message: error.response.data.message});

        reject(error);

        if (error.response.status === 401) {
          AsyncStorage.clear();
          navigateToLogin();
        }
      });
    return null;
  });

export default makeAPIRequest;
