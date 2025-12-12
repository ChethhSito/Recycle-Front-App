import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';

export const UserHeader = ({
    userName = 'Usuario',
    userType = 'Ciudadano',
    avatarUri,
    quote,
    onMenuPress
}) => {
    const theme = useTheme();
    const componentStyles = styles(theme);

    return (
        <ImageBackground
            source={require('../../../../assets/header.png')}
            style={componentStyles.header}
            resizeMode="cover"
        >
            <View style={componentStyles.headerContent}>
                <View style={componentStyles.headerLeft}>
                    <TouchableOpacity onPress={onMenuPress} style={componentStyles.menuButton}>
                        <View style={componentStyles.menuLine} />
                        <View style={componentStyles.menuLine} />
                        <View style={componentStyles.menuLine} />
                    </TouchableOpacity>
                    <View style={componentStyles.userInfo}>
                        <Text style={componentStyles.greeting}>Hola, {userName}</Text>
                        <Text style={componentStyles.userType}>{userType}</Text>
                    </View>
                </View>
                <Avatar.Image
                    size={50}
                    source={avatarUri ? { uri: avatarUri } : require('../../../../assets/icon.png')}
                />
            </View>

            {quote && (
                <View style={componentStyles.quoteCard}>
                    <Text style={componentStyles.quote}>{quote}</Text>
                </View>
            )}
        </ImageBackground>
    );
};

const styles = (theme) => StyleSheet.create({
    header: {
        width: '100%',
        minHeight: 250,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    menuButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLine: {
        width: 24,
        height: 3,
        backgroundColor: '#000',
        marginVertical: 2,
        borderRadius: 2,
    },
    userInfo: {
        marginLeft: 10,
    },
    greeting: {
        fontSize: 18,
        color: '#000',
    },
    userType: {
        fontSize: 14,
        color: '#666',
    },
    quoteCard: {

        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 55,
        padding: 15,
        borderRadius: 15,
    },
    quote: {
        fontSize: 15,
        color: '#000',

        fontStyle: 'italic',
        textAlign: 'center',
    },
});
