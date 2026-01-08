import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, IconButton, Avatar, Card, Divider } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const RequestDetailScreen = ({ route, navigation }) => {
    // Recibimos los datos de la solicitud desde la pantalla anterior
    const { request } = route.params || {};

    // Datos de respaldo por si algo falla (Fallback)
    const item = request || {
        title: 'Material Desconocido',
        user: 'Usuario',
        distance: '---',
        description: 'Sin descripción',
        quantity: '---',
        image: 'https://via.placeholder.com/400'
    };

    return (
        <View style={styles.container}>
            {/* 1. HEADER CON IMAGEN DE EVIDENCIA */}
            <View style={styles.imageHeader}>
                <Image
                    source={{ uri: item.image || 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=1000&auto=format&fit=crop' }}
                    style={styles.evidenceImage}
                />

                {/* Botón flotante para volver */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* Badge de Distancia */}
                <View style={styles.distanceBadge}>
                    <Ionicons name="location" size={16} color="#FFF" />
                    <Text style={styles.distanceText}>A {item.distance}</Text>
                </View>
            </View>

            {/* 2. CONTENIDO DETALLADO (Scrollable) */}
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>

                {/* Título y Usuario */}
                <View style={styles.headerInfo}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>Publicado hace 10 min</Text>
                    </View>
                    <View style={styles.ratingBox}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>4.8</Text>
                    </View>
                </View>

                {/* Tarjeta de Usuario */}
                <View style={styles.userCard}>
                    <Avatar.Text size={45} label={item.user.substring(0, 2).toUpperCase()} style={{ backgroundColor: '#018f64' }} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.userName}>{item.user}</Text>
                        <Text style={styles.userRole}>Ciudadano Verificado</Text>
                    </View>
                    <IconButton icon="message-text-outline" iconColor="#018f64" size={28} onPress={() => console.log('Chat')} />
                </View>

                <Divider style={{ marginVertical: 15 }} />

                {/* Detalles Técnicos (Grid) */}
                <Text style={styles.sectionTitle}>Detalles del Recojo</Text>
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="weight" size={24} color="#555" />
                        <Text style={styles.detailLabel}>Cantidad</Text>
                        <Text style={styles.detailValue}>{item.quantity || '2 Bolsas'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="recycle" size={24} color="#555" />
                        <Text style={styles.detailLabel}>Tipo</Text>
                        <Text style={styles.detailValue}>Reciclable</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="clock-outline" size={24} color="#555" />
                        <Text style={styles.detailLabel}>Horario</Text>
                        <Text style={styles.detailValue}>Todo el día</Text>
                    </View>
                </View>

                {/* Descripción */}
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.descriptionText}>
                    {item.description || "Hola, tengo varias botellas de plástico y cajas de cartón limpias acumuladas de la semana. Están listas para recoger en la puerta."}
                </Text>

                {/* Ubicación */}
                <Text style={styles.sectionTitle}>Dirección</Text>
                <View style={styles.addressBox}>
                    <Ionicons name="map" size={20} color="#018f64" />
                    <Text style={styles.addressText}>Av. Arequipa 1234, Lince, Lima</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* 3. BOTÓN FLOTANTE INFERIOR (Action) */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    icon="truck-fast"
                    onPress={() => console.log('Aceptar Solicitud')}
                    style={styles.acceptButton}
                    contentStyle={{ height: 50 }}
                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                >
                    Aceptar Solicitud
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#31253B' },

    // Header Imagen
    imageHeader: { height: 250, width: '100%', position: 'relative' },
    evidenceImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    backButton: {
        position: 'absolute', top: 50, left: 20,
        backgroundColor: '#FFF', borderRadius: 20, padding: 8, elevation: 5
    },
    distanceBadge: {
        position: 'absolute', bottom: 30, right: 20,
        backgroundColor: 'rgba(1, 143, 100, 0.9)', paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 15, flexDirection: 'row', alignItems: 'center'
    },
    distanceText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },

    // Contenido
    contentContainer: {
        flex: 1,
        backgroundColor: '#b1eedc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -25, // Efecto de superposición
        paddingHorizontal: 20,
        paddingTop: 25
    },
    headerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 14, color: '#888' },
    ratingBox: { flexDirection: 'row', backgroundColor: '#FFF9C4', padding: 5, borderRadius: 8, alignItems: 'center' },
    ratingText: { fontWeight: 'bold', marginLeft: 4, color: '#FBC02D' },

    // Usuario
    userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F9F8', padding: 10, borderRadius: 12 },
    userName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    userRole: { fontSize: 12, color: '#018f64' },

    // Grid Detalles
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
    detailsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    detailItem: { width: '30%', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 10, alignItems: 'center' },
    detailLabel: { fontSize: 12, color: '#888', marginTop: 5 },
    detailValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },

    descriptionText: { lineHeight: 22, color: '#555', fontSize: 15 },
    addressBox: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    addressText: { marginLeft: 10, color: '#555', fontSize: 15 },

    // Footer
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#b1eedc', padding: 20,
        borderTopWidth: 1, elevation: 20
    },
    acceptButton: { backgroundColor: '#018f64', borderRadius: 12 }
});