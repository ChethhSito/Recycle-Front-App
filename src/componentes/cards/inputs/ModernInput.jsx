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
  ...props 
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, !editable && styles.inputDisabled]}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon color="#018f64" size={20} />
          </View>
        )}
        <TextInput
          style={[styles.input, Icon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
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
    color: '#32243B',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    height: 56,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#EEEEEE',
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#32243B',
    padding: 0,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
});
