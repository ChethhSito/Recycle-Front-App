import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux'; // 🚀 Importación única
import { StatusBar } from 'expo-status-bar';

// Temas y Rutas
import { store } from './src/store/store';
import { lightTheme, darkTheme } from './src/theme/theme'; // 🎨 Asegúrate de que existan
import { AppRoutes } from './src/routes/app-routes';
import { SplashScreen } from './src/modules/auth/screens/load-screen';

// Assets y Expo
import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';

function MainContent({ appIsReady, showAnimation, setShowAnimation }) {
  // Ahora useSelector funciona porque MainContent es hijo del Provider
  const { isDarkMode } = useSelector(state => state.theme);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // Si la app no está lista, no renderizamos nada para evitar errores de renderizado
  if (!appIsReady) return null;

  return (
    <PaperProvider theme={currentTheme}>
      {/* Sincronizamos la barra de estado con el modo oscuro */}
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={currentTheme.colors.background}
      />

      {/* Animación Lottie de entrada */}
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

  // Carga de fuentes personalizadas
  const [fontsLoaded] = useFonts({
    'InclusiveSans-Regular': require('./assets/fonts/InclusiveSans-Regular.ttf'),
    'InclusiveSans-Medium': require('./assets/fonts/InclusiveSans-Medium.ttf'),
    'InclusiveSans-Bold': require('./assets/fonts/InclusiveSans-Bold.ttf'),
  });

  // Preparación de Assets
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
          setAppIsReady(true); // 🚀 La app está lista para MainContent
        }
      }
    }
    if (fontsLoaded) prepare();
  }, [fontsLoaded]);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {/* Pasamos los estados de carga al hijo que tiene acceso a Redux */}
        <MainContent
          appIsReady={appIsReady}
          showAnimation={showAnimation}
          setShowAnimation={setShowAnimation}
        />
      </SafeAreaProvider>
    </Provider>
  );
}
