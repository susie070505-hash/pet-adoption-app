import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function PetCard({ pet, onPress }) {
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite(pet.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: pet.avatar }} style={styles.image} />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(pet.id)}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={20}
            color={favorite ? '#FF6B6B' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {pet.zh_name} ({pet.name})
        </Text>
        <Text style={styles.sub}>
          {pet.breed} · {pet.age}
        </Text>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>待领养</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  imageWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10
  },
  image: {
    width: '100%',
    height: 150
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 999,
    padding: 6
  },
  info: {
    marginTop: 4
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C2A21'
  },
  sub: {
    marginTop: 4,
    fontSize: 12,
    color: '#8A7C71'
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600'
  }
});

