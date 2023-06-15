import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {OnbordScreen} from '../theme/ConstantArray';
import Colors from '../theme/Colors';
import {Fonts, SIZES} from '../theme/index';
import {horizontalScale, moderateScale, verticalScale} from '../theme/scalling';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

const Splashscreen1 = ({navigation}) => {
  const [onbordScreen, setOnbordScreen] = useState(OnbordScreen);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const onViewableItemsChanged = ({viewableItems}) => {
    // Do stuff
    setFocusedIndex(viewableItems[0].index);
  };
  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};
  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={onbordScreen}
        pagingEnabled
        horizontal
        contentContainerStyle={{height: '100%'}}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({item, index}) => {
          return (
            <View style={styles.flatlist_container}>
              <View
                style={{
                  flex: 2,
                  // height:'77%'
                }}>
                <Image
                  source={item.image}
                  style={styles.onbord_image}
                  resizeMode={'contain'}
                />
              </View>
              {index === 0 ? (
                <>
                  <Text style={styles.text}>{item.text}</Text>
                  <Text style={styles.subText}>{item.subText}</Text>
                </>
              ) : index === 1 ? (
                // <>
                <Text style={styles.text}>
                  <Text style={styles.subText}>{item.subText}</Text> {item.text}
                </Text>
              ) : // </>
              index === 2 ? (
                <>
                  <Text style={styles.text}>
                    {item.text}
                    <Text style={styles.subText}>{item.subText}</Text> and earn
                    more.
                  </Text>
                </>
              ) : null}
              {/* <View style={{flex: 1}}></View> */}
              <View style={styles.foote_view}>
                <View style={styles.dooted_view}>
                  {OnbordScreen.map((mapItem, mapIndex) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.dootedButton,
                          {
                            backgroundColor:
                              focusedIndex === mapIndex
                                ? Colors.brandSecondary
                                : Colors.white,
                            width:
                              focusedIndex === mapIndex
                                ? SIZES.width / 15
                                : SIZES.width / 60,
                            borderColor:
                              focusedIndex === mapIndex
                                ? Colors.brandSecondary
                                : Colors.subText,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
                <View style={styles.skip_view}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={[
                      styles.skip_button,
                      {
                        backgroundColor:
                          focusedIndex === onbordScreen.length - 1
                            ? Colors.sky_color
                            : Colors.white,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.skip_text,
                        {
                          color:
                            focusedIndex === onbordScreen.length - 1
                              ? Colors.white
                              : Colors.sky_color,
                        },
                      ]}>
                      {focusedIndex === onbordScreen.length - 1
                        ? 'Get started'
                        : 'Skip'}
                    </Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={20}
                      color={
                        focusedIndex === onbordScreen.length - 1
                          ? Colors.white
                          : Colors.sky_color
                      }
                      style={{marginTop: 4}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Splashscreen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flatlist_container: {
    flex: 1,
    backgroundColor: Colors.white,
    width: SIZES.width,
  },
  onbord_image: {
    width: SIZES.width,
    // width:'98%',
    height: '100%',
    // marginTop: -(SIZES.height / 16),
  },
  text: {
    color: Colors.text,
    fontFamily: Fonts.satoshi_medium,
    marginTop: verticalScale(10),
    fontSize: moderateScale(22),
    marginHorizontal: horizontalScale(25),
  },
  subText: {
    color: Colors.sky_color,
    fontFamily: Fonts.satoshi_bold,
    fontSize: moderateScale(22),
    marginHorizontal: horizontalScale(25),
  },
  foote_view: {
    // flex: 1,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '5%',
  },
  dooted_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: horizontalScale(20),
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  dootedButton: {
    height: SIZES.height / 65,

    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: moderateScale(50),
    borderWidth: 1,

    marginHorizontal: moderateScale(3),
  },
  skip_view: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginHorizontal: moderateScale(20),
  },
  skip_button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: moderateScale(7),
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(10),
  },
  skip_text: {
    fontFamily: Fonts.satoshi_bold,
    textAlign: 'center',
    fontSize: moderateScale(16),
  },
});
