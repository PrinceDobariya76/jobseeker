import React, {useEffect} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {Images} from '../theme/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET, apiConst} from '../helper/apiConstants';
import makeAPIRequest from '../helper/global';
import { generateNewToken } from '../helper/constant';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(async () => {
      const generatedToken = await generateNewToken();
    console.log(generatedToken, 'generatedToken At Splash');
    let tokenID = generatedToken ?? (await AsyncStorage.getItem('token'));

      if (tokenID === null || undefined) {
        navigation.replace('Splashscreen1');
      } else {
        return makeAPIRequest({
          method: GET,
          url: apiConst.getUserProfileDetails,
          token: true,
        })
          .then(response => {
            if (response.data.data.name == null) {
              navigation.replace('Login');
            } else {
              navigation.replace('DentalStaffTab');
            }
          })
          .catch(error => {});
      }
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={Images.splashscreen}
        style={styles.image}
        resizeMode="stretch"
      />
    </View>
  );
};
export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
