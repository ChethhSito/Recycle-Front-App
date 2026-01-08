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
import { RequestListScreen } from '../modules/citizen/listrecycle-screen';
import { ProfileScreen } from '../modules/profile/profile-screen';
import { PersonalDataScreen } from '../modules/profile/personal-data-screen';
import { HistoryScreen } from '../modules/profile/history-screen';
import { SettingsScreen } from '../modules/settings/settings-screen';
import { TwoFactorInfoScreen } from '../modules/settings/two-factor-auth/two-factor-info-screen';
import { TwoFactorMethodScreen } from '../modules/settings/two-factor-auth/two-factor-method-screen';
import { TwoFactorVerifyScreen } from '../modules/settings/two-factor-auth/two-factor-verify-screen';
import { TwoFactorSuccessScreen } from '../modules/settings/two-factor-auth/two-factor-success-screen';
import { AboutScreen } from '../modules/about/about-screen';
import { GreenFootprintScreen } from '../modules/greenprint/green-print-screen';
import { RewardsScreen } from '../modules/rewards/rewards-screen';
import { PartnersScreen } from '../modules/partners/partners-screen';
import { EnvironmentalProgramsScreen } from '../modules/programs/environmental-programs-screen';
import { MapScreen } from '../modules/recycler/Map-screen';
import { RequestDetailScreen } from '../modules/recycler/Detail-recycle-screen';
const Stack = createStackNavigator();

export const AppRoutes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [userInfo] = useState({
        name: 'Juan David',
        email: 'juan@ecolloy.pe',
        points: 330,
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
                <Stack.Screen name="RequestList" component={RequestListScreen} />
                <Stack.Screen name="Profile">
                    {props => (
                        <ProfileScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                            userPoints={userInfo.points}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="Settings">
                    {props => (
                        <SettingsScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="TwoFactorInfo" component={TwoFactorInfoScreen} />
                <Stack.Screen name="TwoFactorMethod" component={TwoFactorMethodScreen} />
                <Stack.Screen name="TwoFactorVerify" component={TwoFactorVerifyScreen} />
                <Stack.Screen name="TwoFactorSuccess" component={TwoFactorSuccessScreen} />
                <Stack.Screen name="AboutUs">
                    {props => (
                        <AboutScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="GreenFootprint" component={GreenFootprintScreen} />
                <Stack.Screen name="Rewards">
                    {props => (
                        <RewardsScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Partners">
                    {props => (
                        <PartnersScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="EnvironmentalPrograms">
                    {props => (
                        <EnvironmentalProgramsScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Map">
                    {props => (
                        <MapScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="RequestDetail">
                    {props => (
                        <RequestDetailScreen
                            {...props}
                            onOpenDrawer={() => setDrawerVisible(true)}
                            userAvatar={userInfo.avatar}
                            userName={userInfo.name}
                        />
                    )}
                </Stack.Screen>
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