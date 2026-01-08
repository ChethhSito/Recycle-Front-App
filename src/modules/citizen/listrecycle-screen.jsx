import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, FAB, Chip, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg'; // Para la nube

const { width } = Dimensions.get('window');

// Datos de prueba (Cámbialo a [] para ver el estado vacío)
const MOCK_DATA = [
    { id: '1', material: 'Plástico', quantity: '2.5 kg', date: 'Hoy, 10:30 AM', status: 'pending' },
    { id: '2', material: 'Cartón', quantity: '10 cajas', date: 'Ayer', status: 'completed' },
    { id: '3', material: 'Vidrio', quantity: '5 kg', date: '12 Oct', status: 'cancelled' },
];

export const RequestListScreen = ({ navigation }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulamos carga de API
        setTimeout(() => {
            setRequests(MOCK_DATA); // Pon MOCK_DATA o [] para probar
            setLoading(false);
        }, 1000);
    }, []);

    // --- RENDERIZADO DE CADA TARJETA ---
    const renderItem = ({ item }) => {
        // Colores y textos según estado
        const getStatusStyle = (status) => {
            switch (status) {
                case 'pending': return { color: '#FAC96E', label: 'Buscando...', icon: 'clock-outline' };
                case 'completed': return { color: '#00C7A1', label: 'Recogido', icon: 'check-circle' };
                case 'cancelled': return { color: '#EF4444', label: 'Cancelado', icon: 'close-circle' };
                default: return { color: '#999', label: 'Desconocido' };
            }
        };
        const statusConfig = getStatusStyle(item.status);

        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                <View style={styles.cardIcon}>
                    {/* Icono dinámico según material */}
                    <Icon name="recycle" size={24} color="#018f64" />
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.materialTitle}>{item.material}</Text>
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>

                <View style={styles.statusContainer}>
                    <Chip
                        icon={statusConfig.icon}
                        style={{ backgroundColor: statusConfig.color + '20' }} // 20% opacidad fondo
                        textStyle={{ color: statusConfig.color, fontSize: 11, fontWeight: 'bold' }}
                    >
                        {statusConfig.label}
                    </Chip>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>

            {/* HEADER VERDE + NUBE */}
            <View style={styles.headerWrapper}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mis Solicitudes</Text>
                </View>
                <View style={styles.svgContainer}>
                    <Svg width={width} height={40} viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <Path fill="#B7ECDD" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
                    </Svg>
                </View>
            </View>

            {/* CONTENIDO PRINCIPAL */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#018f64" />
                </View>
            ) : (
                <FlatList
                    data={requests}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    // --- ESTADO VACÍO (Si no hay solicitudes) ---
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>

                            <Text style={styles.emptyTitle}>Aún no has reciclado</Text>
                            <Text style={styles.emptyText}>
                                ¡Es momento de empezar! Crea tu primera solicitud y ayuda al planeta.
                            </Text>
                        </View>
                    )}
                />
            )}

            {/* BOTÓN FLOTANTE (FAB) PARA AGREGAR NUEVA */}
            <FAB
                icon="plus"
                style={styles.fab}
                color="#000"
                label={requests.length === 0 ? "Crear mi primera solicitud" : "Nueva Solicitud"}
                extended={requests.length === 0} // Se expande si está vacío para llamar la atención
                onPress={() => navigation.navigate('Request')} // <--- IR AL FORMULARIO
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#018f64',
    },
    // Header Styles
    headerWrapper: { backgroundColor: 'transparent', zIndex: 1 },
    headerContent: {
        backgroundColor: '#B7ECDD',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
        color: '#000',
    },
    svgContainer: { marginTop: -1 },

    // List Styles
    listContainer: { padding: 20, paddingBottom: 100 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Card Styles
    card: {
        backgroundColor: '#b1eedc',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardIcon: {
        width: 45, height: 45,
        borderRadius: 25,
        backgroundColor: '#E0F2F1',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 15,
    },
    cardContent: { flex: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    materialTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    dateText: { fontSize: 12, color: '#020202ff' },
    quantityText: { fontSize: 14, color: '#555' },

    // Empty State
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyImage: { width: 200, height: 200, opacity: 0.8 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 20 },
    emptyText: { textAlign: 'center', color: '#666', marginTop: 10, paddingHorizontal: 40 },

    // FAB
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0, // Si tienes tabs abajo, ajusta esto (ej: bottom: 80)
        backgroundColor: '#FAC96E', // Amarillo de acento
    },
});