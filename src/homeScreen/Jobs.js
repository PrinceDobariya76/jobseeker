/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import React, {useMemo, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import MainHeader from '../Component/HomeComponent/MainHeader';
import {Fonts} from '../theme';
import Colors from '../theme/Colors';
import {moderateScale} from '../theme/scalling';
import ButtonHeader from '../Component/HomeComponent/ButtonHeader';
import {Icons} from '../theme/icons';
import {JobList} from '../theme/ConstantArray';
import JobilstComp from '../Component/HomeComponent/JobDetails';
import ConformationModal from '../Component/HomeComponent/ConformationModal';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';
import makeAPIRequest from '../helper/global';
import {DELETE, GET, POST, PUT, apiConst} from '../helper/apiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';

const Jobs = ({navigation}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectButton, setSelectButton] = useState(1);
  const initDate = '2023-02-26';
  const [selected, setSelected] = useState(initDate);
  // const [day, setDay] = useState('26');
  // const [month, setMonth] = useState('February');
  // const [year, setYear] = useState('2023');
  const [openConfirmationModal, SetOpenConfirmationModal] = useState(false);
  const [isItem, setIsItem] = useState();
  // const [jobData, setJobData] = useState(JobList);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format('MMM DD,YYYY'),
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format('MMM DD,YYYY'),
  );
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
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

  // const marked = useMemo(
  //   () => ({
  //     [selected]: {
  //       selected: true,
  //       selectedColor: Colors.yellow[400],
  //     },
  //   }),
  //   [selected],
  // );

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
      if (!startDate) {
        setStartDate(moment(date).format('MMM DD,YYYY'));
        setSelectedStartDate(date);
      } else if (!endDate) {
        setSelectedEndDate(date);
        setEndDate(moment(date).format('MMM DD,YYYY'));
        setDatePickerVisibility(!isDatePickerVisible);
      } else {
        setStartDate(moment(date).format('MMM DD,YYYY'));
        setSelectedStartDate(date);
        setEndDate('');
        setSelectedEndDate('');
      }
    } else {
      console.log('Invalid Date :::');
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    setPageCount(true);
    setPageCountAppliedJob(true);
    if (isFocused) {
      selectButton == 1 ? getJObs() : getAppliedJobs();
    }
  }, [isFocused, selectButton]);

  const getJObs = async () => {
    setMainLoading(true);
    return makeAPIRequest({
      method: GET,
      url: apiConst.getOpenedJobs(1),
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
        setMainLoading(false), console.log('error', error.response.data);
      });
  };

  const getAppliedJobs = async () => {
    setMainLoading(true);
    return makeAPIRequest({
      method: GET,
      url: apiConst.getAppliedJobs(1),
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        setTotalAppliedJob(response.data.data.meta.total);
        setApplyData(response.data.data.results);
      })
      .catch(error => {
        setMainLoading(false), console.log('error', error);
      });
  };

  const cancelJobForClinic = async () => {
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
      })
      .catch(error => console.log('error', error.response.data));
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
      <MainHeader
        isShowLogo={true}
        bellAction={() => navigation.navigate('Notification')}
        openProfile={() => navigation.navigate('MyProfile')}
      />
      <ButtonHeader
        first_button="Open Jobs"
        second_button="Applied Jobs"
        selectFirstButton={() => setSelectButton(1)}
        selectsecondButton={() => setSelectButton(2)}
        selectedButton={selectButton}
      />
      <AcitvityLoader visible={mainLoading} />
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
                {startDate == '' ? 'select Date' : startDate}
              </Text>
              <Image
                source={Icons.Dote}
                style={{marginLeft: moderateScale(5)}}
              />
              <Text style={styles.date_text}>{endDate}</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.openJob_text}>
                {selectButton == 1 ? totalOpenJob : totalAppliedJob} Jobs Open
              </Text>
            </View>
          </View>
          {isDatePickerVisible && (
            <CalendarPicker
              multipleDates={[startDate, endDate]}
              allowRangeSelection={true}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              onDateChange={selectdDate}
              // minDate={new Date()}
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
            ? ' Do you want to remove this job from favorites?'
            : 'Do you want to add this job to favorites?'
        }
        no_text="No"
        openConfirmationModal={openConfirmationModal}
        yes_text="Yes"
      />
      <ConformationModal
        NoButton={() => setOpenCancelModal(false)}
        YesButton={() => cancelJobForClinic()}
        header={'Do you want to Cancel this job?'}
        no_text="No"
        openConfirmationModal={openCancelModal}
        yes_text="Yes"
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
