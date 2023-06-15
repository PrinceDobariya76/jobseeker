import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {errorMessage} from './constant';
import {navigateToLogin} from './constant';

const makeAPIRequest = async ({method, url, data, token = false}) =>
  new Promise(async (resolve, reject) => {
    let tokenID = await AsyncStorage.getItem('token');
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
        if (response?.status === 200 || response?.status === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch(async error => {
        errorMessage({message: error.response.data.message});

        if (error.response && error.response.status === 401) {
          console.log('hell');
          AsyncStorage.clear();
          navigateToLogin();
        }

        reject(error);
      });
    return null;
  });

export default makeAPIRequest;
