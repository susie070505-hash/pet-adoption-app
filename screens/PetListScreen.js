import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import PetCard from '../components/PetCard';

export default function PetListScreen({ navigation }) {
  const { pets } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#3C2A21" />
        </TouchableOpacity>
        <Text style={styles.title}>全部待领养宠物</Text>
      </View>

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F1',
    paddingTop: 52
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#3C2A21'
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40
  }
});

