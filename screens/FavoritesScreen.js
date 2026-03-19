import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useApp } from '../context/AppContext';
import PetCard from '../components/PetCard';

export default function FavoritesScreen({ navigation }) {
  const { pets, favorites } = useApp();
  const favoritePets = pets.filter((p) => favorites.includes(p.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>我的收藏</Text>
      {favoritePets.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>还没有收藏任何宠物～</Text>
        </View>
      ) : (
        <FlatList
          data={favoritePets}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F1',
    paddingTop: 52
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: '800',
    color: '#3C2A21'
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: '#8A7C71'
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40
  }
});

