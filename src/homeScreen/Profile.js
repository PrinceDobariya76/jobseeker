/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {default as Moment, default as moment} from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PhoneInput from 'react-native-phone-number-input';
import {SafeAreaView} from 'react-native-safe-area-context';
import AuthHeader from '../Component/AuthComponent/AuthHeader';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';
import ConformationModal from '../Component/HomeComponent/ConformationModal';
import CustomeDropdown from '../Component/HomeComponent/CustomeDropdown';
import ProfileBottomView from '../Component/HomeComponent/ProfileBottomView';
import ProfilePincodeRadius from '../Component/HomeComponent/ProfilePincodeRadius';
import SimpleButton from '../Component/HomeComponent/SimpleButton';
import {apiConst, POST} from '../helper/apiConstants';
import {
  errorMessage,
  generateNewToken,
  getLatitudeFromPincode,
} from '../helper/constant';
import makeAPIRequest from '../helper/global';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {educationData, profession} from '../theme/ConstantArray';
import {Icons} from '../theme/icons';
import {moderateScale, verticalScale} from '../theme/scalling';

const data = [
  {key: '1', value: '$50/hr (Recomended)'},
  {key: '2', value: '$100/hr'},
  {key: '3', value: '$150/hr'},
  {key: '4', value: '$200/hr'},
];

