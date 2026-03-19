import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatBubble({ text, fromMe }) {
  return (
    <View style={[styles.container, fromMe ? styles.fromMe : styles.fromOther]}>
      <View style={[styles.bubble, fromMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={fromMe ? styles.textMe : styles.textOther}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16
  },
  fromMe: {
    alignItems: 'flex-end'
  },
  fromOther: {
    alignItems: 'flex-start'
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  bubbleMe: {
    backgroundColor: '#C55A2B',
    borderBottomRightRadius: 4
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4
  },
  textMe: {
    color: '#FFFFFF',
    fontSize: 14
  },
  textOther: {
    color: '#3C2A21',
    fontSize: 14
  }
});

