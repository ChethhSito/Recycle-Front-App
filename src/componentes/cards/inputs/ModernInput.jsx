import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export const ModernInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  icon: Icon,
  theme, // 🎨 Recibimos el tema desde la prop
  ...props
}) => {
  // Extraemos colores del tema o usamos valores por defecto si no se pasa el tema
  const { colors, dark } = theme || { colors: {} };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.onSurface || '#333' }]}>
          {label}
        </Text>
      )}

      <View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.surface || '#FFF',
          borderColor: colors.outlineVariant || '#E0E0E0'
        },
        !editable && {
          backgroundColor: colors.surfaceVariant || '#F5F5F5',
          borderColor: colors.outline || '#EEE'
        }
      ]}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon color={colors.primary || '#018f64'} size={20} />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            { color: colors.onSurface || '#000' },
            Icon && styles.inputWithIcon
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.outline || '#999'}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    height: 56,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
});