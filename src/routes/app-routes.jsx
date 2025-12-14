import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { LoginScreen } from '../modules/auth/screens/login-screen';
import { RegisterScreen } from '../modules/auth/screens/register-screen';
import { HomeScreen } from '../modules/home/home-screen';
import { RecoverScreen } from '../modules/auth/screens/recover-screen';
import { RankScreen } from '../modules/citizen/points-screen';
const Stack = createStackNavigator();

export const AppRoutes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const modalOptions = {
        ...TransitionPresets.ModalSlideFromBottomIOS,
        cardOverlayEnabled: true,
        transitionSpec: {
            open: { animation: 'timing', config: { duration: 600 } },
            close: { animation: 'timing', config: { duration: 600 } },
        }
    };
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    cardOverlayEnabled: true,
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 600 } },
                        close: { animation: 'timing', config: { duration: 600 } },
                    }
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Rank" component={RankScreen} />
                <Stack.Screen
                    name="Recover" component={RecoverScreen}
                    options={{
                        ...modalOptions
                    }}
                />
                <Stack.Screen
                    name="Register" component={RegisterScreen}
                    options={{
                        ...modalOptions
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>





    );
};