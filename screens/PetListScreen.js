import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import PetCard from '../components/PetCard';

const SPECIES_LABEL = { dog: '狗狗', cat: '猫咪', bird: '小鸟', other: '其他' };

export default function PetListScreen({ route, navigation }) {
  const { pets } = useApp();
  const species = route?.params?.species ?? null;

  const filteredPets = pets.filter(p => {
    const matchesSpecies = species ? (p.species === species || p.species === (species === 'dog' ? 'dog' : species)) : true;
    const isAvailable = (p.status || 'available') === 'available';
    return matchesSpecies && isAvailable;
  });
  const title = species ? `${SPECIES_LABEL[species] ?? '全部'}待领养` : '所有等爱的毛孩子';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#3C2A21" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      <FlatList
        data={filteredPets}
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
        ListEmptyComponent={<Text style={styles.emptyText}>暂时还没有{SPECIES_LABEL[species] ?? ''}等待领养哦～</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  title: { marginLeft: 12, fontSize: 18, fontWeight: '700', color: '#3C2A21' },
  listContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  emptyText: { textAlign: 'center', marginTop: 60, fontSize: 14, color: '#8A7C71' }
});
