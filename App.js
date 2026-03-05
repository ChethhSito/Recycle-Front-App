import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Provider, useSelector, useDispatch } from 'react-redux'; // 🚀 Agregamos useDispatch
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 📦 Para leer el disco
// Temas y Rutas
import { store } from './src/store/store';
import { lightTheme, darkTheme } from './src/theme/theme'; // 🎨 Asegúrate de que existan
import { AppRoutes } from './src/routes/app-routes';
import { SplashScreen } from './src/modules/auth/screens/load-screen';
import { setTheme } from './src/store/theme';

// Assets y Expo
import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';

function MainContent({ appIsReady, showAnimation, setShowAnimation }) {
  const dispatch = useDispatch(); // 🚀 Ahora podemos usar dispatch aquí
  const { isDarkMode } = useSelector(state => state.theme);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // 🌙 LÓGICA DE PERSISTENCIA INICIAL
  useEffect(() => {
    const loadThemePersistence = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@nos_planet_theme_mode');
        if (savedTheme !== null) {
          // 🚀 Si el usuario ya eligió un tema antes, lo aplicamos de inmediato
          dispatch(setTheme(JSON.parse(savedTheme)));
        }
      } catch (e) {
        console.log("Error cargando preferencia de tema");
      }
    };

    if (appIsReady) {
      loadThemePersistence();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={currentTheme.colors.background}
      />

      {showAnimation && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]}>
          <SplashScreen onFinish={() => setShowAnimation(false)} />
        </View>
      )}

      <AppRoutes />
    </PaperProvider>
  );
}

SplashScreenExpo.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

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
        console.warn('Error cargando assets:', e);
      } finally {
        if (fontsLoaded) {
          await SplashScreenExpo.hideAsync();
          setAppIsReady(true);
        }
      }
    }
    if (fontsLoaded) prepare();
  }, [fontsLoaded]);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainContent
          appIsReady={appIsReady}
          showAnimation={showAnimation}
          setShowAnimation={setShowAnimation}
        />
      </SafeAreaProvider>
    </Provider>
  );
}