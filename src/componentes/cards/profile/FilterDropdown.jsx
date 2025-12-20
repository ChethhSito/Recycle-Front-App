import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Check } from 'lucide-react-native';

export const FilterDropdown = ({ 
  visible, 
  onClose, 
  options, 
  selectedValue, 
  onSelect,
  title = "FILTRAR POR" 
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdown}>
            {/* Título del filtro */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* Opciones */}
            {options.map((option) => {
              const isSelected = selectedValue === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected
                  ]}
                  onPress={() => {
                    onSelect(option.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Check color="#018f64" size={20} strokeWidth={3} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  dropdownContainer: {
    minWidth: 200,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  titleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionSelected: {
    backgroundColor: '#E8F5F1',
  },
  optionText: {
    fontSize: 15,
    color: '#32243B',
    fontWeight: '400',
  },
  optionTextSelected: {
    color: '#018f64',
    fontWeight: '600',
  },
});
