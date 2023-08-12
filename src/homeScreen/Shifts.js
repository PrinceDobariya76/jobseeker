/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {AirbnbRating} from 'react-native-ratings';
import RBSheet from 'react-native-raw-bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';
import ConformationModal from '../Component/HomeComponent/ConformationModal';
import JobilstComp from '../Component/HomeComponent/JobDetails';
import MainHeader from '../Component/HomeComponent/MainHeader';
import YesNoButton from '../Component/HomeComponent/YesNoButton';
import {Utils} from '../ConstantLibrary/react-native-calendar-picker/CalendarPicker/Utils';
import {apiConst, GET, POST, PUT} from '../helper/apiConstants';
import makeAPIRequest from '../helper/global';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {JobList} from '../theme/ConstantArray';
import {Icons} from '../theme/icons';
import {Images} from '../theme/images';
import {horizontalScale, moderateScale, verticalScale} from '../theme/scalling';

const getDateFromDateAndHour = (userDate, userTime) => {
  const dateArray = userDate?.split('/');
  const timeSplittedArray = userTime?.split(':');
  const isAM = timeSplittedArray?.[1]?.slice(2)?.toLowerCase() === 'am';
  const timeArray = timeSplittedArray?.map((item, index) => {
    if (index === 0) {
      if (isAM) {
        return item;
      } else {
        return (Number(item) + 12).toString();
      }
    }
    return item.slice(0, 2);
  });

  return new Date(
    dateArray?.[2],
    (Number(dateArray?.[1]) - 1).toString(),
    dateArray?.[0],
    timeArray?.[0],
    timeArray?.[1],
  );
};

const hourDiff = (startDate, startTime, endDate, endTime) => {
  const timeDiff =
    getDateFromDateAndHour(endDate, endTime).getTime() -
    getDateFromDateAndHour(startDate, startTime).getTime();

  return Math.floor(timeDiff / (1000 * 60 * 60));
};

