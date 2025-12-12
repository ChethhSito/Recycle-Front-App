import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/modules/auth/screens/login-screen';
import { appTheme } from './src/theme/theme';
import { Provider as PaperProvider } from 'react-native-paper';
import { SplashScreen } from './src/modules/auth/screens/load-screen';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';

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
        // 2. Pre-cargamos la imagen pesada del Login AQUÍ
        // Así cuando entres al Login, la imagen ya está en memoria RAM
        const imagesToLoad = [
          require('./assets/reciclaje.png'),
        ];
        // Cacheamos las imágenes
        const cacheImages = imagesToLoad.map(image => {
          return Asset.fromModule(image).downloadAsync();
        });

        // Esperamos a que carguen las imágenes
        await Promise.all(cacheImages);

      } catch (e) {
        console.warn(e);
      } finally {
        // Solo marcamos como listo si las fuentes también cargaron (el hook useFonts lo maneja aparte,
        // pero aquí aseguramos que el proceso de assets terminó).
        if (fontsLoaded) {
          await SplashScreenExpo.hideAsync();
          setAppIsReady(true);
        }
      }
    }

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>

      {/* 2. Proveedor de Paper (Pasa tu tema de colores verdes) */}
      <PaperProvider theme={appTheme}>

        {/* Configura la barra de estado para que se vea bien sobre tu fondo verde */}
        <StatusBar style="light" backgroundColor={appTheme.colors.background} />

        <View style={{ flex: 1 }}>

          {/* El Login está "esperando" abajo */}
          <LoginScreen />

          {/* El Splash está tapando todo mientras showAnimation sea true */}
          {showAnimation && (
            <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
              <SplashScreen onFinish={() => setShowAnimation(false)} />
            </View>
          )}

        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

