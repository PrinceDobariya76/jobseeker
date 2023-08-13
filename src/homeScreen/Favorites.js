import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import MainHeader from '../Component/HomeComponent/MainHeader';
import {JobList} from '../theme/ConstantArray';
import {SafeAreaView} from 'react-native-safe-area-context';
import ConformationModal from '../Component/HomeComponent/ConformationModal';
import {useIsFocused} from '@react-navigation/native';
import {DELETE, GET, apiConst} from '../helper/apiConstants';
import makeAPIRequest from '../helper/global';
import FavouriteListDetail from '../Component/HomeComponent/FavouritesListComp';
import AcitvityLoader from '../Component/HomeComponent/ActivityLoader';
import {moderateScale} from '../theme/scalling';

const Favorites = ({navigation}) => {
  const [openConfirmationModal, SetOpenConfirmationModal] = useState(false);
  const [isItem, setIsItem] = useState();
  const [favoritesData, setFavoritesData] = useState([]);
  const [mainLoading, setMainLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');

  const removeFavorites = async () => {
    setMainLoading(true);
    return makeAPIRequest({
      method: DELETE,
      url: apiConst.removeFavorites(isItem?.job?.clinic?.id),
      token: true,
    })
      .then(() => {
        setMainLoading(false);
        SetOpenConfirmationModal(false);
        setFavoritesData(favoritesData.filter(item => item.id !== isItem.id));
      })
      .catch(error => {
        setMainLoading(false);
        console.log('error', error);
      });
  };

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
    if (isFocused) {
      getFavorites();
    }
  }, [isFocused]);

  const getFavorites = async () => {
    setMainLoading(true);
    return makeAPIRequest({
      method: GET,
      url: apiConst.getFavorites,
      token: true,
    })
      .then(response => {
        setMainLoading(false);
        console.log('response', response.data.data);
        setFavoritesData(response.data.data);
      })
      .catch(error => {
        setMainLoading(false);
        console.log('error', error);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <MainHeader
        isShowLogo={false}
        text="Favorites"
        bellAction={() => navigation.navigate('Notification')}
        openProfile={() => navigation.navigate('MyProfile')}
        profileUrl={profileUrl}
      />
      <AcitvityLoader visible={mainLoading} />
      {favoritesData.length == 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataFound}>no data found</Text>
        </View>
      ) : (
        <FlatList
          // data={JobList}
          data={favoritesData}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <FavouriteListDetail
                index={index}
                item={item}
                lastView={'Favorite'}
                favoritescreen={true}
                arraylength={favoritesData.length - 1}
                likePress={() => {
                  SetOpenConfirmationModal(true);
                  setIsItem(item);
                }}
              />
            );
          }}
        />
      )}
      <ConformationModal
        NoButton={() => SetOpenConfirmationModal(false)}
        YesButton={() => removeFavorites()}
        header={'Do you want to remove this job from favorites?'}
        loading={mainLoading}
        no_text="No"
        openConfirmationModal={openConfirmationModal}
        yes_text="Yes"
      />
    </SafeAreaView>
  );
};
export default Favorites;

const styles = StyleSheet.create({
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
