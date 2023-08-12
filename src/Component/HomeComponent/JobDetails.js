/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '../../theme';
import Colors from '../../theme/Colors';
import {Icons} from '../../theme/icons';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../theme/scalling';
import YesNoButton from './YesNoButton';

const getHour = (userDate, userTime) => {
  const dateArray = userDate.split('/');
  const timeSplittedArray = userTime.split(':');
  const isAM = timeSplittedArray[1]?.slice(2).toLowerCase() === 'am';
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

  const targetDate = new Date(
    dateArray[2],
    (Number(dateArray[1]) - 1).toString(),
    dateArray[0],
    timeArray[0],
    timeArray[1],
  );

  const currentDate = new Date();

  const timeDiff = targetDate.getTime() - currentDate.getTime();

  return Math.floor(timeDiff / (1000 * 60 * 60));
};

const JobList = props => {
  const openGps = ({latitude, longitude}) => {
    console.log({latitude, longitude}, '{latitude, longitude}');
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    // var url = scheme + `${latitude},${longitude}`;
    var url = `${scheme}//0,0?q=` + `${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const onViewAndApplyPress = () => {
    props.navigation.navigate('JobDetails', {jobId: props.item.id});
  };

  const remainHour = getHour(
    props.item.shift.endDate,
    props.item.shift.endTime,
  );

  return (
    <View
      style={[
        styles.flatlist_mainView,
        {
          marginTop: props.index === 0 ? moderateScale(30) : moderateScale(10),
          marginBottom:
            props.index === props.arraylength
              ? moderateScale(15)
              : moderateScale(0),
        },
      ]}>
      {props.lastView !== 'Favorite' ? (
        <View style={styles.flatlist_header_view}>
          <Text style={styles.time_text}>{props.item.shift.startTime}</Text>
          <Text style={styles.time_text}> - {props.item.shift.endTime}</Text>
          <Image
            source={Icons.Dote}
            style={{
              marginLeft: moderateScale(10),
              tintColor: Colors.gray[200],
            }}
          />
          <Text style={[styles.time_text, {marginLeft: moderateScale(10)}]}>
            {props.item.price.min} - {props.item.price.max}
          </Text>
          <Text style={styles.time_messure}>/hr</Text>
        </View>
      ) : null}
      <View
        style={[
          styles.header_view,
          {
            justifyContent: 'space-between',
            marginTop:
              props.lastView !== 'Favorite'
                ? moderateScale(15)
                : moderateScale(0),
          },
        ]}>
        <Text style={styles.job_name_text}>{props.item.clinic.name}</Text>
        <TouchableOpacity onPress={() => props.likePress()}>
          <Image
            source={
              props.item.favorite ? Icons.heart_light : Icons.heart_outline
            }
            style={styles.heart_icon}
          />
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.header_view,
          {marginTop: moderateScale(10), alignItems: 'flex-start'},
        ]}>
        <View style={[styles.header_view, {flex: 0.25}]}>
          <Image source={Icons.star} style={styles.star_image} />
          <Text style={styles.text}>
            {props.item.clinic.rating.average.toFixed(1)} (
            {props.item.clinic.rating.totalCount})
          </Text>
        </View>
        <View style={styles.header_view}>
          <Image
            source={Icons.pin}
            style={[
              styles.pin_image,
              {
                marginLeft: moderateScale(15),
                alignSelf: 'flex-start',
                marginTop: moderateScale(3),
              },
            ]}
          />
          <Text style={styles.text}>
            {`${props.item.clinic.pinCode}   |   ${props.item.clinic.distance}`}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.header_view,
          {marginTop: moderateScale(20), flexWrap: 'wrap'},
        ]}>
        <View style={styles.check_box_view}>
          <Image
            source={Icons.check_circle_light}
            style={styles.check_circle_light_image}
          />
          <Text style={styles.check_text}>
            Software: {props.item.clinic.software_use}
          </Text>
        </View>
        <View style={styles.check_box_view}>
          <Image
            source={Icons.check_circle_light}
            style={styles.check_circle_light_image}
          />
          <Text style={styles.check_text}>
            Recall: {props.item.clinic.avgRecall}
          </Text>
        </View>
        {props.item.clinic.lunchtime === 'yes' && (
          <View style={styles.check_box_view}>
            <Image
              source={Icons.check_circle_light}
              style={styles.check_circle_light_image}
            />
            <Text style={styles.check_text}>Paid Lunch</Text>
          </View>
        )}
        <View style={styles.check_box_view}>
          <Image
            source={Icons.check_circle_light}
            style={styles.check_circle_light_image}
          />
          <Text style={styles.check_text}>
            Ulltrasonic: {props.item.clinic.ultrasonic}
          </Text>
        </View>
        <View style={styles.check_box_view}>
          <Image
            source={Icons.check_circle_light}
            style={styles.check_circle_light_image}
          />
          <Text style={styles.check_text}>
            Rapidography: {props.item.clinic.radiography}
          </Text>
        </View>
      </View>
      {props.lastView === 'Openjob' ? (
        <View style={styles.button_view}>
          <TouchableOpacity
            style={[
              styles.open_map_button,
              {
                flex: 1,
                backgroundColor: Colors.blue[50],
                marginRight: moderateScale(5),
                justifyContent: 'center',
              },
            ]}
            onPress={() =>
              openGps({
                latitude: props.item?.clinic?.latitude ?? '20.5937',
                longitude: props.item?.clinic?.longitude ?? '78.9629',
              })
            }>
            <Image
              source={Icons.map_pin_line_fill}
              style={styles.map_pin_line_image}
            />
            <Text
              style={[
                styles.open_map_button_text,
                {color: Colors.subText, marginLeft: moderateScale(10)},
              ]}>
              Open in Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.open_map_button,
              {
                flex: 1,
                backgroundColor: Colors.subText,
                marginLeft: moderateScale(5),
                justifyContent: 'center',
              },
            ]}
            onPress={() => onViewAndApplyPress()}>
            <Text style={[styles.open_map_button_text, {color: Colors.white}]}>
              View & Apply
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color={Colors.white}
              style={{marginTop: 4, marginLeft: moderateScale(4)}}
            />
          </TouchableOpacity>
        </View>
      ) : props.lastView === 'Appliedjobs' ? (
        <View style={[styles.button_view, {justifyContent: 'space-between'}]}>
          {props?.item?.approved === 'unapproved' ? (
            <>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={Icons.clock} style={styles.clock_image} />
                <Text style={styles.waiting_text}>Waiting for approval</Text>
              </View>
              <TouchableOpacity
                style={styles.cancel_button}
                onPress={props.cancelModal}>
                <Text style={styles.cancel_text}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Image source={Icons.check_green} style={styles.clock_image} />
              <Text
                style={[
                  styles.waiting_text,
                  {
                    fontFamily: Fonts.satoshi_bold,
                    color: Colors.green[400],
                  },
                ]}>
                Completed
              </Text>
            </View>
          )}
        </View>
      ) : props.lastView === 'Shift' ? (
        props.status !== 'completed' ? (
          <View style={[styles.button_view, {justifyContent: 'space-between'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={Icons.clock} style={styles.clock_image} />
              <Text
                style={[
                  styles.waiting_text,
                  {fontFamily: Fonts.satoshi_bold, color: Colors.black},
                ]}>
                {`Starting in  ${remainHour < 0 ? 0 : remainHour} Hrs`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.cancel_button}
              onPress={() => {
                props.cancelShift();
              }}>
              <Text style={styles.cancel_text}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.button_view, {justifyContent: 'space-between'}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: '5%',
                flex: 0.7,
              }}>
              <Image source={Icons.check_green} style={styles.clock_image} />
              <Text
                style={[
                  styles.waiting_text,
                  {fontFamily: Fonts.satoshi_bold, color: Colors.green[400]},
                ]}>
                Completed
              </Text>
            </View>
            <View style={styles.shift_button_view}>
              <YesNoButton
                first_button_backgroundColor={Colors.borderColor}
                first_button_color={Colors.black}
                first_button_text={'Review'}
                second_button_backgroundColor={Colors.sky_color}
                second_button_color={Colors.white}
                second_button_text={'Send Invoice'}
                first_button_call={() => props.reviewModall()}
                second_button_call={() => props.send_invoice()}
                flex1={1}
                flex2={2}
                second_button_image={false}
              />
            </View>
            {/* <TouchableOpacity
                onPress={() => props.reviewModall()}
                style={[
                  styles.cancel_button,
                  {
                    backgroundColor: Colors.gray[200],
                    // flex: 1,
                    marginRight: moderateScale(5),
                    paddingHorizontal: moderateScale(5),
                  },
                ]}>
                <Text style={[styles.cancel_text, {color: Colors.black}]}>
                  Review
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cancel_button,
                  {
                    backgroundColor: Colors.sky_color,
                    flex: 1,
                    paddingHorizontal: moderateScale(0),

                    padding: moderateScale(1),
                  },
                ]}
                onPress={() => props.send_invoice()}>
                <Text style={[styles.cancel_text, {color: Colors.white}]}>
                  Send Invoice
                </Text>
              </TouchableOpacity> */}
          </View>
        )
      ) : null}
    </View>
  );
};

export default JobList;

const styles = StyleSheet.create({
  flatlist_mainView: {
    marginHorizontal: moderateScale(20),
    padding: moderateScale(15),
    backgroundColor: Colors.white,
  },
  flatlist_header_view: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: moderateScale(13),
    borderBottomColor: Colors.gray[200],
  },
  time_text: {
    color: Colors.black,
    fontFamily: Fonts.satoshi_bold,
    fontSize: moderateScale(16),
  },
  time_messure: {
    color: Colors.black,
    fontFamily: Fonts.satoshi_regular,
  },
  header_view: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  job_name_text: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.satoshi_medium,
    color: Colors.black,
  },
  heart_icon: {
    width: moderateScale(18),
    height: moderateScale(16),
  },
  star_image: {
    width: moderateScale(12),
    height: moderateScale(12),
  },
  pin_image: {
    width: moderateScale(9.5),
    height: moderateScale(12),
  },
  text: {
    color: Colors.gray[700],
    fontFamily: Fonts.satoshi_regular,
    fontSize: moderateScale(12),
    marginLeft: moderateScale(7),
    alignSelf: 'flex-start',
  },
  check_circle_light_image: {
    width: moderateScale(12),
    height: moderateScale(14),
  },
  check_box_view: {
    flexDirection: 'row',
    marginRight: horizontalScale(15),
    marginBottom: verticalScale(15),
  },
  check_text: {
    color: Colors.gray[700],
    fontFamily: Fonts.satoshi_regular,
    fontSize: moderateScale(12),
    marginLeft: moderateScale(3),
  },
  open_map_button_text: {
    fontFamily: Fonts.satoshi_bold,
    fontSize: moderateScale(14),
  },
  map_pin_line_image: {
    width: moderateScale(12.6),
    height: moderateScale(16),
  },
  open_map_button: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: moderateScale(10),
    borderRadius: moderateScale(4),
  },
  button_view: {
    flexDirection: 'row',
    marginTop: moderateScale(15),
    marginBottom: moderateScale(10),
    flex: 1,
  },
  clock_image: {
    width: moderateScale(15),
    height: moderateScale(15),
    marginTop: moderateScale(2),
  },
  waiting_text: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.satoshi_regular,
    color: Colors.gray[400],
    marginLeft: moderateScale(5),
  },
  cancel_button: {
    backgroundColor: Colors.red[50],
    padding: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(4),
    alignItems: 'center',
  },
  cancel_text: {
    color: Colors.red[500],
    fontSize: moderateScale(14),
    fontFamily: Fonts.satoshi_bold,
  },
  shift_button_view: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