const Shifts = ({navigation}) => {
  const reviewBox = [
    {
      rating: 0,
      review: '1. How would you rate their work standards?',
    },
    {
      rating: 0,
      review: '2. Was the staff polite and professional?',
    },
    {
      rating: 0,
      review: '3. How much did you like working there?',
    },
  ];
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(true);
  const [openConfirmationModal, SetOpenConfirmationModal] = useState(false);
  const [isItem, setIsItem] = useState();
  const [jobData, setJobData] = useState(JobList);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format('MMM DD,YYYY'),
  );
  const [selectedStartDate, setSelectedStartDate] = useState(
    moment(new Date()).format('MMM DD,YYYY'),
  );
  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
  const [shiftData, setShiftData] = useState([]);
  const [shistDetail, setShistDetail] = useState({});
  const [totalShift, setTotalShift] = useState(0);

  const [currentPage, setCurrentPage] = useState(2);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(true);
  const [mainLoading, setMainLoading] = useState(false);
  const [hourlyRate, setHourlyRate] = useState();
  const [hourWorked, setHourWorked] = useState();
  const [reviews, setReviews] = useState(reviewBox);
  const [profileUrl, setProfileUrl] = useState('');

  const refRBSheet2 = useRef();
  const refRBSheet1 = useRef();

  const likeOrdislikeJob = () => {
    let temp = jobData;

    temp.map((mapItem, mapIndex) => {
      if (mapItem.id === isItem.id) {
        if (mapItem.isFavourite !== undefined) {
          if (mapItem.isFavourite === true) {
            mapItem.isFavourite = false;
          } else {
            mapItem.isFavourite = true;
          }
        } else {
          temp[mapIndex] = {...mapItem, isFavourite: true};
        }
      }
    });
    // console.log('temp :::', JSON.stringify(temp));
    setJobData([...temp]);
    SetOpenConfirmationModal(false);
  };

  const getUserProfileDetails = async () => {
    setMainLoading(true);
    return makeAPIRequest({
      method: GET,
      url: apiConst.getUserProfileDetails,
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        setProfileUrl(response?.data?.data?.avatar ?? '');
      })
      .catch(() => {
        setMainLoading(false);
      });
  };

  useEffect(() => {
    if (isFocused) {
      getUserProfileDetails();
    }
  }, [isFocused]);

  const selectdDate = date => {
    if (date !== null) {
      setStartDate(moment(date).format('MMM DD,YYYY'));
      setSelectedStartDate(date);
      setDatePickerVisibility(!isDatePickerVisible);
      getShifts(moment(date).format('YYYY-MM-DD'));
    } else {
      // console.log('Invalid Date :::');
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused && !isDatePickerVisible) {
      setDatePickerVisibility(true);
    }
  }, [isDatePickerVisible, isFocused]);

  const getShifts = async formattedDate => {
    setMainLoading(true);
    makeAPIRequest({
      method: GET,
      url: apiConst.getShifts(1, formattedDate),
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        setTotalShift(response.data.data.meta.total);
        setShiftData(response.data.data.results);
      })
      .catch(error => {
        setMainLoading(false);
        //  console.log('error', error);
      });
  };

  const sendInvoiceToShiftClinic = async () => {
    setMainLoading(true);
    return makeAPIRequest({
      method: POST,
      url: apiConst.sendInvoiceToShiftClinic(shistDetail.id),
      token: true,
      data: {
        hourlyRate: hourlyRate,
        numHours: hourWorked,
      },
    })
      .then(response => {
        setMainLoading(false);
        // console.log('response', response.data);
        refRBSheet2.current.close();
      })
      .catch(error => {
        setMainLoading(false);
        // console.log('error', error.response.data);
      });
  };

  const reviewShiftClinic = async () => {
    setMainLoading(true);
    let data = JSON.stringify({
      reviews: reviews,
    });

    return makeAPIRequest({
      method: POST,
      url: apiConst.reviewShiftClinic(shistDetail.id),
      token: true,
      data: data,
    })
      .then(response => {
        setMainLoading(false);
        console.log('response', response.data);
        setOpenReviewModal(false);
      })
      .catch(error => {
        setMainLoading(false);
        // console.log('error', error.response.data);
      });
  };

  const cancelShifts = async () => {
    setMainLoading(true);
    let data = JSON.stringify({
      reason: 'I got a better deal somewhere else.',
    });
    return makeAPIRequest({
      method: PUT,
      url: apiConst.cancelShifts(shistDetail.id),
      token: true,
      data: data,
    })
      .then(response => {
        setMainLoading(false);
        // console.log('response', response.data);
        setShistDetail({});
        refRBSheet1.current.close();
      })
      .catch(error => {
        setMainLoading(false);
        // console.log('error', error.response.data);
      });
  };

  const onEndReached = async () => {
    if (pageCount === true) {
      setLoading(true);
      return makeAPIRequest({
        method: GET,
        url: apiConst.getShifts(
          currentPage,
          moment(selectedStartDate).format('YYYY-MM-DD'),
        ),
        token: true,
      })
        .then(response => {
          setLoading(false);
          let pageCount = response.data.data.meta.currentPage;
          let currentCount = currentPage;
          {
            pageCount <= currentCount
              ? setPageCount(false)
              : setPageCount(true);
          }
          setCurrentPage(currentPage + 1);
          setShiftData([...shiftData, ...response.data.data.results]);
        })
        .catch(error => {
          // console.log('error', error.response.data);
        });
    }
  };

  const onPressReview = item => {
    setShistDetail(item);
    setOpenReviewModal(true);
    setReviews(
      item.clinic.reviewByApplicant.length === 0
        ? reviewBox
        : item.clinic.reviewByApplicant,
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <MainHeader
        isShowLogo={false}
        text="Shifts"
        bellAction={() => navigation.navigate('Notification')}
        openProfile={() => navigation.navigate('MyProfile')}
        profileUrl={profileUrl}
      />
      <AcitvityLoader visible={mainLoading} />
      <View style={{padding: moderateScale(20), backgroundColor: Colors.white}}>
        <View style={styles.calender_view}>
          <TouchableOpacity
            style={styles.calender_first_View}
            onPress={showDatePicker}>
            <Image
              source={Icons.calenda_outline}
              style={styles.calender_image}
            />
            <Text style={styles.date_text}>
              {startDate == '' ? 'select Date' : startDate}
            </Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.openJob_text}>
              {totalShift}
              {totalShift <= 1 ? ' Job ' : ' Jobs '}Open
            </Text>
          </View>
        </View>
        {isDatePickerVisible && (
          <CalendarPicker
            selectedStartDate={selectedStartDate}
            onDateChange={selectdDate}
            selectedDayTextColor="#FFFFFF"
            selectedRangeStyle={{backgroundColor: Colors.blue[500]}}
            selectedRangeStartStyle={{backgroundColor: Colors.blue[500]}}
            selectedRangeEndStyle={{backgroundColor: Colors.blue[500]}}
          />
        )}
        <TouchableOpacity
          style={styles.openCalender_button}
          onPress={showDatePicker}
        />
      </View>
      <FlatList
        data={shiftData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flex: 1}}
        ListEmptyComponent={
          !isDatePickerVisible && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataFound}>no data found</Text>
            </View>
          )
        }
        onEndReached={() => !onEndReachedCalled && !loading && onEndReached()}
        onEndReachedThreshold={0.1}
        onMomentumScrollBegin={() => setOnEndReachedCalled(false)}
        renderItem={({item, index}) => {
          return (
            <>
              <JobilstComp
                index={index}
                item={item}
                lastView={'Shift'}
                arraylength={JobList.length - 1}
                status={'completed'}
                send_invoice={() => {
                  setShistDetail(item);
                  setHourlyRate((item?.shift?.price ?? '').slice(1, 3));
                  refRBSheet2.current.open();
                }}
                reviewModall={() => onPressReview(item)}
                likePress={() => {
                  SetOpenConfirmationModal(true);
                  setIsItem(item);
                }}
                cancelShift={() => {
                  refRBSheet1.current.open();
                }}
              />
            </>
          );
        }}
      />
      <RBSheet
        ref={refRBSheet2}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: Colors.gray[300],
          },
          container: {
            borderTopLeftRadius: moderateScale(20),
            borderTopRightRadius: moderateScale(20),
          },
        }}
        height={verticalScale(410)}
        openDuration={250}>
        <AcitvityLoader visible={mainLoading} />
        <View style={styles.rbsheet_mainView}>
          <Text style={styles.rbSheet_header_text}>Send Invoice</Text>
          <Text style={styles.textInpute_titlle}>Total Hours Worked*</Text>
          <View style={styles.textinpute_view}>
            <TextInput
              autoFocus
              style={styles.textinpute}
              placeholder={'Enter here...'}
              placeholderTextColor={Colors.gray[500]}
              onChangeText={text => setHourWorked(text)}
              keyboardType={'number-pad'}
            />
            <Text style={styles.hours_text}>Hours</Text>
          </View>
          <Text style={styles.textInpute_titlle}>
            Hourly Price (You were hired at $45/Hr) *
          </Text>
          <View style={styles.textinpute_view}>
            <TextInput
              style={styles.textinpute}
              placeholder={'Enter here...'}
              placeholderTextColor={Colors.gray[500]}
              value={hourlyRate}
              onChangeText={text => setHourlyRate(text)}
              keyboardType={'number-pad'}
            />
          </View>
          {(shistDetail?.shift?.price ?? '').slice(1, 3) !== hourlyRate && (
            <View
              style={{
                padding: moderateScale(13),
                marginVertical: moderateScale(10),
                backgroundColor: Colors.red[50],
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Icons.alert_circle}
                  style={{width: moderateScale(20), height: moderateScale(20)}}
                />
                <Text
                  style={{
                    color: Colors.red[500],
                    fontFamily: Fonts.satoshi_bold,
                    marginLeft: moderateScale(5),
                  }}>
                  Attention
                </Text>
              </View>
              <Text
                style={{
                  color: Colors.red[500],
                  fontFamily: Fonts.satoshi_regular,
                  marginLeft: moderateScale(5),
                  textAlign: 'justify',
                  marginTop: moderateScale(5),
                  fontSize: moderateScale(13),
                }}>
                You are changing the Hourly Price at which this clinic hired
                you. Please note that this can lead to payment disputes in
                future. Talk to the clinic owner before sending the invoice.
              </Text>
            </View>
          )}
          <YesNoButton
            first_button_backgroundColor={Colors.borderColor}
            first_button_color={Colors.black}
            first_button_text={'Do it later'}
            second_button_backgroundColor={Colors.sky_color}
            second_button_color={Colors.white}
            second_button_text={'Send invoice'}
            first_button_call={() => refRBSheet2.current.close()}
            second_button_call={sendInvoiceToShiftClinic}
            flex1={1}
            flex2={1}
            second_button_image={false}
          />
        </View>
      </RBSheet>
      <RBSheet
        ref={refRBSheet1}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: Colors.gray[300],
          },
          container: {
            borderTopLeftRadius: moderateScale(20),
            borderTopRightRadius: moderateScale(20),
          },
        }}
        height={470}
        openDuration={250}>
        <View style={{padding: 15}}>
          <Text
            style={{
              fontFamily: Fonts.satoshi_bold,
              color: Colors.gray[900],
              fontSize: moderateScale(24),
            }}>
            Cancelling this shift?
          </Text>
          <Text
            style={{
              fontFamily: Fonts.satoshi_medium,
              color: Colors.gray[900],
              fontSize: moderateScale(16),
              marginTop: verticalScale(20),
            }}>
            Please select your reason for cancelling
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderColor: Colors.gray[200],
              borderWidth: 1,
              borderRadius: moderateScale(4),
              paddingHorizontal: horizontalScale(15),
              paddingVertical: verticalScale(10),
              marginVertical: verticalScale(10),
            }}>
            <Text
              style={{
                fontFamily: Fonts.satoshi_regular,
                color: Colors.gray[900],
                fontSize: moderateScale(14),
              }}>
              I got a better deal somewhere else.
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={25}
              color={Colors.black}
            />
          </View>
          <View
            style={{
              backgroundColor: Colors.red[50],
              padding: 15,
              marginTop: verticalScale(10),
              borderRadius: 4,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={Icons.alert_circle}
                style={{width: moderateScale(20), height: moderateScale(20)}}
              />
              <Text
                style={{
                  fontFamily: Fonts.satoshi_bold,
                  color: Colors.red[500],
                  fontSize: moderateScale(16),
                  marginLeft: horizontalScale(5),
                }}>
                Attention
              </Text>
            </View>
            <Text
              style={{
                fontFamily: Fonts.satoshi_regular,
                color: Colors.red[500],
                fontSize: moderateScale(14),
                textAlign: 'justify',
                marginTop: verticalScale(10),
              }}>
              You are cancelling with less than 12 hrs left! Shiftable strives
              to maintain balance in commitments. If you cancel now, your time
              slot of
              <Text style={{fontFamily: Fonts.satoshi_bold}}>
                2:30 pm - 6:30 pm
                {/* {`${shistDetail.shift.startTime}-${shistDetail.shift.endTime}`} */}
              </Text>
              will be blocked for
              <Text style={{fontFamily: Fonts.satoshi_bold}}>1 hour</Text>.
              During this you won’t be able to see any jobs which overlaps with
              this time slot.
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', paddingVertical: verticalScale(15)}}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#E5E7EB',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: verticalScale(20),
                borderRadius: moderateScale(5),
              }}
              onPress={() => refRBSheet1.current.close()}>
              <Text
                style={{
                  fontFamily: Fonts.satoshi_bold,
                  color: '#111827',
                  fontSize: moderateScale(15),
                }}>
                I changed my mind
              </Text>
            </TouchableOpacity>
            <View style={{flex: 0.1}} />
            <TouchableOpacity
              onPress={() => {
                cancelShifts();
              }}
              style={{
                // backgroundColor: Colors.red[50],
                flex: 1,
                backgroundColor: '#E5E7EB',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: verticalScale(20),
                borderRadius: moderateScale(5),
              }}>
              <Text
                style={{
                  // color: Colors.red[500],
                  fontFamily: Fonts.satoshi_bold,
                  color: '#111827',
                  fontSize: moderateScale(15),
                }}>
                Cancel Anyway
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
      <Modal
        transparent={true}
        visible={openReviewModal}
        onRequestClose={() => setOpenReviewModal(false)}>
        <View style={{flex: 1}}>
          <AcitvityLoader visible={mainLoading} />
          <Image
            source={Images.BlackBackground}
            style={styles.modal_backgroundimage}
          />
          <View style={styles.review_modal}>
            <Text
              style={[
                styles.rbSheet_header_text,
                {fontSize: moderateScale(17)},
              ]}>
              {shistDetail?.clinic?.name ?? ''}
            </Text>
            <View style={styles.rating_mainView}>
              <View style={styles.rating_view}>
                <Image source={Icons.star} style={styles.start_image} />
                <Text style={styles.reviewrate_text}>{`${
                  shistDetail?.clinic?.rating?.average ?? ''
                } (${shistDetail?.clinic?.rating?.totalCount})`}</Text>
              </View>
              <View
                style={[styles.rating_view, {marginLeft: moderateScale(12)}]}>
                <Image
                  source={Icons.pin}
                  style={[styles.start_image, {width: moderateScale(10)}]}
                />
                <Text style={styles.reviewrate_text}>{`${
                  shistDetail?.clinic?.pinCode ?? ''
                } | ${shistDetail?.clinic?.distance ?? ''}`}</Text>
              </View>
            </View>
            <View style={styles.rating_mainView}>
              <Text
                style={[
                  styles.reviewrate_text,
                  {
                    fontSize: moderateScale(13),
                    color: Colors.black,
                    fontFamily: Fonts.satoshi_medium,
                  },
                ]}>
                {moment(Utils.getDate(shistDetail?.shift?.endDate)).format(
                  'MMM DD YYYY',
                )}
              </Text>
              <Image
                source={Icons.Dote}
                style={{
                  tintColor: Colors.gray[200],
                  marginHorizontal: moderateScale(10),
                }}
              />
              <Text
                style={[
                  styles.reviewrate_text,
                  {
                    fontSize: moderateScale(13),
                    color: Colors.black,
                    fontFamily: Fonts.satoshi_medium,
                  },
                ]}>
                {`${hourDiff(
                  shistDetail?.shift?.startDate,
                  shistDetail?.shift?.startTime,
                  shistDetail?.shift?.endDate,
                  shistDetail?.shift?.endTime,
                )} Hrs`}
              </Text>
              <Image
                source={Icons.Dote}
                style={{
                  tintColor: Colors.gray[200],
                  marginHorizontal: moderateScale(10),
                }}
              />
              <Text
                style={[
                  styles.reviewrate_text,
                  {
                    fontSize: moderateScale(13),
                    color: Colors.black,
                    fontFamily: Fonts.satoshi_medium,
                  },
                ]}>
                {shistDetail?.shift?.price && `${shistDetail?.shift?.price}/hr`}
              </Text>
            </View>
            <FlatList
              contentContainerStyle={styles.review_modal_rating_view}
              data={reviews}
              renderItem={({item, index}) => (
                <View>
                  <Text
                    style={StyleSheet.flatten([
                      styles.review_modal_rating_question,
                      index !== 0 && {
                        marginTop: moderateScale(13),
                      },
                    ])}>
                    {item.review}
                  </Text>
                  <View
                    style={{
                      alignItems: 'flex-start',
                      marginTop: moderateScale(3),
                    }}>
                    <AirbnbRating
                      count={5}
                      defaultRating={item.rating}
                      size={17}
                      reviews={[]}
                      isDisabled={
                        !(shistDetail?.clinic?.reviewByApplicant?.length === 0)
                      }
                      showRating={false}
                      onFinishRating={value => {
                        let updatedReview = reviews.map((reviewItem, key) => {
                          if (key === index) {
                            return {
                              ...reviewItem,
                              rating: value,
                            };
                          } else {
                            return reviewItem;
                          }
                        });
                        setReviews(updatedReview);
                      }}
                    />
                  </View>
                </View>
              )}
            />
            <YesNoButton
              first_button_backgroundColor={Colors.borderColor}
              first_button_color={Colors.black}
              first_button_text={'Cancel'}
              // second_button_backgroundColor={Colors.sky_color}
              second_button_backgroundColor={
                shistDetail?.clinic?.reviewByApplicant?.length === 0
                  ? Colors.sky_color
                  : Colors.borderColor
              }
              second_button_disable={
                !(shistDetail?.clinic?.reviewByApplicant?.length === 0)
              }
              second_button_color={Colors.white}
              second_button_text={'Submit Review'}
              first_button_call={() => setOpenReviewModal(false)}
              second_button_call={() => reviewShiftClinic()}
              flex1={1}
              flex2={1}
              second_button_image={false}
            />
          </View>
        </View>
      </Modal>
      <ConformationModal
        NoButton={() => SetOpenConfirmationModal(false)}
        YesButton={() => likeOrdislikeJob()}
        header={
          isItem !== undefined && isItem.isFavourite === true
            ? 'Do you want to remove this job from favorites?'
            : 'Do you want to add this job to favorites?'
        }
        no_text="No"
        openConfirmationModal={openConfirmationModal}
        yes_text="Yes"
      />
    </SafeAreaView>
  );
};
export default Shifts;