const Profile = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [profEducation, setProfEducation] = useState({
    name: '',
    _id: '',
  });
  const [selectRange, setSelectRange] = useState(0);
  const [openDropDownModal, setOpenDropDownModal] = useState(false);
  const [graduationModal, setGraduationModal] = useState(false);
  const [number, setNumber] = useState('');
  const [year, setYear] = useState(null);
  const [selectedYear, setSelectedYear] = useState({
    name: new Date().getFullYear(),
  });
  const [openConfirmationModal, SetOpenConfirmationModal] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [pinCode, setPinCode] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [mainLoading, setMainLoading] = useState(false);

  const selectItem = item => {
    setProfEducation({
      name: item.name,
      _id: item._id,
    });
    setOpenDropDownModal(!openDropDownModal);
  };

  const SelectGraduation = item => {
    setSelectedYear({
      name: item.name,
    });
    setGraduationModal(!graduationModal);
  };

  const uploadImage = async image1 => {
    const generatedToken = await generateNewToken();
    console.log(generatedToken, 'generatedToken At Profile');
    let tokenID = generatedToken ?? (await AsyncStorage.getItem('token'));
    let apiHeader = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: `Bearer ${tokenID}`,
    };

    const formData = new FormData();

    let ImageFileName = image1.path;
    formData.append('avatar', {
      uri: image1.path,
      type: image1.mime,
      name: ImageFileName.slice(-10),
    });
    formData.append('key1', 'value1');

    axios
      .post(apiConst.userAvatar, formData, {
        headers: apiHeader,
      })
      .then(response => {
        console.log('Upload success:', response.data);
      })
      .catch(error => {
        console.log('Upload error:', error.response.data);
      });
  };

  const imageselect = () => {
    SetOpenConfirmationModal(true);
  };

  const openGallery = async () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      SetOpenConfirmationModal(false);
      setImage(image.path);
      uploadImage(image);
    });
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      SetOpenConfirmationModal(false);
      setImage(image.path);
      uploadImage(image);
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setBirthDate(date);
    setDatePickerVisibility(false);
  };

  const onPressCompleteSetup = async () => {
    setMainLoading(true);
    let response = await getLatitudeFromPincode(pinCode)
      .then(res => {
        const {results} = res.data;
        const {lat} = results[0].geometry.location;
        const {lng} = results[0].geometry.location;
        let latLong = {lat, lng};
        return latLong;
      })
      .catch(err => {
        setMainLoading(false);
        errorMessage({message: 'Enter correct zipcode'});
        console.log('err------------->', err.response.data);
      });
    let postData = JSON.stringify({
      name: name,
      phone: number,
      pin: pinCode,
      gender: gender,
      dob: moment(birthDate).format('YYYY-MM-DD'),
      education: profEducation.name,
      yearOfGraduation: selectedYear.name,
      travelDistance: selectRange.toString(),
      latitude: response.lat,
      longitude: response.lng,
    });

    console.log(postData, 'postData');
    if (name === '') {
      errorMessage({message: 'Enter your name'});
    } else if (number === '') {
      errorMessage({message: 'Enter your phone number'});
    } else if (pinCode === '') {
      errorMessage({message: 'Enter your pincode'});
    } else if (gender === null) {
      errorMessage({message: 'Please select gender'});
    } else if (profEducation.name === '') {
      errorMessage({message: 'Please select profession'});
    } else if (selectedYear.name === '') {
      errorMessage({message: 'Please select year of graguation'});
    } else if (selectRange === 0) {
      errorMessage({message: 'Please select radius from pincode'});
    } else {
      return makeAPIRequest({
        method: POST,
        url: apiConst.updateUserProfileDetails,
        token: true,
        data: postData,
      })
        .then(response => {
          console.log(response, 'response');
          setMainLoading(false);
          navigation.navigate('DentalStaffTab');
        })
        .catch(error => {
          setMainLoading(false);
          console.log('error', error.response.data);
        });
    }
  };

  useEffect(() => {
    var start_year = 1960;
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = start_year; i <= currentYear; i++) {
      years.push({name: i});
    }
    setYear([...years]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader
        profileTextEnable={true}
        smallText="Tell us more about yourself"
        bigText="Profile Details"
      />
      <AcitvityLoader visible={mainLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          style={{
            paddingHorizontal: moderateScale(20),
            marginTop: moderateScale(20),
            flex: 1,
          }}
          contentContainerStyle={{flexGrow: 1}}>
          <TouchableOpacity
            style={[
              styles.profile_view,
              {
                padding: image === null ? moderateScale(30) : 0,
                borderWidth: image === null ? 1 : 0,
              },
            ]}
            onPress={() => imageselect()}>
            <Image
              source={image === null ? Icons.selectImage : {uri: image}}
              style={image !== null ? styles.profile_image : {}}
            />
          </TouchableOpacity>
          <Text style={styles.test_style}>Upload profile photo</Text>
          <Text style={[styles.field_title, {marginTop: moderateScale(20)}]}>
            Full Name
          </Text>
          <TextInput
            style={[styles.textInpute_style, {padding: moderateScale(10)}]}
            placeholder="Enter name here..."
            placeholderTextColor={Colors.gray[400]}
            value={name}
            autoCapitalize={false}
            onChangeText={text => setName(text)}
          />
          <Text style={[styles.field_title, {marginTop: moderateScale(20)}]}>
            Phone Number
          </Text>
          <View style={styles.phoneInput}>
            <PhoneInput
              disableArrowIcon={true}
              flagButtonStyle={styles.flagStyle}
              defaultCode={'CA'}
            />
            <View style={styles.main}>
              <TextInput
                style={styles.TextInput}
                placeholder="Enter phone number here..."
                keyboardType="number-pad"
                value={number}
                maxLength={10}
                onChangeText={val => setNumber(val)}
                placeholderTextColor={Colors.gray[500]}
              />
            </View>
          </View>
          <View style={{marginTop: verticalScale(10)}}>
            <CustomeDropdown
              selectedProfession={profEducation.name}
              data={educationData}
              title_text="Professional Education"
              excaimination_image={false}
              setOpenDropDownModal={() =>
                setOpenDropDownModal(!openDropDownModal)
              }
              openModal={openDropDownModal}
              selectItem={selectItem}
              placeholder_text="Select Profession"
              closeModal={() => setOpenDropDownModal(!openDropDownModal)}
            />
          </View>

          <Text style={[styles.field_title, {marginTop: moderateScale(20)}]}>
            Pincode
          </Text>
          <View style={styles.inputeFiled_view}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: moderateScale(10),
              }}>
              <Image
                source={Icons.pin}
                style={{width: moderateScale(12), height: moderateScale(15)}}
              />
            </View>
            <TextInput
              style={{
                color: Colors.black,
                flex: 1,
                alignSelf: 'flex-start',
                padding: moderateScale(10),
              }}
              placeholder="10 KM"
              placeholderTextColor={Colors.gray[400]}
              value={pinCode}
              autoCapitalize={false}
              onChangeText={text => setPinCode(text)}
              keyboardType={'number-pad'}
            />
          </View>
          <Text style={[styles.field_title, {marginTop: moderateScale(20)}]}>
            Gender
          </Text>
          <View style={styles.gender_select_view}>
            <TouchableOpacity
              style={styles.selectgender_button}
              onPress={() => setGender('male')}>
              {gender !== null ? (
                gender === 'male' ? (
                  <Image
                    source={Icons.check_green}
                    style={styles.check_image}
                  />
                ) : null
              ) : null}
            </TouchableOpacity>
            <Text
              style={[styles.test_style, styles.extra_style]}
              onPress={() => setGender('male')}>
              male
            </Text>
            <TouchableOpacity
              style={[
                styles.selectgender_button,
                {marginLeft: moderateScale(15)},
              ]}
              onPress={() => setGender('female')}>
              {gender !== null ? (
                gender === 'female' ? (
                  <Image
                    source={Icons.check_green}
                    style={styles.check_image}
                  />
                ) : null
              ) : null}
            </TouchableOpacity>
            <Text
              style={[styles.test_style, styles.extra_style]}
              onPress={() => setGender('female')}>
              female
            </Text>
            <TouchableOpacity
              style={[
                styles.selectgender_button,
                {marginLeft: moderateScale(15)},
              ]}
              onPress={() => setGender('others!')}>
              {gender !== null ? (
                gender === 'others!' ? (
                  <Image
                    source={Icons.check_green}
                    style={styles.check_image}
                  />
                ) : null
              ) : null}
            </TouchableOpacity>
            <Text
              style={[styles.test_style, styles.extra_style]}
              onPress={() => setGender('others!')}>
              others
            </Text>
          </View>
          <Text style={[styles.field_title, {marginTop: moderateScale(20)}]}>
            Date of Birth
          </Text>
          <TouchableOpacity
            style={[styles.textInpute_style, {padding: moderateScale(14)}]}
            onPress={showDatePicker}>
            <Text style={{color: Colors.black}}>
              {Moment(birthDate).format('DD MMM, YYYY')}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={birthDate}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <CustomeDropdown
            selectedProfession={selectedYear.name}
            data={year === null ? [] : year}
            title_text="Year of Graduation"
            excaimination_image={false}
            setOpenDropDownModal={() => setGraduationModal(!graduationModal)}
            openModal={graduationModal}
            selectItem={SelectGraduation}
            placeholder_text="Select Graduation"
            closeModal={() => setGraduationModal(!graduationModal)}
          />

          <ProfileBottomView />
          <ProfilePincodeRadius
            selectRange={selectRange}
            setSelectRange={val => setSelectRange(val)}
          />
          <SimpleButton
            imagePositio={true}
            image={Icons.completSetup}
            buttonname={'Complete Setup'}
            buttonPress={onPressCompleteSetup}
          />
          <ConformationModal
            NoButton={() => openCamera()}
            YesButton={() => openGallery()}
            header={'Select from'}
            no_text="Camera"
            openConfirmationModal={openConfirmationModal}
            yes_text="Gallery"
            closeModal={() => SetOpenConfirmationModal(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkWhite,
  },
  header_view: {
    backgroundColor: Colors.white,
    padding: moderateScale(20),
  },
  profile_image: {
    borderRadius: moderateScale(50),
    width: moderateScale(80),
    height: moderateScale(80),
    alignSelf: 'center',
  },
  gender_view: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  gender_icon: {
    width: moderateScale(15),
    height: moderateScale(15),
  },
  gender_text: {
    color: Colors.black,
    fontFamily: Fonts.satoshi_regular,
    fontSize: moderateScale(15),
    marginLeft: moderateScale(7),
  },
  horizontal_line: {
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 2,
    padding: moderateScale(10),
  },
  details_view: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
    justifyContent: 'center',
  },
  test_style: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.satoshi_regular,
    color: Colors.black,
    alignSelf: 'center',
    marginTop: moderateScale(10),
  },
  field_title: {
    color: Colors.black,
    fontSize: moderateScale(15),
    fontFamily: Fonts.satoshi_medium,
  },
  editButton: {
    borderRadius: moderateScale(50),
    alignSelf: 'flex-end',
    backgroundColor: Colors.gray[200],
    padding: moderateScale(10),
  },
  edit_image: {
    width: moderateScale(13),
    height: moderateScale(13),
  },
  user_name: {
    alignSelf: 'center',
    fontSize: moderateScale(18),
    fontFamily: Fonts.satoshi_bold,
    color: Colors.black,
    marginVertical: moderateScale(10),
  },
  textInpute_style: {
    color: Colors.black,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: moderateScale(4),
    marginTop: moderateScale(8),
    padding: moderateScale(13),
    backgroundColor: Colors.white,
  },
  phoneInput: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(4),
    borderColor: Colors.borderColor,
    borderWidth: 1,
    marginTop: verticalScale(8),
  },
  flagStyle: {
    backgroundColor: Colors.gray[200],
    flex: 0.7,
  },
  main: {
    flexDirection: 'row',
    marginLeft: moderateScale(8),
    flex: 2,
  },
  TextInput: {
    fontSize: moderateScale(14.5),
    color: Colors.black,
    flex: 1,
  },
  removeText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  TouchableText: {
    fontSize: moderateScale(14),
    color: Colors.black,
  },
  country_dropdown: {
    marginTop: moderateScale(5),
    backgroundColor: Colors.white,
    flex: 1,
    borderColor: Colors.borderColor,
    borderWidth: 0.8,
    borderRadius: 4,
    paddingHorizontal: moderateScale(2),
    padding: moderateScale(10),
  },
  profile_view: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(50),
    padding: moderateScale(30),
    borderWidth: 1,
    borderColor: Colors.sky_color,
    backgroundColor: Colors.blue[100],
    alignSelf: 'center',
    borderStyle: 'dashed',
  },
  inputeFiled_view: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: moderateScale(5),
    borderColor: Colors.borderColor,
    marginTop: moderateScale(8),
    paddingHorizontal: moderateScale(5),
    backgroundColor: Colors.white,
  },
  gender_select_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  selectgender_button: {
    height: moderateScale(20),
    width: moderateScale(20),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(50),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check_image: {
    width: moderateScale(19),
    height: moderateScale(19),
  },
  extra_style: {
    marginTop: 0,
    marginLeft: moderateScale(5),
    fontSize: moderateScale(14),
  },
});
