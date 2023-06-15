import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {Fonts} from '../../theme';
import Colors from '../../theme/Colors';
import {Icons} from '../../theme/icons';
import {Images} from '../../theme/images';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../theme/scalling';
import {SafeAreaView} from 'react-native-safe-area-context';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const CustomeDropdown = ({
  selectedProfession,
  data,
  title_text,
  excaimination_image,
  setOpenDropDownModal,
  openModal,
  selectItem,
  placeholder_text,
  closeModal,
}) => {
  return (
    <View
      style={{
        marginTop: title_text !== '' ? moderateScale(13) : moderateScale(-2),
      }}>
      {title_text !== '' && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={[styles.field_title]}>{title_text}</Text>

          {excaimination_image === true ? (
            <Image
              source={Icons.exclaimination}
              style={styles.exclaimination_image}
            />
          ) : null}
        </View>
      )}
      <TouchableOpacity
        onPress={setOpenDropDownModal}
        style={styles.dropdownOpenButton}>
        <Text style={styles.text_color}>
          {selectedProfession !== '' ? selectedProfession : placeholder_text}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={openModal}
        onRequestClose={setOpenDropDownModal}
        transparent={true}
        animationType="slide">
        <Image
          source={Images.BlackBackground}
          style={styles.modal_backgroundimage}
        />
        <TouchableWithoutFeedback
          style={{flex: 1}}
          onPress={setOpenDropDownModal}>
          <SafeAreaView style={styles.modal_mainview}>
            <View style={styles.innew_view}>
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  alignItems: 'flex-end',
                  paddingHorizontal: horizontalScale(20),
                  paddingVertical: verticalScale(10),
                }}>
                <EvilIcons name="close" size={30} color={Colors.black} />
              </TouchableOpacity>
              <FlatList
                data={data}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => selectItem(item)}
                      style={[
                        styles.select_button,
                        {
                          // borderBottomWidth: index === data.length - 1 ? 0 : 1,
                          borderBottomWidth: 1,
                        },
                      ]}>
                      <Text
                        style={{
                          fontFamily: Fonts.satoshi_medium,
                          color:
                            selectedProfession == item.name
                              ? Colors.blue[500]
                              : Colors.black,
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
export default CustomeDropdown;

const styles = StyleSheet.create({
  field_title: {
    color: Colors.black,
    fontSize: moderateScale(16),
    fontFamily: Fonts.satoshi_medium,
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
  exclaimination_image: {
    width: moderateScale(15),
    height: moderateScale(15),
    marginLeft: moderateScale(3),
    marginTop: moderateScale(3),
  },
  modal_backgroundimage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    opacity: 0.5,
  },

  // dropdown
  dropdownOpenButton: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: moderateScale(4),
    padding: moderateScale(15),
    backgroundColor: Colors.white,
    marginTop: moderateScale(5),
  },

  // modal

  modal_mainview: {
    flex: 1,
    justifyContent: 'center',
  },
  innew_view: {
    // marginHorizontal: moderateScale(20),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(5),
    flex: 1,
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(10),
    // maxHeight: Dimensions.get('window').height / 2,
  },
  select_button: {
    padding: moderateScale(15),
    // alignItems: 'center',
    borderBottomColor: Colors.borderColor,
  },
  text_color: {},
});
