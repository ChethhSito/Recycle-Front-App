import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const EnvironmentalProgramModal = ({ visible, onClose, program }) => {
    if (!program) return null;

    const handleShare = async () => {
        try {
            const message = `🌱 ¡Únete al programa ambiental "${program.title}"!\n\n` +
                `📍 ${program.location}\n` +
                `👥 ${program.participants} participantes ya lo apoyan\n` +
                `⭐ Gana ${program.points} EcoPuntos participando\n\n` +
                `📱 Descarga Nos Planét y participa en este programa:\n` +
                `🔗 https://nosplanet.pe/app\n\n` +
                `💚 Organizado por: ${program.organization}\n` +
                `🌍 Juntos por un planeta más verde`;

            const result = await Share.share({
                message: message,
                title: `Programa: ${program.title}`,
            });

            if (result.action === Share.sharedAction) {
                console.log('[Share] Programa compartido exitosamente');
            }
        } catch (error) {
            console.error('[Share] Error:', error);
            Alert.alert('Error', 'No se pudo compartir el programa');
        }
    };

    const getOrgColor = () => {
        switch (program.organizationType) {
            case 'ONG': return '#FF6B6B';
            case 'NOS_PLANET': return '#018f64';
            case 'ESTADO': return '#4A90E2';
            default: return '#018f64';
        }
    };

    const getOrgLabel = () => {
        switch (program.organizationType) {
            case 'ONG': return 'ONG Ambiental';
            case 'NOS_PLANET': return 'Nos Planet';
            case 'ESTADO': return 'Estado Peruano';
            default: return 'Organización';
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header con imagen */}
                    <View style={styles.headerContainer}>
                        <Image source={
                            program.image
                        }
                            style={styles.headerImage} />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.headerGradient}
                        >
                            <View style={[styles.orgBadge, { backgroundColor: getOrgColor() }]}>
                                <Text style={styles.orgBadgeText}>{getOrgLabel()}</Text>
                            </View>
                        </LinearGradient>

                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Icon name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {/* ...eliminado bloque de fechas y estado... */}
                        {/* Título y organización */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>{program.title}</Text>
                            <View style={styles.orgRow}>
                                <Icon name="domain" size={20} color="#666" />
                                <Text style={styles.orgName}>{program.organization}</Text>
                            </View>
                        </View>

                        {/* Estadísticas */}
                        <View style={styles.statsSection}>
                            <View style={styles.statBox}>
                                <Icon name="account-group" size={28} color={getOrgColor()} />
                                <Text style={styles.statNumber}>{program.participants}</Text>
                                <Text style={styles.statLabel}>Participantes</Text>
                            </View>

                            <View style={styles.statBox}>
                                <Icon name="map-marker" size={28} color={getOrgColor()} />
                                <Text style={styles.statNumber}>{program.location}</Text>
                                <Text style={styles.statLabel}>Ubicación</Text>
                            </View>

                            <View style={styles.statBox}>
                                <Icon name="star-circle" size={28} color="#FFA500" />
                                <Text style={styles.statNumber}>{program.points}</Text>
                                <Text style={styles.statLabel}>Ecopuntos</Text>
                            </View>
                        </View>

                        {/* Descripción */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icon name="information" size={22} color={getOrgColor()} />
                                <Text style={styles.sectionTitle}>Sobre el Programa</Text>
                            </View>
                            <Text style={styles.description}>{program.description}</Text>
                        </View>

                        {/* Objetivos */}
                        {program.objectives && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icon name="target" size={22} color={getOrgColor()} />
                                    <Text style={styles.sectionTitle}>Objetivos</Text>
                                </View>
                                {program.objectives.map((objective, index) => (
                                    <View key={index} style={styles.objectiveItem}>
                                        <Icon name="check-circle" size={18} color={getOrgColor()} />
                                        <Text style={styles.objectiveText}>{objective}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Actividades */}
                        {program.activities && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icon name="clipboard-list" size={22} color={getOrgColor()} />
                                    <Text style={styles.sectionTitle}>Actividades</Text>
                                </View>
                                {program.activities.map((activity, index) => (
                                    <View key={index} style={styles.activityItem}>
                                        <View style={[styles.activityBullet, { backgroundColor: getOrgColor() }]} />
                                        <Text style={styles.activityText}>{activity}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Contacto */}
                        {program.contact && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Icon name="phone" size={22} color={getOrgColor()} />
                                    <Text style={styles.sectionTitle}>Contacto</Text>
                                </View>
                                {program.contact.email && (
                                    <View style={styles.contactItem}>
                                        <Icon name="email" size={18} color="#666" />
                                        <Text style={styles.contactText}>{program.contact.email}</Text>
                                    </View>
                                )}
                                {program.contact.phone && (
                                    <View style={styles.contactItem}>
                                        <Icon name="phone" size={18} color="#666" />
                                        <Text style={styles.contactText}>{program.contact.phone}</Text>
                                    </View>
                                )}
                                {program.contact.website && (
                                    <View style={styles.contactItem}>
                                        <Icon name="web" size={18} color="#666" />
                                        <Text style={styles.contactText}>{program.contact.website}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Botón Participar */}
                        <TouchableOpacity
                            style={styles.participateButton}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[getOrgColor(), getOrgColor() + 'CC']}
                                style={styles.participateGradient}
                            >
                                <Icon name="hand-heart" size={22} color="#fff" />
                                <Text style={styles.participateText}>Quiero Participar</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Botón Compartir */}
                        <TouchableOpacity
                            style={styles.shareButton}
                            activeOpacity={0.8}
                            onPress={handleShare}
                        >
                            <Icon name="share-variant" size={20} color="#018f64" />
                            <Text style={styles.shareText}>Compartir Programa</Text>
                        </TouchableOpacity>

                        <View style={styles.bottomPadding} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // ...eliminadas las clases de estilos de fechas y estado...
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '92%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
    },
    headerContainer: {
        height: 220,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        justifyContent: 'flex-end',
        padding: 16,
    },
    orgBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        elevation: 3,
    },
    orgBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 6,
    },
    titleSection: {
        padding: 20,
        paddingBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        lineHeight: 30,
    },
    orgRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orgName: {
        fontSize: 15,
        color: '#666',
        marginLeft: 8,
        fontWeight: '500',
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        marginHorizontal: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 10,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    section: {
        padding: 20,
        paddingTop: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    description: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    objectiveItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    objectiveText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
        flex: 1,
        lineHeight: 20,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    activityBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 7,
        marginRight: 10,
    },
    activityText: {
        fontSize: 14,
        color: '#555',
        flex: 1,
        lineHeight: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
    },
    participateButton: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
    },
    participateGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    participateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    shareButton: {
        marginHorizontal: 20,
        marginTop: 12,
        borderRadius: 12,
        backgroundColor: '#E8F5F1',
        borderWidth: 1.5,
        borderColor: '#018f64',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    shareText: {
        color: '#018f64',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    bottomPadding: {
        height: 30,
    },
});
