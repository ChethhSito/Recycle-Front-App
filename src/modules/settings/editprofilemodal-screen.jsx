import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Pressable // <--- Usaremos Pressable que es más moderno y estable
} from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../hooks/use-auth-store';

export const EditProfileModal = ({
    visible,
    onClose,
    currentUser = {},
    onUpdateSuccess
}) => {
    const { startUpdateProfile } = useAuthStore();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUri, setAvatarUri] = useState('');
    const [hasNewAvatar, setHasNewAvatar] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            setName(currentUser.fullName || '');
            setPhone(currentUser.phone || '');
            setAvatarUri(currentUser.avatarUrl || '');
            setHasNewAvatar(false);
        }
    }, [visible, currentUser]);

    // Función segura para cerrar
    const handleClose = () => {
        Keyboard.dismiss(); // Cerrar teclado primero
        if (onClose) onClose(); // Ejecutar cierre
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso necesario', 'Necesitamos acceso a la galería.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri); // Para mostrarlo en pantalla
            setHasNewAvatar(true); // Bandera para saber que hay que subirlo
        }
    };

    const handleSave = async () => {
        Keyboard.dismiss();

        // Validaciones básicas...
        if (!name.trim()) return Alert.alert("Error", "El nombre es obligatorio");

        setLoading(true);

        // 👇 LLAMADA LIMPIA AL STORE
        // Le pasamos solo lo que necesita: Nombre, Teléfono y la FOTO NUEVA (si hay)
        // NOTA: 'imageAsset' sería el objeto completo que te dio el ImagePicker (result.assets[0])
        // Si no hay foto nueva, pasamos null.
        const success = await startUpdateProfile({
            fullName: name,
            phone: phone,
            imageAsset: hasNewAvatar ? { uri: avatarUri } : null // Pasamos el objeto simple si hay foto
        });

        setLoading(false);

        if (success) {
            Alert.alert('¡Éxito!', 'Perfil actualizado correctamente.');
            if (onUpdateSuccess) onUpdateSuccess();
            handleClose();
        } else {
            Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta de nuevo.');
        }
    };
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose} // Android Back Button
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                {/* FONDO OSCURO:
                   Usamos Pressable para detectar toques fuera del modal.
                   Al tocar el fondo oscuro, cerramos el teclado.
                */}
                <Pressable
                    style={styles.modalOverlay}
                    onPress={Keyboard.dismiss}
                >
                    {/* CONTENIDO DEL MODAL:
                       Usamos otro Pressable (o View con onStartShouldSetResponder) 
                       para evitar que el toque en el modal cierre el teclado o dispare el onPress del padre.
                    */}
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Editar Perfil</Text>

                            {/* BOTÓN DE CERRAR (La 'X') */}
                            <TouchableOpacity
                                onPress={handleClose}
                                style={styles.closeButton}
                                activeOpacity={0.6} // Feedback visual
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Área de toque más grande
                            >
                                <Icon name="close" size={22} color="#555" />
                            </TouchableOpacity>
                        </View>

                        {/* Formulario */}
                        <View style={styles.formContainer}>
                            {/* Avatar */}
                            <View style={styles.avatarSection}>
                                <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                                    <Image
                                        source={
                                            avatarUri
                                                ? { uri: avatarUri }
                                                : { uri: currentUser.avatar }
                                        }
                                        style={styles.avatar}
                                    />
                                    <View style={styles.cameraOverlay}>
                                        <Icon name="camera" size={20} color="#FFF" />
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.changePhotoText}>Cambiar foto</Text>
                            </View>

                            {/* Inputs */}
                            <TextInput
                                label="Nombre Completo"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                style={styles.input}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#018f64"
                                dense
                            />

                            <TextInput
                                label="Celular"
                                value={phone}
                                onChangeText={setPhone}
                                mode="outlined"
                                keyboardType="phone-pad"
                                style={styles.input}
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#018f64"
                                dense
                            />

                            {/* Botón Guardar */}
                            <Button
                                mode="contained"
                                onPress={handleSave}
                                loading={loading}
                                disabled={loading}
                                buttonColor="#018f64"
                                style={styles.saveButton}
                                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                            >
                                Guardar Cambios
                            </Button>
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // 1. CORRECCIÓN PRINCIPAL: flex: 1 aquí
    keyboardView: {
        flex: 1,
        width: '100%',
    },

    // 2. El overlay ahora maneja el fondo oscuro completo
    modalOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)', // Fondo oscuro semitransparente
        justifyContent: 'center', // Centra el modal verticalmente (o usa 'flex-end' para que salga abajo)
        padding: 20, // Padding para que el modal no toque los bordes de la pantalla
    },

    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        // Sombra para dar efecto de elevación
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
        width: '100%', // Asegura que use el espacio disponible
    },

    // ... (El resto de tus estilos de header, avatar, input, botones se quedan igual) ...
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    closeButton: {
        backgroundColor: '#F3F4F6',
        padding: 8,
        borderRadius: 20,
    },
    formContainer: {
        alignItems: 'center',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 25,
    },
    avatarWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#018f64',
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#018f64',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    changePhotoText: {
        marginTop: 10,
        color: '#018f64',
        fontWeight: '600',
        fontSize: 14,
    },
    input: {
        width: '100%',
        backgroundColor: '#FAFAFA',
        marginBottom: 16,
        fontSize: 15,
    },
    saveButton: {
        width: '100%',
        borderRadius: 12,
        marginTop: 10,
        elevation: 2,
    },
    saveButtonContent: {
        paddingVertical: 8,
    },
    saveButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});