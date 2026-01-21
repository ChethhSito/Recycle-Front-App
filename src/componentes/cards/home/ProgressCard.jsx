import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const ProgressCard = ({
    badgeIcon = 'seed',
    badgeTitle = 'Semilla de Cambio',
    rank = 'Nivel 1',
    progress = 0.66,
    currentPoints = 330,
    maxPoints = 500,
    // 👇 1. NUEVAS PROPS (Con valores por defecto por si acaso)
    bgColor = '#F5E6D3',
    iconColor = '#5D4037',
}) => {
    const theme = useTheme();
    const componentStyles = styles(theme);

    return (
        // 👇 2. APLICAMOS EL COLOR DE FONDO DINÁMICO
        <Card style={[componentStyles.progressCard, { backgroundColor: bgColor }]}>
            <Card.Content>
                <View style={componentStyles.badgeContainer}>
                    <View style={componentStyles.circle}>
                        {/* 👇 3. USAMOS EL COLOR PRINCIPAL PARA EL ICONO */}
                        <Icon name={badgeIcon} size={30} color={iconColor} />
                    </View>
                    <View style={componentStyles.badgeInfo}>
                        <Text style={componentStyles.badgeTitle}>{badgeTitle}</Text>
                        <Text style={componentStyles.badgeRank}>{rank}</Text>
                    </View>
                </View>

                <Text style={componentStyles.progressText}>
                    Siguiente nivel: (Calculado automáticamente)
                </Text>

                {/* Opcional: Puedes pintar este texto también con el color del nivel */}
                <Text style={[componentStyles.progressLabel, { color: iconColor }]}>
                    TU PROGRESO ACTUAL
                </Text>

                {/* 👇 4. LA BARRA DE PROGRESO COMBINA CON EL NIVEL */}
                <ProgressBar
                    progress={progress}
                    color={iconColor}
                    style={componentStyles.progressBar}
                />

                <View style={componentStyles.pointsContainer}>
                    <Text style={componentStyles.points}>{currentPoints}/{maxPoints} pts</Text>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = (theme) => StyleSheet.create({
    progressCard: {
        // backgroundColor: '#F5E6D3', // ❌ YA NO ES NECESARIO AQUÍ (Se pasa por style prop)
        margin: 20,
        borderRadius: 20,
        elevation: 4, // Un poco de sombra para que resalte
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        backgroundColor: '#000000', // Hacemos el blanco semitransparente para que se mezcle bien con cualquier fondo
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeInfo: {
        marginLeft: 15,
    },
    badgeTitle: {
        color: '#ffffffff', // Color oscuro neutro para texto sobre fondos pastel
        fontSize: 18,
        fontWeight: 'bold',
    },
    badgeRank: {
        color: '#ffffffff',
        fontSize: 14,
    },
    progressLabel: {
        // color: '#018f64', // Lo quitamos para usar iconColor dinámico
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
        opacity: 0.8,
        letterSpacing: 1,
    },
    progressText: {
        color: '#ffffffff',
        fontSize: 14,
        marginBottom: 5,
        marginTop: 10,
        fontStyle: 'italic',
        opacity: 0.8
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#c0c0c080', // Fondo de la barra más sutil
    },
    pointsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    points: {
        color: '#ffffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});