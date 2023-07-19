import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';
import ConformationModal from '../Component/HomeComponent/ConformationModal';
import CustomeDropdown from '../Component/HomeComponent/CustomeDropdown';
import MainHeader from '../Component/HomeComponent/MainHeader';
import ProfileBottomView from '../Component/HomeComponent/ProfileBottomView';
import ProfilePincodeRadius from '../Component/HomeComponent/ProfilePincodeRadius';
import YesNoButton from '../Component/HomeComponent/YesNoButton';
import {apiConst, GET, POST} from '../helper/apiConstants';
import {errorMessage, getLatitudeFromPincode} from '../helper/constant';
import makeAPIRequest from '../helper/global';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {profession} from '../theme/ConstantArray';
import {Icons} from '../theme/icons';
import {horizontalScale, moderateScale, verticalScale} from '../theme/scalling';

const MyProfile = ({navigation}) => {
  const [userDetail, setUserDetail] = useState({});
  const [selectedProfession, setSelectedProfession] = useState({
    name: '',
    _id: '',
  });
  const [graduationYear, setGraduationYear] = useState({name: '', _id: ''});
  console.log(selectedProfession, 'selectedProfession');
  const [openProfessionModal, setOpenProfessionModal] = useState(false);
  const [openGraduationYearModal, setOpenGraduationYearModal] = useState(false);
  const [selectRange, setSelectRange] = useState(0);
  const [year, setYear] = useState(
    userDetail ? userDetail.yearOfGraduation : null,
  );
  const [mainLoading, setMainLoading] = useState(false);
  const [openConfirmationModalLogOut, SetOpenConfirmationModalLogOut] =
    useState(false);

  const isFocused = useIsFocused();

  const getUserProfileDetails = async () => {
    setMainLoading(true);
    return makeAPIRequest({
      method: GET,
      url: apiConst.getUserProfileDetails,
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        console.log('response', response.data);
        setUserDetail(response.data.data);
        setSelectedProfession({
          name: response?.data?.data?.education ?? '',
          _id: '',
        });
        setGraduationYear({
          name: response?.data?.data?.yearOfGraduation ?? '',
          _id: '',
        });
        setSelectRange(Number(response?.data?.data?.travelDistance) ?? 0);
      })
      .catch(error => {
        setMainLoading(false);
        console.log('error', error.response);
      });
  };

  useEffect(() => {
    if (isFocused) {
      getUserProfileDetails();
    }
  }, [isFocused]);

  useEffect(() => {
    var start_year = 1960;
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = start_year; i <= currentYear; i++) {
      years.push({name: i});
    }
    setYear([...years]);
  }, []);

  const selectProfession = item => {
    setSelectedProfession({
      name: item.name,
      _id: item._id,
    });
    setOpenProfessionModal(!openProfessionModal);
  };

  const SelectGraduation = item => {
    setGraduationYear({
      name: item.name,
      _id: item._id,
    });
    setOpenGraduationYearModal(!openGraduationYearModal);
  };

  const onSubmit = async () => {
    const DOB = moment(userDetail.dob, 'DD\\MM\\YYYY');

    let response = await getLatitudeFromPincode(userDetail.pin)
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
      name: userDetail.name,
      phone: userDetail.phone,
      pin: userDetail.pin,
      gender: userDetail.gender,
      dob: DOB.format('YYYY-MM-DD'),
      education: selectedProfession.name,
      yearOfGraduation: graduationYear.name,
      travelDistance: selectRange.toString(),
      latitude: response.lat,
      longitude: response.lng,
    });
    if (selectedProfession.name == '') {
      errorMessage({message: 'Please select profession '});
    } else if (graduationYear.name == '') {
      errorMessage({message: 'Please select year of graguation '});
    } else if (selectRange == 0) {
      errorMessage({message: 'Please set radius from pincode '});
    } else {
      setMainLoading(true);
      return makeAPIRequest({
        method: POST,
        url: apiConst.updateUserProfileDetails,
        token: true,
        data: data,
      })
        .then(response => {
          setMainLoading(false);
          console.log('response', response.data);
          navigation.goBack();
        })
        .catch(error => {
          setMainLoading(false);
          console.log('error', error.response.data);
        });
    }
  };

  const onLogout = async () => {
    SetOpenConfirmationModalLogOut(false);
    setMainLoading(true);
    return makeAPIRequest({
      method: POST,
      url: apiConst.logout,
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        AsyncStorage.clear();
        navigation.navigate('Login');
      })
      .catch(error => {
        SetOpenConfirmationModalLogOut(false);
        setMainLoading(false);
        console.log('error', error.response.data);
      });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <AcitvityLoader visible={mainLoading} />
        <MainHeader
          isShowLogo={false}
          text="My Profile"
          bellAction={() => navigation.navigate('Notification')}
          logout={true}
          onLogout={() => {
            SetOpenConfirmationModalLogOut(true);
          }}
        />
        <ScrollView
          style={styles.main_container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: verticalScale(30)}}>
          <Text style={styles.profile_text}>Profile Details</Text>
          <View style={styles.header_view}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditProfile', {
                  isUpdate: true,
                  item: userDetail,
                })
              }
              style={styles.editButton}>
              <Image source={Icons.edit} style={styles.edit_image} />
            </TouchableOpacity>
            <Image
              source={
                userDetail?.avatar
                  ? {uri: userDetail?.avatar}
                  : Icons.userDefault
              }
              resizeMode={'contain'}
              style={styles.profile_image}
            />
            <Text style={styles.user_name}>{userDetail.name}</Text>
            <View style={styles.gender_view}>
              <Image source={Icons.GenderIcon} style={styles.gender_icon} />
              <Text style={styles.gender_text}>{userDetail.gender}</Text>
            </View>
            <View style={styles.horizontal_line} />
            <View style={styles.details_view}>
              <Image
                source={Icons.pin}
                style={{width: moderateScale(10), height: moderateScale(12)}}
              />
              <Text style={styles.test_style}>{userDetail.pin}</Text>
              <Image
                source={Icons.Phone}
                style={{
                  width: moderateScale(12),
                  height: moderateScale(12),
                  marginLeft: moderateScale(12),
                }}
              />
              <Text style={styles.test_style}>{userDetail.phone}</Text>
              <Image
                source={Icons.Calender}
                style={{
                  width: moderateScale(10),
                  height: moderateScale(12),
                  marginLeft: moderateScale(12),
                }}
              />
              <Text style={styles.test_style}>{userDetail.dob}</Text>
            </View>
          </View>

          <CustomeDropdown
            selectedProfession={selectedProfession.name}
            data={profession}
            title_text="Professional Education"
            excaimination_image={false}
            setOpenDropDownModal={() =>
              setOpenProfessionModal(!openProfessionModal)
            }
            openModal={openProfessionModal}
            selectItem={val => selectProfession(val)}
            placeholder_text="Select Profession"
            closeModal={() => setOpenProfessionModal(!openProfessionModal)}
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
          <YesNoButton
            first_button_backgroundColor={Colors.borderColor}
            first_button_color={Colors.black}
            first_button_text={'Discard'}
            second_button_backgroundColor={Colors.sky_color}
            second_button_color={Colors.white}
            second_button_text={'Update'}
            first_button_call={() => navigation.goBack()}
            second_button_call={() => onSubmit()}
            flex1={1}
            flex2={1}
            second_button_image={false}
          />
          {/* <SimpleButton
          imagePositio={true}
          image={Icons.completSetup}
          buttonname={"Update"}
          buttonPress={() => navigation.goBack()}
        /> */}
        </ScrollView>
      </SafeAreaView>
      <ConformationModal
        NoButton={() => SetOpenConfirmationModalLogOut(false)}
        YesButton={() => onLogout()}
        header={'Are you sure want to logout?'}
        no_text="No"
        openConfirmationModal={openConfirmationModalLogOut}
        yes_text="Yes"
        closeModal={() => SetOpenConfirmationModalLogOut(false)}
      />
    </>
  );
};
export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main_container: {
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(20),
  },
  profile_text: {
    fontFamily: Fonts.satoshi_bold,
    color: Colors.gray[900],
    fontSize: moderateScale(18),
    marginBottom: verticalScale(10),
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
  gender_view: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  gender_icon: {
    width: moderateScale(12),
    height: moderateScale(12),
  },
  gender_text: {
    color: Colors.black,
    fontFamily: Fonts.satoshi_regular,
    fontSize: moderateScale(14),
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
    fontSize: moderateScale(12),
    fontFamily: Fonts.satoshi_regular,
    color: Colors.black,
    marginLeft: moderateScale(5),
  },
  field_title: {
    color: Colors.black,
    fontSize: moderateScale(15),
    fontFamily: Fonts.satoshi_medium,
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
  country_dropdown: {
    backgroundColor: Colors.gray[200],
    // paddingVertical: moderateScale(7),
    flex: 1,
    paddingHorizontal: moderateScale(2),
  },
});
