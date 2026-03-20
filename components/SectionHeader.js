import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C2A21'
  },
  action: {
    fontSize: 13,
    color: '#C55A2B'
  }
});

