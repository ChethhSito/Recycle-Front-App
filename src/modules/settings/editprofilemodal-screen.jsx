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
    Pressable
} from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper'; // 🚀 Usamos el tema de Paper
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../hooks/use-auth-store';
import { useTranslation } from '../../hooks/use-translation'; // 🗣️ Tu hook de traducción

export const EditProfileModal = ({
    visible,
    onClose,
    currentUser = {},
    onUpdateSuccess,
    theme // 🎨 Recibido desde SettingsScreen
}) => {
    const t = useTranslation();
    const { colors, dark } = theme;
    const { startUpdateProfile } = useAuthStore();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUri, setAvatarUri] = useState('');
    const [hasNewAvatar, setHasNewAvatar] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estilos dinámicos basados en el tema
    const dynamicStyles = getDynamicStyles(theme);

    useEffect(() => {
        if (visible) {
            setName(currentUser.fullName || '');
            setPhone(currentUser.phone || '');
            setAvatarUri(currentUser.avatarUrl || '');
            setHasNewAvatar(false);
        }
    }, [visible, currentUser]);

    const handleClose = () => {
        Keyboard.dismiss();
        if (onClose) onClose();
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t.editProfile.alerts.permission, t.editProfile.alerts.gallery);
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri);
            setHasNewAvatar(true);
        }
    };

    const handleSave = async () => {
        Keyboard.dismiss();
        if (!name.trim()) return Alert.alert("Error", t.editProfile.alerts.nameReq);

        setLoading(true);
        const success = await startUpdateProfile({
            fullName: name,
            phone: phone,
            imageAsset: hasNewAvatar ? { uri: avatarUri } : null
        });
        setLoading(false);

        if (success) {
            Alert.alert('Success', t.editProfile.alerts.success);
            if (onUpdateSuccess) onUpdateSuccess();
            handleClose();
        } else {
            Alert.alert('Error', t.editProfile.alerts.error);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <Pressable style={dynamicStyles.modalOverlay} onPress={handleClose}>
                    <Pressable
                        style={[dynamicStyles.modalContent, { backgroundColor: colors.surface }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.onSurface }]}>
                                {t.editProfile.title}
                            </Text>
                            <TouchableOpacity onPress={handleClose} style={[styles.closeButton, { backgroundColor: colors.surfaceVariant }]}>
                                <Icon name="close" size={22} color={colors.onSurfaceVariant} />
                            </TouchableOpacity>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            <View style={styles.avatarSection}>
                                <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                                    <Image
                                        source={avatarUri ? { uri: avatarUri } : { uri: currentUser.avatar }}
                                        style={[styles.avatar, { borderColor: colors.primary }]}
                                    />
                                    <View style={[styles.cameraOverlay, { backgroundColor: colors.primary }]}>
                                        <Icon name="camera" size={18} color={colors.onPrimary} />
                                    </View>
                                </TouchableOpacity>
                                <Text style={[styles.changePhotoText, { color: colors.primary }]}>
                                    {t.editProfile.changePhoto}
                                </Text>
                            </View>

                            <TextInput
                                label={t.editProfile.fullName}
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                style={styles.input}
                                outlineColor={colors.outline}
                                activeOutlineColor={colors.primary}
                                textColor={colors.onSurface}
                            />

                            <TextInput
                                label={t.editProfile.phone}
                                value={phone}
                                onChangeText={setPhone}
                                mode="outlined"
                                keyboardType="phone-pad"
                                style={styles.input}
                                outlineColor={colors.outline}
                                activeOutlineColor={colors.primary}
                                textColor={colors.onSurface}
                            />

                            <Button
                                mode="contained"
                                onPress={handleSave}
                                loading={loading}
                                disabled={loading}
                                buttonColor={colors.primary}
                                textColor={colors.onPrimary}
                                style={styles.saveButton}
                                labelStyle={styles.saveButtonLabel}
                            >
                                {t.editProfile.save}
                            </Button>
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const getDynamicStyles = (theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        borderRadius: 28,
        padding: 24,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});

const styles = StyleSheet.create({
    keyboardView: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    title: { fontSize: 20, fontWeight: 'bold' },
    closeButton: { padding: 6, borderRadius: 20 },
    formContainer: { alignItems: 'center' },
    avatarSection: { alignItems: 'center', marginBottom: 20 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3 },
    cameraOverlay: { position: 'absolute', bottom: 5, right: 5, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    changePhotoText: { marginTop: 10, fontWeight: '600', fontSize: 14 },
    input: { width: '100%', marginBottom: 16 },
    saveButton: { width: '100%', borderRadius: 14, marginTop: 10, paddingVertical: 4 },
    saveButtonLabel: { fontSize: 16, fontWeight: 'bold' }
});