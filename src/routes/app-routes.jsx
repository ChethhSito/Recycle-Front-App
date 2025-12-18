import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { LoginScreen } from '../modules/auth/screens/login-screen';
import { RegisterScreen } from '../modules/auth/screens/register-screen';
import { HomeScreen } from '../modules/home/home-screen';
import { RecoverScreen } from '../modules/auth/screens/recover-screen';
import { RankScreen } from '../modules/citizen/points-screen';
import { ForumScreen } from '../modules/forum/forum-screen';
import { InductionScreen } from '../modules/induction/induction-screen';
import { DrawerMenu } from '../componentes/navigation/DrawerMenu';
import { CreateRequestScreen } from '../modules/citizen/request-screen';
const Stack = createStackNavigator();

export const AppRoutes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [userInfo] = useState({
        name: 'Juan David',
        email: 'juan@ecolloy.pe',
        points: 1250,
        avatar: 'https://i.pravatar.cc/150?img=33'
    });

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
                <Stack.Screen name="Home">
                    {props => (
                        <HomeScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Rank" component={RankScreen} />
                <Stack.Screen name="Forum">
                    {props => (
                        <ForumScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Induction">
                    {props => (
                        <InductionScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
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
                <Stack.Screen name="Request" component={CreateRequestScreen} />
            </Stack.Navigator>

            {/* DrawerMenu compartido */}
            <DrawerMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                userName={userInfo.name}
                userEmail={userInfo.email}
                userPoints={userInfo.points}
                avatarUrl={userInfo.avatar}
            />
        </NavigationContainer>
    );
};