const styles = StyleSheet.create({
  calender_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calender_first_View: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calender_image: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  date_text: {
    color: Colors.gray[700],
    fontFamily: Fonts.satoshi_medium,
    marginLeft: moderateScale(7),
  },
  openJob_text: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.satoshi_regular,
    color: Colors.gray[700],
  },
  openCalender_button: {
    width: moderateScale(60),
    height: moderateScale(4),
    backgroundColor: Colors.gray[300],
    marginTop: moderateScale(25),
    alignSelf: 'center',
    borderRadius: moderateScale(100),
  },
  ///rbSheet
  rbsheet_mainView: {
    backgroundColor: Colors.white,
    padding: moderateScale(15),
  },
  rbSheet_header_text: {
    color: Colors.black,
    fontSize: moderateScale(20),
    fontFamily: Fonts.satoshi_bold,
  },
  textInpute_titlle: {
    color: Colors.black,
    fontSize: moderateScale(14),
    fontFamily: Fonts.satoshi_medium,
    marginTop: moderateScale(15),
  },
  textinpute_view: {
    borderWidth: 1,
    paddingHorizontal: moderateScale(10),
    borderColor: Colors.gray[200],
    borderRadius: moderateScale(4),
    marginTop: moderateScale(7),
    flexDirection: 'row',
    alignItems: 'center',
  },
  textinpute: {
    color: Colors.black,
    flex: 1,
    fontFamily: Fonts.satoshi_regular,
    padding: moderateScale(10),
  },
  hours_text: {
    flex: 0.25,
    color: Colors.gray[500],
    textAlign: 'center',
    fontFamily: Fonts.satoshi_regular,
  },

  // Review modal
  reviewrate_text: {
    color: Colors.gray[500],
    fontSize: moderateScale(12),
    fontFamily: Fonts.satoshi_regular,
    marginLeft: moderateScale(4),
  },
  start_image: {
    width: moderateScale(12),
    height: moderateScale(12),
  },
  rating_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating_mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(7),
  },
  review_modal: {
    backgroundColor: Colors.white,
    marginTop: Dimensions.get('window').height / 4,
    marginHorizontal: moderateScale(15),
    padding: moderateScale(20),
  },
  modal_backgroundimage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    opacity: 0.5,
  },
  review_modal_rating_view: {
    backgroundColor: Colors.lightblue,
    marginTop: moderateScale(10),
    padding: moderateScale(10),
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  review_modal_rating_question: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(13),
    color: Colors.black,
    fontFamily: Fonts.satoshi_medium,
  },
  // /noDataFound
  noDataFound: {
    fontSize: moderateScale(15),
    color: 'black',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
