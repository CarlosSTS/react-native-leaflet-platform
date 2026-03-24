import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from './styles';

const LoadingIndicator = () => {
  return (
    <View style={styles.activityOverlayStyle}>
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" />
      </View>
    </View>
  );
};

export { LoadingIndicator };
