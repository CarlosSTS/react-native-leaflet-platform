import { StyleSheet } from 'react-native';
import { colors } from '~/global';

const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.loadingIndicator.background,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
  },
  activityIndicatorContainer: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'center',
    shadowColor: colors.loadingIndicator.shadowColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
});

export { styles };
