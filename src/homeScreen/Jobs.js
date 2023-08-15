/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';
import ButtonHeader from '../Component/HomeComponent/ButtonHeader';
import ConformationModal from '../Component/HomeComponent/ConformationModal';
import JobilstComp from '../Component/HomeComponent/JobDetails';
import MainHeader from '../Component/HomeComponent/MainHeader';
import {apiConst, DELETE, GET, POST, PUT} from '../helper/apiConstants';
import makeAPIRequest from '../helper/global';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {Icons} from '../theme/icons';
import {moderateScale} from '../theme/scalling';

const Jobs = ({navigation}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(true);
  const [selectButton, setSelectButton] = useState(1);
  const [openConfirmationModal, SetOpenConfirmationModal] = useState(false);
  const [isItem, setIsItem] = useState();
  const [profileUrl, setProfileUrl] = useState('');
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format('MMM DD,YYYY'),
  );
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [Data, setData] = useState([]);
  const [applyData, setApplyData] = useState([]);
  const [jobDetail, setJobDetail] = useState({});
  const [currentPage, setCurrentPage] = useState(2);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(true);
  const [totalOpenJob, setTotalOpenJob] = useState(0);
  const [totalAppliedJob, setTotalAppliedJob] = useState(0);
  const [currentPageAppliedJob, setCurrentPageAppliedJob] = useState(2);
  const [pageCountAppliedJob, setPageCountAppliedJob] = useState(true);
  const [mainLoading, setMainLoading] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const addFavorites = async id => {
    setMainLoading(true);
    return makeAPIRequest({
      method: POST,
      url: apiConst.addFavorites(id),
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        setIsItem();
        SetOpenConfirmationModal(false);
        console.log('response', response.data);
      })
      .catch(error => {
        setMainLoading(false);
        SetOpenConfirmationModal(false);
        console.log('error--', error);
      });
  };

  const removeFavorites = async id => {
    setMainLoading(true);
    return makeAPIRequest({
      method: DELETE,
      url: apiConst.removeFavorites(id),
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        setIsItem();
        SetOpenConfirmationModal(false);
        console.log('responseREmove', response.data);
      })
      .catch(error => {
        setMainLoading(false),
          SetOpenConfirmationModal(false),
          console.log('error123', error.response.data);
      });
  };

  const likeOrdislikeJob = () => {
    if (isItem.favorite) {
      removeFavorites(isItem.id);
    } else {
      addFavorites(isItem.id);
    }
  };

  const selectdDate = date => {
    if (date !== null) {
      setStartDate(moment(date).format('MMM DD,YYYY'));
      setSelectedStartDate(date);
      setDatePickerVisibility(!isDatePickerVisible);
      if (selectButton === 1) {
        getJObs(moment(date).format('YYYY-MM-DD'));
      } else {
        getAppliedJobs(moment(date).format('YYYY-MM-DD'));
      }
    } else {
      console.log('Invalid Date :::');
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    setPageCount(true);
    setPageCountAppliedJob(true);
  }, []);

  useEffect(() => {
    if (!isFocused) {
      if (selectButton === 2) {
        setSelectButton(1);
      }
      if (!isDatePickerVisible) {
        setDatePickerVisibility(true);
      }
    }
  }, [isFocused, selectButton, isDatePickerVisible]);

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

  useEffect(() => {
    setDatePickerVisibility(true);
  }, [selectButton]);

  const getJObs = async date => {
    setMainLoading(true);
    return makeAPIRequest({
      method: GET,
      url: apiConst.getOpenedJobs(1, date),
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        setTotalOpenJob(response.data.data.meta.total);
        // console.log("response",response.data.data.meta.total);
        // console.log("response",response.data.data.meta.currentPage);
        // console.log("response",response.data.data.meta.totalPages);

        setData(response.data.data.results);
      })
      .catch(error => {
        setMainLoading(false);
        console.log('error', error.response.data);
      });
  };

  const getAppliedJobs = async date => {
    setMainLoading(true);
    return makeAPIRequest({
      method: GET,
      url: apiConst.getAppliedJobs(1, date),
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        setTotalAppliedJob(response.data.data.meta.total);
        setApplyData(response.data.data.results);
      })
      .catch(error => {
        setMainLoading(false);
        console.log('error', error);
      });
  };

  const cancelJobForClinic = async () => {
    setMainLoading(true);
    let data = JSON.stringify({
      reason: 'I got a better deal somewhere else.',
    });
    return makeAPIRequest({
      method: PUT,
      url: apiConst.cancelJobForClinic(jobDetail.id),
      token: true,
      data: data,
    })
      .then(response => {
        console.log('response', response.data);
        setJobDetail({});
        setOpenCancelModal(false);
        setMainLoading(false);
      })
      .catch(error => {
        console.log('error', error.response.data);
        setMainLoading(false);
      });
  };

  const onEndReachedOpen = async () => {
    if (pageCount == true) {
      setLoading(true);
      return makeAPIRequest({
        method: GET,
        url: apiConst.getOpenedJobs(currentPage),
        token: true,
      })
        .then(response => {
          console.log('response', response.data.data);
          setLoading(false);
          let pageCount = response.data.data.meta.currentPage;
          let currentCount = currentPage;
          {
            pageCount <= currentCount
              ? setPageCount(false)
              : setPageCount(true);
          }
          setCurrentPage(currentPage + 1);
          setData([...Data, ...response.data.data.results]);
        })
        .catch(error => console.log('error', error));
    }
  };

  const onEndReachedClosed = () => {
    if (pageCountAppliedJob === true) {
      setLoading(true);
      return makeAPIRequest({
        method: GET,
        url: apiConst.getAppliedJobs(currentPageAppliedJob),
        token: true,
      })
        .then(response => {
          console.log('123165');
          setLoading(false);
          let pageCountAppliedJob = response.data.data.meta.currentPage;
          let currentCount1 = currentPageAppliedJob;
          {
            pageCountAppliedJob <= currentCount1
              ? setPageCountAppliedJob(false)
              : setPageCountAppliedJob(true);
          }
          setCurrentPageAppliedJob(currentPageAppliedJob + 1);
          setApplyData([...applyData, ...response.data.data.results]);
        })
        .catch(error => console.log('error', error));
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F5F5F5',
      }}>
      <AcitvityLoader visible={mainLoading} />
      <MainHeader
        isShowLogo={true}
        bellAction={() => navigation.navigate('Notification')}
        openProfile={() => navigation.navigate('MyProfile')}
        profileUrl={profileUrl}
      />
      <ButtonHeader
        first_button="Open Jobs"
        second_button="Applied Jobs"
        selectFirstButton={() => {
          setSelectButton(1);
        }}
        selectsecondButton={() => {
          setSelectButton(2);
        }}
        selectedButton={selectButton}
      />

      <>
        <View
          style={{padding: moderateScale(20), backgroundColor: Colors.white}}>
          <View style={styles.calender_view}>
            <TouchableOpacity
              style={styles.calender_first_View}
              onPress={showDatePicker}>
              <Image
                source={Icons.calenda_outline}
                style={styles.calender_image}
              />
              <Text style={styles.date_text}>
                {startDate === '' ? 'select Date' : startDate}
              </Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.openJob_text}>
                {selectButton == 1 ? totalOpenJob : totalAppliedJob} Jobs Open
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
        {selectButton === 1 ? (
          // Open Jobs Top Tab
          <FlatList
            // data={jobData}
            data={Data}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <>
                  <JobilstComp
                    index={index}
                    item={item}
                    lastView={'Openjob'}
                    arraylength={Data.length - 1}
                    navigation={navigation}
                    likePress={() => {
                      SetOpenConfirmationModal(true), setIsItem(item);
                    }}
                    cancelModal={() => {
                      setJobDetail(item), setOpenCancelModal(true);
                    }}
                  />
                </>
              );
            }}
            onEndReached={() =>
              !onEndReachedCalled && !loading && onEndReachedOpen()
            }
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => setOnEndReachedCalled(false)}
          />
        ) : (
          // Applied Jobs Top Tab
          <FlatList
            // data={jobData}
            data={applyData}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              console.log('item', item);
              return (
                <>
                  <JobilstComp
                    index={index}
                    item={item}
                    lastView={'Appliedjobs'}
                    arraylength={applyData.length - 1}
                    navigation={navigation}
                    likePress={() => {
                      SetOpenConfirmationModal(true), setIsItem(item);
                    }}
                    cancelModal={() => {
                      setJobDetail(item), setOpenCancelModal(true);
                    }}
                  />
                </>
              );
            }}
            onEndReached={() =>
              !onEndReachedCalled && !loading && onEndReachedClosed()
            }
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => setOnEndReachedCalled(false)}
          />
        )}
        {/* <FlatList
            // data={jobData}
            data={selectButton === 1 ? Data : applyData}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <>
                  <JobilstComp
                    index={index}
                    item={item}
                    lastView={selectButton === 1 ? 'Openjob' : 'Appliedjobs'}
                    arraylength={JobList.length - 1}
                    navigation={navigation}
                    likePress={() => {
                      SetOpenConfirmationModal(true), setIsItem(item);
                    }}
                    cancelModal={() => {
                      setJobDetail(item), setOpenCancelModal(true);
                    }}
                  />
                </>
              );
            }}
            onEndReached={() =>
              !onEndReachedCalled && !loading && onEndReached()
            }
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => setOnEndReachedCalled(false)}
          /> */}
      </>
      <ConformationModal
        NoButton={() => SetOpenConfirmationModal(false)}
        YesButton={() => likeOrdislikeJob()}
        header={
          isItem !== undefined && isItem.favorite === true
            ? 'Do you want to remove this job from favorites?'
            : 'Do you want to add this job to favorites?'
        }
        no_text="No"
        openConfirmationModal={openConfirmationModal}
        yes_text="Yes"
        loading={mainLoading}
      />
      <ConformationModal
        NoButton={() => setOpenCancelModal(false)}
        YesButton={() => cancelJobForClinic()}
        header={'Do you want to Cancel this job?'}
        no_text="No"
        openConfirmationModal={openCancelModal}
        yes_text="Yes"
        loading={mainLoading}
      />
    </SafeAreaView>
  );
};
export default Jobs;

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
});
