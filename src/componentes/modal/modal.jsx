import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// AwesomeAlert.js (Actualizado)
export const AwesomeAlert = ({ visible, onConfirm, onCancel, title, message, type = 'success' }) => {
    const isQuestion = type === 'question';
    const isError = type === 'error';

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onCancel || onConfirm} contentContainerStyle={styles.container}>
                <View style={[styles.iconCircle, { backgroundColor: isQuestion ? '#FFF9C4' : (isError ? '#FFEBEE' : '#E8F5F1') }]}>
                    <MaterialCommunityIcons
                        name={isQuestion ? "help-circle-outline" : (isError ? "alert-circle-outline" : "check-decagram")}
                        size={50}
                        color={isQuestion ? "#FBC02D" : (isError ? "#EF4444" : "#018f64")}
                    />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>

                <View style={{ width: '100%', gap: 10 }}>
                    <Button mode="contained" onPress={onConfirm} style={[styles.btn, { backgroundColor: isError ? '#EF4444' : '#018f64' }]}>
                        {isQuestion ? 'SÍ, ACEPTAR' : 'ENTENDIDO'}
                    </Button>
                    {isQuestion && (
                        <Button mode="text" onPress={onCancel} labelStyle={{ color: '#6B7280' }}>
                            CANCELAR
                        </Button>
                    )}
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30,
        marginHorizontal: width * 0.1,
        borderRadius: 30,
        alignItems: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: -70, // Efecto flotante
        borderWidth: 5,
        borderColor: 'white',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#31253B',
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
    },
    btn: {
        width: '100%',
        borderRadius: 15,
    }
});