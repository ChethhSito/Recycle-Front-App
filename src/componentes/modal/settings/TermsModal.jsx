import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const TermsModal = ({ visible, onClose }) => {
    const [activeTab, setActiveTab] = useState('terms');

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Términos y Privacidad</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={28} color="#32243B" />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'terms' && styles.tabActive]}
                            onPress={() => setActiveTab('terms')}
                        >
                            <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>
                                Términos de Uso
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'privacy' && styles.tabActive]}
                            onPress={() => setActiveTab('privacy')}
                        >
                            <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>
                                Privacidad
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView 
                        style={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {activeTab === 'terms' ? (
                            <View style={styles.legalContent}>
                                <Text style={styles.legalTitle}>Términos y Condiciones de Uso</Text>
                                <Text style={styles.legalDate}>Última actualización: 5 de enero de 2026</Text>

                                <Text style={styles.legalSectionTitle}>1. Aceptación de los Términos</Text>
                                <Text style={styles.legalText}>
                                    Al acceder y utilizar la aplicación Nos Planet ("la App"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con estos términos, por favor no utilice la aplicación.
                                </Text>

                                <Text style={styles.legalSectionTitle}>2. Uso de la Aplicación</Text>
                                <Text style={styles.legalText}>
                                    La App proporciona una plataforma para promover el reciclaje y la sostenibilidad ambiental. Los usuarios pueden acumular EcoPuntos por sus actividades de reciclaje y canjearlos por recompensas.
                                </Text>

                                <Text style={styles.legalSectionTitle}>3. Cuenta de Usuario</Text>
                                <Text style={styles.legalText}>
                                    • Debe proporcionar información precisa y actualizada al crear su cuenta.{'\n'}
                                    • Es responsable de mantener la seguridad de su contraseña.{'\n'}
                                    • No puede compartir su cuenta con terceros.{'\n'}
                                    • Debe notificarnos inmediatamente si sospecha un uso no autorizado.
                                </Text>

                                <Text style={styles.legalSectionTitle}>4. EcoPuntos y Recompensas</Text>
                                <Text style={styles.legalText}>
                                    • Los EcoPuntos no tienen valor monetario.{'\n'}
                                    • Los puntos no son transferibles entre usuarios.{'\n'}
                                    • Nos reservamos el derecho de modificar el sistema de puntos.{'\n'}
                                    • Las recompensas están sujetas a disponibilidad.
                                </Text>

                                <Text style={styles.legalSectionTitle}>5. Conducta del Usuario</Text>
                                <Text style={styles.legalText}>
                                    No está permitido:{'\n'}
                                    • Manipular el sistema de puntos{'\n'}
                                    • Proporcionar información falsa{'\n'}
                                    • Acosar o intimidar a otros usuarios{'\n'}
                                    • Usar la App para fines ilegales
                                </Text>

                                <Text style={styles.legalSectionTitle}>6. Modificaciones</Text>
                                <Text style={styles.legalText}>
                                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la App.
                                </Text>

                                <Text style={styles.legalSectionTitle}>7. Contacto</Text>
                                <Text style={styles.legalText}>
                                    Para preguntas sobre estos términos, contáctenos:
                                </Text>
                                <TouchableOpacity
                                    style={styles.contactCard}
                                    onPress={() => Linking.openURL('mailto:soporte@nosplanet.pe?subject=Consulta sobre Términos de Uso')}
                                >
                                    <Icon name="email" size={24} color="#018f64" />
                                    <Text style={styles.contactText}>soporte@nosplanet.pe</Text>
                                    <Icon name="chevron-right" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.legalContent}>
                                <Text style={styles.legalTitle}>Política de Privacidad</Text>
                                <Text style={styles.legalDate}>Última actualización: 5 de enero de 2026</Text>

                                <Text style={styles.legalSectionTitle}>1. Información que Recopilamos</Text>
                                <Text style={styles.legalText}>
                                    Recopilamos información que usted nos proporciona directamente:{'\n'}
                                    • Nombre completo y datos de contacto{'\n'}
                                    • Dirección de correo electrónico{'\n'}
                                    • Información de perfil{'\n'}
                                    • Historial de reciclaje y puntos acumulados
                                </Text>

                                <Text style={styles.legalSectionTitle}>2. Cómo Usamos su Información</Text>
                                <Text style={styles.legalText}>
                                    Utilizamos la información recopilada para:{'\n'}
                                    • Proporcionar y mejorar nuestros servicios{'\n'}
                                    • Gestionar su cuenta y EcoPuntos{'\n'}
                                    • Comunicarnos con usted{'\n'}
                                    • Personalizar su experiencia{'\n'}
                                    • Enviar notificaciones relevantes
                                </Text>

                                <Text style={styles.legalSectionTitle}>3. Compartir Información</Text>
                                <Text style={styles.legalText}>
                                    No vendemos su información personal. Podemos compartir información con:{'\n'}
                                    • Partners de convenios (solo lo necesario para canjear premios){'\n'}
                                    • Proveedores de servicios que nos ayudan a operar la App{'\n'}
                                    • Autoridades cuando sea requerido por ley
                                </Text>

                                <Text style={styles.legalSectionTitle}>4. Seguridad de Datos</Text>
                                <Text style={styles.legalText}>
                                    Implementamos medidas de seguridad para proteger su información, incluyendo encriptación, autenticación de dos factores y auditorías regulares.
                                </Text>

                                <Text style={styles.legalSectionTitle}>5. Sus Derechos</Text>
                                <Text style={styles.legalText}>
                                    Usted tiene derecho a:{'\n'}
                                    • Acceder a su información personal{'\n'}
                                    • Solicitar corrección de datos inexactos{'\n'}
                                    • Eliminar su cuenta y datos asociados{'\n'}
                                    • Exportar sus datos
                                </Text>

                                <Text style={styles.legalSectionTitle}>6. Cookies y Tecnologías</Text>
                                <Text style={styles.legalText}>
                                    Usamos cookies y tecnologías similares para mejorar la experiencia del usuario, analizar el uso de la App y personalizar el contenido.
                                </Text>

                                <Text style={styles.legalSectionTitle}>7. Contacto</Text>
                                <Text style={styles.legalText}>
                                    Para preguntas sobre privacidad, contáctenos:
                                </Text>
                                <TouchableOpacity
                                    style={styles.contactCard}
                                    onPress={() => Linking.openURL('mailto:soporte@nosplanet.pe?subject=Consulta sobre Política de Privacidad')}
                                >
                                    <Icon name="email" size={24} color="#018f64" />
                                    <Text style={styles.contactText}>soporte@nosplanet.pe</Text>
                                    <Icon name="chevron-right" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#018f64',
    },
    tabText: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#018f64',
        fontWeight: '600',
    },
    scrollContent: {
        maxHeight: '100%',
    },
    legalContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    legalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    legalDate: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 20,
    },
    legalSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    legalText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
        marginBottom: 12,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
        marginBottom: 20,
    },
    contactText: {
        fontSize: 15,
        color: '#1F2937',
        marginLeft: 12,
        flex: 1,
        fontWeight: '500',
    },
});
