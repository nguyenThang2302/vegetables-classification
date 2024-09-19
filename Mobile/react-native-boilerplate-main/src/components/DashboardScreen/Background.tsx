import React, { ReactNode } from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { themeAuth } from '../../../theme/theme-auth';

type BackgroundProps = {
  children: ReactNode;
};

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../../theme/assets/images/background_dot.png')}
      resizeMode="repeat"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: themeAuth.colors.surface,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Background;
