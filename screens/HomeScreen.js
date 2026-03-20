import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import PetCard from '../components/PetCard';
import SectionHeader from '../components/SectionHeader';

const CATEGORIES = [
  { label: '狗狗', value: 'dog' },
  { label: '猫咪', value: 'cat' },
  { label: '小鸟', value: 'bird' },
  { label: '其他', value: 'other' },
];

const CITIES = ['上海', '北京', '广州', '深圳', '成都', '杭州', '武汉', '西安', '南京', '重庆'];

export default function HomeScreen({ navigation }) {
  const { pets } = useApp();
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [selectedCity, setSelectedCity] = useState('上海');
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const filteredPets = useCallback(() => {
    let list = pets;
    if (activeCategory) {
      list = list.filter(p => p.species === activeCategory);
    }
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      list = list.filter(p =>
        (p.zh_name && p.zh_name.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.breed && p.breed.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.vaccinated && q.includes('疫苗')) ||
        (p.neutered && q.includes('绝育')) ||
        (p.trained && q.includes('训练')) ||
        (p.good_with_kids && q.includes('孩子'))
      );
    }
    return list;
  }, [pets, activeCategory, searchText]);

  const displayedPets = filteredPets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={22} color="#3C2A21" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.appName}>萌宠画廊</Text>
        </View>
        <TouchableOpacity style={styles.cityButton} onPress={() => setCityModalVisible(true)}>
          <Ionicons name="location-outline" size={14} color="#C55A2B" />
          <Text style={styles.cityText}>{selectedCity}</Text>
          <Ionicons name="chevron-down" size={14} color="#C55A2B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>遇见你的灵魂伴侣</Text>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#B9B3AA" />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索品种、已接种疫苗…"
              placeholderTextColor="#B9B3AA"
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={18} color="#B9B3AA" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.chip, activeCategory === cat.value && styles.chipActive]}
              onPress={() => setActiveCategory(activeCategory === cat.value ? null : cat.value)}
            >
              <Text style={[styles.chipText, activeCategory === cat.value && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Gallery */}
        {!searchText && (
          <>
            <SectionHeader
              title={activeCategory ? `${CATEGORIES.find(c => c.value === activeCategory)?.label ?? '精选'}画廊` : '精选画廊'}
              actionLabel="查看全部"
              onAction={() => navigation.navigate('PetList', { species: activeCategory })}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {displayedPets.slice(0, 10).map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
                />
              ))}
            </ScrollView>

            <SectionHeader title="更多伙伴" actionLabel="浏览列表" onAction={() => navigation.navigate('PetList', { species: activeCategory })} />
            <TouchableOpacity style={styles.listBanner} onPress={() => navigation.navigate('PetList', { species: activeCategory })}>
              <View>
                <Text style={styles.listTitle}>查看所有待领养宠物</Text>
                <Text style={styles.listSub}>滚动浏览，发现更多温柔灵魂。</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#C55A2B" />
            </TouchableOpacity>
          </>
        )}

        {/* Search Results */}
        {searchText.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultTitle}>搜索结果 ({displayedPets.length})</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {displayedPets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
                />
              ))}
              {displayedPets.length === 0 && (
                <Text style={styles.noResultText}>没有找到相关宠物，换个关键词试试吧～</Text>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* City Picker Modal */}
      <Modal visible={cityModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCityModalVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>选择城市</Text>
            <FlatList
              data={CITIES}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.cityItem, selectedCity === item && styles.cityItemActive]}
                  onPress={() => { setSelectedCity(item); setCityModalVisible(false); }}
                >
                  <Text style={[styles.cityItemText, selectedCity === item && styles.cityItemTextActive]}>{item}</Text>
                  {selectedCity === item && <Ionicons name="checkmark" size={18} color="#C55A2B" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  header: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  appName: { fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  cityButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7E3D4', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4
  },
  cityText: { fontSize: 12, color: '#C55A2B', marginHorizontal: 4 },
  welcome: { marginTop: 24, paddingHorizontal: 20, fontSize: 22, lineHeight: 30, color: '#3C2A21', fontWeight: '800' },
  searchRow: { marginTop: 18, paddingHorizontal: 20 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F4E8DE', borderRadius: 18, paddingHorizontal: 12, height: 44
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 13, color: '#3C2A21' },
  chipRow: { marginTop: 18, paddingHorizontal: 20, flexDirection: 'row' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F4E8DE', marginRight: 10 },
  chipActive: { backgroundColor: '#C55A2B' },
  chipText: { fontSize: 12, color: '#8A7C71' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  listBanner: {
    marginTop: 8, marginHorizontal: 20, backgroundColor: '#F7E3D4',
    borderRadius: 20, paddingHorizontal: 18, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  listTitle: { fontSize: 15, fontWeight: '700', color: '#3C2A21' },
  listSub: { marginTop: 4, fontSize: 12, color: '#8A7C71' },
  searchResultsContainer: { paddingHorizontal: 20, marginTop: 16 },
  searchResultTitle: { fontSize: 14, fontWeight: '700', color: '#3C2A21', marginBottom: 12 },
  noResultText: { fontSize: 14, color: '#8A7C71', marginTop: 20, textAlign: 'center', width: '100%' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40, maxHeight: '60%'
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#3C2A21', marginBottom: 16 },
  cityItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F4E8DE'
  },
  cityItemActive: { backgroundColor: '#FFF7F1' },
  cityItemText: { fontSize: 15, color: '#3C2A21' },
  cityItemTextActive: { color: '#C55A2B', fontWeight: '700' },
});
