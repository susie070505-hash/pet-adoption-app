import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="输入消息…"
          placeholderTextColor="#B9B3AA"
          value={value}
          onChangeText={setValue}
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Ionicons name="paper-plane" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF7F1',
    borderTopWidth: 0.5,
    borderColor: '#E6DFD7',
    alignItems: 'center'
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6
  },
  input: {
    fontSize: 14,
    color: '#3C2A21'
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#C55A2B',
    borderRadius: 999,
    padding: 10
  }
});

