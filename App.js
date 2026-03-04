import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

// Notificaciones y Navegación

import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';

import { store } from './src/store/store';
import { appTheme } from './src/theme/theme';
import { AppRoutes } from './src/routes/app-routes';
import { SplashScreen } from './src/modules/auth/screens/load-screen';


SplashScreenExpo.preventAutoHideAsync();

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false); // Estado para controlar la carga de fuentes
  const [showAnimation, setShowAnimation] = useState(true); // Estado para mostrar la animación Lottie


  const [fontsLoaded] = useFonts({
    'InclusiveSans-Regular': require('./assets/fonts/InclusiveSans-Regular.ttf'),
    'InclusiveSans-Medium': require('./assets/fonts/InclusiveSans-Medium.ttf'),
    'InclusiveSans-Bold': require('./assets/fonts/InclusiveSans-Bold.ttf'),
  });


  useEffect(() => {
    async function prepare() {
      try {
        const imagesToLoad = [require('./assets/reciclaje.png')];
        const cacheImages = imagesToLoad.map(img => Asset.fromModule(img).downloadAsync());
        await Promise.all(cacheImages);
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
          await SplashScreenExpo.hideAsync();
          setAppIsReady(true);
        }
      }
    }
    if (fontsLoaded) prepare();
  }, [fontsLoaded]);

  if (!appIsReady) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={appTheme}>
          <StatusBar style="light" backgroundColor={appTheme.colors.background} />

          {showAnimation && (
            <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]}>
              <SplashScreen onFinish={() => setShowAnimation(false)} />
            </View>
          )}

          <AppRoutes />
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

