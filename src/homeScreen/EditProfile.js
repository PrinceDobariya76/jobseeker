import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AuthHeader from '../Component/AuthComponent/AuthHeader';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {Icons} from '../theme/icons';
import {Images} from '../theme/images';
import {moderateScale, verticalScale} from '../theme/scalling';
import DropDownComp from '../Component/HomeComponent/DropDown';

import {GraduationYear, profession} from '../theme/ConstantArray';
import ProfileBottomView from '../Component/HomeComponent/ProfileBottomView';
import ProfilePincodeRadius from '../Component/HomeComponent/ProfilePincodeRadius';
import SimpleButton from '../Component/HomeComponent/SimpleButton';

import ImageCropPicker from 'react-native-image-crop-picker';
import CustomeDropdown from '../Component/HomeComponent/CustomeDropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';
import YesNoButton from '../Component/HomeComponent/YesNoButton';
import PhoneInput from 'react-native-phone-number-input';
import ConformationModal from '../Component/HomeComponent/ConformationModal';
import {POST, apiConst} from '../helper/apiConstants';
import makeAPIRequest from '../helper/global';
import moment from 'moment';
import {errorMessage, getLatitudeFromPincode} from '../helper/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditProfile = ({navigation, route}) => {
  let isUpdate;
  let item;
  let isNew;
  if (route) {
    isUpdate = route.params ? route.params.isUpdate : false;
    item = route.params ? route.params.item : {};
    isNew = route.params ? route.params.isNew : false;
  }

  const [image, setImage] = useState(null);
  const [gender, setGender] = useState(isUpdate ? item.gender : null);
  const [selectRange, setSelectRange] = useState(0);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthDate, setBirthDate] = useState(
    // isUpdate ? moment(item.dob,'YYYY/MM/DD').toISOString() : new Date(),
    new Date(),
  );
  const [openConfirmationModal, SetOpenConfirmationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    name: '',
    _id: '',
  });
  const [openDropDownModal, setOpenDropDownModal] = useState(false);
  const [number, setNumber] = useState(isUpdate ? item.phone : '');
  const [graduationYear, setGraduationYear] = useState({name: '', _id: ''});
  const [openGraduationYearModal, setOpenGraduationYearModal] = useState(false);
  const [year, setYear] = useState(null);
  const [name, setName] = useState(isUpdate ? item.name : '');
  const [pincode, setPincode] = useState(isUpdate ? item.pin : '');

  useEffect(() => {
    var start_year = 1960;
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = start_year; i <= currentYear; i++) {
      years.push({name: i});
    }
    setYear([...years]);
  }, []);

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

  const selectItem = item => {
    setSelectedItem({
      name: item.name,
      _id: item._id,
    });
    setOpenDropDownModal(!openDropDownModal);
  };

  const SelectGraduation = item => {
    setGraduationYear({
      name: item.name,
      _id: item._id,
    });
    setOpenGraduationYearModal(!openGraduationYearModal);
  };

  const uploadImage = async image1 => {
    let tokenID = await AsyncStorage.getItem('token');
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

  const onSubmit = async () => {
    let response = await getLatitudeFromPincode(pincode)
      .then(res => {
        const {results} = res.data;
        const {lat} = results[0].geometry.location;
        const {lng} = results[0].geometry.location;
        let latLong = {lat, lng};
        return latLong;
      })
      .catch(err => {
        errorMessage({message: 'Enter correct zipcode'});
        console.log('err------------->', err.response.data);
      });
    let data = JSON.stringify({
      name: name,
      phone: number,
      pin: pincode,
      gender: gender,
      dob: moment(birthDate).format('YYYY-MM-DD'),
      education: selectedItem.name,
      yearOfGraduation: graduationYear.name,
      travelDistance: selectRange.toString(),
      latitude: response.lat,
      longitude: response.lng,
    });

    if (name == '') {
      errorMessage({message: 'Enter your name'});
    } else if (number == '') {
      errorMessage({message: 'Enter your phone number'});
    } else if (pincode == '') {
      errorMessage({message: 'Enter your pincode '});
    } else if (gender == null) {
      errorMessage({message: 'Please select gender '});
    } else if (selectedItem._id == '') {
      errorMessage({message: 'Please select profession '});
    } else if (graduationYear._id == '') {
      errorMessage({message: 'Please select year of graguation '});
    } else if (selectRange == 0) {
      errorMessage({message: 'Please select radius from pincode '});
    } else {
      return makeAPIRequest({
        method: POST,
        url: apiConst.updateUserProfileDetails,
        token: true,
        data: data,
      })
        .then(response => {
          console.log('response', response.data);
          isUpdate
            ? navigation.goBack()
            : navigation.navigate('DentalStaffTab');
        })
        .catch(error => {
          console.log('error', error.response.data);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader
        profileTextEnable={true}
        smallText="Tell us more about yourself"
        bigText="Profile Details"
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{
            paddingHorizontal: moderateScale(20),
            marginTop: moderateScale(20),
            flex: 1,
          }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.profile_view,
              {
                padding: image == null ? moderateScale(30) : 0,
                borderWidth: image == null ? 1 : 0,
              },
            ]}
            onPress={() => imageselect()}>
            <Image
              source={image == null ? Icons.selectImage : {uri: image}}
              style={image !== null ? styles.profile_image : {}}
            />
          </TouchableOpacity>
          {/* )} */}
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
            />
            <View style={styles.main}>
              <TextInput
                style={styles.TextInput}
                placeholder={'Enter phone number here...'}
                keyboardType="numeric"
                value={number}
                maxLength={10}
                onChangeText={number => {
                  setNumber(number);
                }}
                placeholderTextColor={Colors.gray[500]}
              />
              {/* {number.length === 0 ? null : ( */}
              <TouchableOpacity
                style={styles.removeText}
                onPress={() => setNumber('')}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={Images.TIMES}
                />
              </TouchableOpacity>
              {/* )} */}
            </View>
          </View>

          <Text style={[styles.field_title, {marginTop: moderateScale(20)}]}>
            Pincode
          </Text>
          <View style={styles.inputeFiled_view}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: moderateScale(10),
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
              value={pincode}
              autoCapitalize={false}
              onChangeText={text => setPincode(text)}
            />
          </View>
          {/* <Text style={[styles.test_style, {alignSelf: 'flex-start'}]}>
            Ottawa,Canada
          </Text> */}

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
            selectedProfession={selectedItem.name}
            data={profession}
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
          <CustomeDropdown
            selectedProfession={graduationYear.name}
            data={year === null ? [] : year}
            title_text="Year of Graduation"
            excaimination_image={false}
            setOpenDropDownModal={() =>
              setOpenGraduationYearModal(!openGraduationYearModal)
            }
            openModal={openGraduationYearModal}
            selectItem={val => SelectGraduation(val)}
            placeholder_text="Select Year"
            closeModal={() =>
              setOpenGraduationYearModal(!openGraduationYearModal)
            }
          />
          <ProfileBottomView />
          <ProfilePincodeRadius
            selectRange={selectRange}
            setSelectRange={val => setSelectRange(val)}
          />
          {/* <SimpleButton
          imagePositio={true}
          image={Icons.completSetup}
          buttonname={"Complete Setup"}
          buttonPress={() => navigation.goBack()}
        /> */}
          <View style={styles.last_button_view}>
            <YesNoButton
              first_button_backgroundColor={Colors.borderColor}
              first_button_color={Colors.black}
              first_button_disable={isNew ? true : false}
              first_button_Opacity={isNew ? 0.2 : 1}
              first_button_text={'Discard'}
              second_button_backgroundColor={Colors.sky_color}
              second_button_color={Colors.white}
              second_button_text={isUpdate ? 'Update' : 'Submit'}
              first_button_call={() => navigation.goBack()}
              second_button_call={() => onSubmit()}
              flex1={1}
              flex2={1}
              second_button_image={true}
            />
          </View>
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

export default EditProfile;

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
    width: moderateScale(100),
    height: moderateScale(100),
    alignSelf: 'center',
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
  test_style: {
    fontSize: moderateScale(12),
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
  textInpute_style: {
    color: Colors.black,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: moderateScale(4),
    marginTop: moderateScale(10),
    padding: moderateScale(13),
    backgroundColor: Colors.white,
  },
  inputeFiled_view: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: moderateScale(5),
    borderColor: Colors.borderColor,
    marginTop: moderateScale(5),
    paddingHorizontal: moderateScale(5),
    backgroundColor: Colors.white,
  },
  extra_style: {
    marginTop: 0,
    marginLeft: moderateScale(5),
    fontSize: moderateScale(14),
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
  gender_select_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  dropdown: {
    borderColor: Colors.borderColor,
    borderWidth: 1,
    // marginHorizontal: moderateScale(10),
    marginTop: moderateScale(5),
    borderRadius: moderateScale(4),
    padding: moderateScale(12),
    backgroundColor: Colors.white,
  },
  selectedItem: {
    color: Colors.black,
    fontSize: 12,
  },
  country_dropdown: {
    backgroundColor: Colors.gray[200],
    // paddingVertical: moderateScale(7),
    flex: 1,
    paddingHorizontal: moderateScale(2),
  },
  last_button_view: {
    marginBottom: moderateScale(20),
  },
  phoneInput: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(4),
    borderColor: Colors.borderColor,
    borderWidth: 1,
    marginTop: verticalScale(5),
  },
  flagStyle: {
    backgroundColor: Colors.gray[200],
    flex: 0.7,
  },
  main: {
    flexDirection: 'row',
    // paddingBottom: moderateScale(3),
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
});
