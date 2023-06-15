import React from 'react';
import {Modal, View, StyleSheet, ActivityIndicator} from 'react-native';

import {horizontalScale} from '../../theme/scalling';

const AcitvityLoader = ({visible}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      style={{flex: 1}}
      statusBarTranslucent>
      <View style={style.containerStyle}>
        <ActivityIndicator
          style={style.activityLoaderImage}
          size={horizontalScale(40)}
          color={'blue'}
        />
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  activityLoaderImage: {
    width: horizontalScale(6),
    height: horizontalScale(6),
  },
});

export default AcitvityLoader;
