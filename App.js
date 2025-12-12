import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { SplashScreen } from './src/modules/auth/screens/load-screen';
import { LoginScreen } from './src/modules/auth/screens/login-screen';
import { HomeScreen } from './src/modules/home/home-screen';
import { appTheme } from './src/theme/theme';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';

SplashScreenExpo.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false); // Estado para controlar la carga de fuentes
  const [showAnimation, setShowAnimation] = useState(true); // Estado para mostrar la animación Lottie
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          require('./assets/reciclaje.jpg'),
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

        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {showAnimation ? (
              <Stack.Screen name="Splash">
                {props => (
                  <SplashScreen 
                    {...props} 
                    onFinish={() => setShowAnimation(false)} 
                  />
                )}
              </Stack.Screen>
            ) : !isLoggedIn ? (
              <Stack.Screen name="Login">
                {props => (
                  <LoginScreen 
                    {...props} 
                    onLogin={() => setIsLoggedIn(true)} 
                  />
                )}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Home" component={HomeScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>

      </PaperProvider>
    </SafeAreaProvider>
  );
}

