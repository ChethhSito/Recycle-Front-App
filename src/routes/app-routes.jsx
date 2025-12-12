import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { LoginScreen } from '../modules/auth/screens/login-screen';
import { RegisterScreen } from '../modules/auth/screens/register-screen';
import { HomeScreen } from '../modules/home/home-screen';
const Stack = createStackNavigator();

export const AppRoutes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                    cardOverlayEnabled: true,
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 600 } },
                        close: { animation: 'timing', config: { duration: 600 } },
                    }
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>





    );
};