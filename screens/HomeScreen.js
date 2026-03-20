import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import PetCard from '../components/PetCard';
import SectionHeader from '../components/SectionHeader';

const CATEGORIES = [
  { id: 'dog', label: '狗狗', icon: 'paw', color: '#FFB347' },
  { id: 'cat', label: '猫咪', icon: 'logo-github', color: '#77DD77' }, // paw-outline for cats
  { id: 'bird', label: '小鸟', icon: 'airplane', color: '#89CFF0' },
  { id: 'other', label: '其他', icon: 'apps', color: '#B39EB5' },
];

const CITIES = ['上海', '北京', '广州', '深圳', '成都', '杭州', '武汉', '西安', '南京', '重庆'];

export default function HomeScreen({ navigation }) {
  const { pets, profile } = useApp();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(profile?.city || '上海');
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [featuredPets, setFeaturedPets] = useState([]);

  // Sync city from profile if it updates
  useEffect(() => {
    if (profile?.city) setSelectedCity(profile.city);
  }, [profile?.city]);

  // Daily-ish Random Shuffled Featured Pets, prioritizing the selected city
  useEffect(() => {
    if (pets.length > 0) {
      let cityPets = pets.filter(p => p.city === selectedCity);
      let pool = cityPets.length >= 2 ? cityPets : pets;
      // Shuffle the pool
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setFeaturedPets(shuffled.slice(0, 5));
    }
  }, [pets, selectedCity]);

  const displayedPets = useMemo(() => {
    return pets.filter((pet) => {
      const q = searchText.trim().toLowerCase();
      const matchesSearch = !q || (
        (pet.zh_name && pet.zh_name.toLowerCase().includes(q)) ||
        (pet.breed && pet.breed.toLowerCase().includes(q)) ||
        (pet.description && pet.description.toLowerCase().includes(q)) ||
        (pet.age && pet.age.toString().includes(q)) ||
        (pet.gender && pet.gender.includes(q)) ||
        (pet.vaccinated && q.includes('疫苗'))
      );
      
      const matchesCategory = selectedCategory ? pet.species === selectedCategory : true;
      const matchesCity = selectedCity ? pet.city === selectedCity : true;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [pets, searchText, selectedCategory, selectedCity]);

  const handleCategoryPress = (id) => {
    setSelectedCategory(id);
    navigation.navigate('PetList', { species: id });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>下午好，</Text>
            <Text style={styles.username}>{profile?.nickname || '新用户'}</Text>
          </View>
          <TouchableOpacity style={styles.cityButton} onPress={() => setCityModalVisible(true)}>
            <Ionicons name="location-outline" size={14} color="#C55A2B" />
            <Text style={styles.cityText}>{selectedCity}</Text>
            <Ionicons name="chevron-down" size={14} color="#C55A2B" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#B9B3AA" />
            <TextInput
              style={styles.searchInput}
              placeholder="通过年龄，性别，品种...帮您找到梦中情宠"
              placeholderTextColor="#B9B3AA"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Featured Gallery - Shuffled and prioritizing city */}
        {featuredPets.length > 0 && !searchText && (
          <>
            <SectionHeader title="精选画廊" actionLabel="换一换" onAction={() => {
               const shuffled = [...pets].sort(() => 0.5 - Math.random());
               setFeaturedPets(shuffled.slice(0, 5));
            }} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {featuredPets.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.featuredCard}
                  onPress={() => navigation.navigate('PetDetail', { petId: p.id })}
                >
                  <Image source={{ uri: p.avatar }} style={styles.featuredImage} />
                  <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredTitle}>{p.zh_name} · {p.breed}</Text>
                    <Text style={styles.featuredSub}>{p.city} · 期待跟你回家 🐾</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Categories */}
        <SectionHeader title="宠物分类" actionLabel="全部" onAction={() => navigation.navigate('PetList', { species: null })} />
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryItem]}
              onPress={() => handleCategoryPress(cat.id)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.categoryName}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommendation List */}
        <SectionHeader 
          title={selectedCategory ? `${CATEGORIES.find(c => c.id === selectedCategory).label}待领养` : "为你推荐"} 
          actionLabel="查看全部" 
          onAction={() => navigation.navigate('PetList', { species: selectedCategory })} 
        />
        <View style={styles.petGrid}>
          {displayedPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
            />
          ))}
          {displayedPets.length === 0 && (
            <Text style={styles.noResultText}>在该城市没找到相关宠物哦，换个关键词试试？</Text>
          )}
        </View>
      </ScrollView>

      {/* City Picker Modal */}
      <Modal visible={cityModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCityModalVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>选择推荐城市</Text>
            <View style={styles.citiesGrid}>
              {CITIES.map(city => (
                <TouchableOpacity
                  key={city}
                  style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
                  onPress={() => { setSelectedCity(city); setCityModalVisible(false); }}
                >
                  <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  header: { paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 13, color: '#8A7C71' },
  username: { fontSize: 18, fontWeight: '800', color: '#3C2A21', marginTop: 2 },
  cityButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7E3D4', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4
  },
  cityText: { fontSize: 12, color: '#C55A2B', marginHorizontal: 4 },
  searchRow: { marginTop: 18, flexDirection: 'row', alignItems: 'center' },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F4E8DE', borderRadius: 18, paddingHorizontal: 12, height: 44
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 12, color: '#3C2A21' },
  filterBtn: { marginLeft: 10, width: 44, height: 44, borderRadius: 18, backgroundColor: '#C55A2B', justifyContent: 'center', alignItems: 'center' },
  featuredCard: { width: 260, height: 160, borderRadius: 24, overflow: 'hidden', marginRight: 16, backgroundColor: '#EBD9CB' },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
  featuredTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  featuredSub: { color: '#F0E4DB', fontSize: 11, marginTop: 2 },
  categoriesRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 8 },
  categoryItem: { alignItems: 'center', width: 64 },
  categoryIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  categoryName: { fontSize: 12, fontWeight: '600', color: '#3C2A21' },
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 8 },
  noResultText: { fontSize: 13, color: '#8A7C71', marginTop: 40, textAlign: 'center', width: '100%' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#3C2A21', marginBottom: 18 },
  citiesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  cityChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F4E8DE', marginRight: 10, marginBottom: 10 },
  cityChipActive: { backgroundColor: '#C55A2B' },
  cityChipText: { fontSize: 13, color: '#8A7C71' },
  cityChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
});
