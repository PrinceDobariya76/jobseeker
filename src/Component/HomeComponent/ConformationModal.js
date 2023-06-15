import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {Fonts} from '../../theme';
import Colors from '../../theme/Colors';
import {Images} from '../../theme/images';
import {moderateScale} from '../../theme/scalling';
import YesNoButton from './YesNoButton';

const ConformationModal = ({
  YesButton,
  NoButton,
  openConfirmationModal,
  header,
  no_text,
  yes_text,
  closeModal,
}) => {
  return (
    <Modal
      visible={openConfirmationModal}
      onRequestClose={NoButton}
      transparent={true}>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={closeModal}>
        <View style={styles.main_view}>
          <Image
            source={Images.BlackBackground}
            style={styles.modal_backgroundimage}
          />
          <View style={styles.view}>
            <Text style={styles.message_header}>
              {header}
              {/* Are you want to like this job ? */}
            </Text>
            <YesNoButton
              first_button_backgroundColor={Colors.borderColor}
              first_button_color={Colors.black}
              first_button_text={no_text}
              second_button_backgroundColor={Colors.sky_color}
              second_button_color={Colors.white}
              second_button_text={yes_text}
              first_button_call={NoButton}
              second_button_call={YesButton}
              flex1={1}
              flex2={1}
              second_button_image={false}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConformationModal;

const styles = StyleSheet.create({
  modal_backgroundimage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    opacity: 0.5,
  },
  main_view: {
    flex: 1,
    justifyContent: 'center',
  },
  view: {
    backgroundColor: 'white',
    marginHorizontal: moderateScale(15),
    borderRadius: moderateScale(4),
    padding: moderateScale(10),
    paddingBottom: moderateScale(20),
  },
  message_header: {
    fontSize: moderateScale(17),
    fontFamily: Fonts.satoshi_medium,
    color: Colors.black,
    textAlign: 'center',
    marginVertical: moderateScale(10),
  },
});
