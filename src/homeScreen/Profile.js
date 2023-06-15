import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import AuthHeader from '../Component/AuthComponent/AuthHeader';
import SimpleButton from '../Component/HomeComponent/SimpleButton';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {Icons} from '../theme/icons';
import {Images} from '../theme/images';
import {moderateScale, verticalScale} from '../theme/scalling';
import {profession} from '../theme/ConstantArray';
import ProfileBottomView from '../Component/HomeComponent/ProfileBottomView';
import ProfilePincodeRadius from '../Component/HomeComponent/ProfilePincodeRadius';
import CustomeDropdown from '../Component/HomeComponent/CustomeDropdown';
import {SafeAreaView} from 'react-native-safe-area-context';
import PhoneInput from 'react-native-phone-number-input';
import DropDown from '../Component/HomeComponent/DropDown';

const data = [
  {key: '1', value: '$50/hr (Recomended)'},
  {key: '2', value: '$100/hr'},
  {key: '3', value: '$150/hr'},
  {key: '4', value: '$200/hr'},
];

const Profile = ({navigation}) => {
  const [selectedItem, setSelectedItem] = useState({
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

  const selectItem = item => {
    setSelectedItem({
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
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          style={{
            paddingHorizontal: moderateScale(20),
            marginTop: moderateScale(20),
            flex: 1,
          }}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.header_view}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editButton}>
              <Image source={Icons.edit} style={styles.edit_image} />
            </TouchableOpacity>
            <Image source={Images.extraImage} style={styles.profile_image} />
            <Text style={styles.user_name}>Aryan Abadeh</Text>
            <View style={styles.gender_view}>
              <Image source={Icons.GenderIcon} style={styles.gender_icon} />
              <Text style={styles.gender_text}>Male</Text>
            </View>
            <View style={styles.horizontal_line} />
            <View style={styles.details_view}>
              <Image
                source={Icons.pin}
                style={{width: moderateScale(10), height: moderateScale(12)}}
              />
              <Text style={styles.test_style}>K1A0B1</Text>
              <Image
                source={Icons.Phone}
                style={{
                  width: moderateScale(12),
                  height: moderateScale(12),
                  marginLeft: moderateScale(12),
                }}
              />
              <Text style={styles.test_style}>1 (647) 948-6676</Text>
              <Image
                source={Icons.Calender}
                style={{
                  width: moderateScale(10),
                  height: moderateScale(12),
                  marginLeft: moderateScale(12),
                }}
              />
              <Text style={styles.test_style}>9 Sept, 1998</Text>
            </View>
          </View>

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
                placeholder="Enter phone number here..."
                keyboardType="number-pad"
                value={number}
                maxLength={10}
                onChangeText={val => setNumber(val)}
                placeholderTextColor={Colors.gray[500]}
              />
              {/* {number.length === 0 ? null : (
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
              )} */}
            </View>
          </View>

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
            buttonPress={() => navigation.navigate('DentalStaffTab')}
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

  // Dropdown
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
});
