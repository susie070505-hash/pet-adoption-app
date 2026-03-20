import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Image, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import PetCard from '../components/PetCard';
import SectionHeader from '../components/SectionHeader';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'dog', label: '狗狗', icon: 'paw', color: '#FFB347' },
  { id: 'cat', label: '猫咪', icon: 'logo-github', color: '#77DD77' },
  { id: 'bird', label: '小鸟', icon: 'logo-twitter', color: '#89CFF0' },
  { id: 'other', label: '其他', icon: 'apps', color: '#B39EB5' },
];

const AGE_RANGES = [
  { id: 'young', label: '小于1岁' },
  { id: 'adult', label: '1-3岁' },
  { id: 'senior', label: '3岁以上' },
];

const KNOWLEDGE_ARTICLES = [
  { id: '1', title: '幼犬到家第一周必看指南', author: '宠遇小助手', tag: '新手必看', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400' },
  { id: '2', title: '猫咪应激反应如何缓解？', author: '资深养宠专家', tag: '猫咪护理', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400' },
  { id: '3', title: '春季宠物过敏预防手册', author: '宠物健康管家', tag: '健康医疗', image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&q=80&w=400' },
];

export default function HomeScreen({ navigation }) {
  const { pets, profile } = useApp();
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState(profile?.city || '上海');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Filters
  const [tempSpecies, setTempSpecies] = useState(null);
  const [tempAge, setTempAge] = useState(null);
  const [activeFilters, setActiveFilters] = useState({ species: null, age: null });

  useEffect(() => {
    if (profile?.city) setSelectedCity(profile.city);
  }, [profile?.city]);

  const displayedPets = useMemo(() => {
    return pets.filter((pet) => {
      // Basic Search
      const q = searchText.trim().toLowerCase();
      const matchesSearch = !q || (
        (pet.zh_name && pet.zh_name.toLowerCase().includes(q)) ||
        (pet.breed && pet.breed.toLowerCase().includes(q)) ||
        (pet.description && pet.description.toLowerCase().includes(q)) ||
        (pet.vaccinated && q.includes('疫苗'))
      );
      
      const matchesCity = selectedCity ? pet.city === selectedCity : true;
      const matchesSpecies = activeFilters.species ? pet.species === activeFilters.species : true;
      
      // Age matching logic
      let matchesAge = true;
      if (activeFilters.age) {
        const ageNum = parseInt(pet.age) || 0;
        if (activeFilters.age === 'young') matchesAge = ageNum < 1;
        else if (activeFilters.age === 'adult') matchesAge = ageNum >= 1 && ageNum <= 3;
        else if (activeFilters.age === 'senior') matchesAge = ageNum > 3;
      }

      // Important: Only show available pets
      const isAvailable = (pet.status || 'available') === 'available';

      return matchesSearch && matchesCity && matchesSpecies && matchesAge && isAvailable;
    });
  }, [pets, searchText, selectedCity, activeFilters]);

  const applyFilters = () => {
    setActiveFilters({ species: tempSpecies, age: tempAge });
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setTempSpecies(null);
    setTempAge(null);
    setActiveFilters({ species: null, age: null });
    setFilterModalVisible(false);
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
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="options-outline" size={20} color="#FFFFFF" />
            {(activeFilters.species || activeFilters.age) && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Category Indexing */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryItem}
              onPress={() => navigation.navigate('PetList', { species: cat.id })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '22' }]}>
                <Ionicons name={cat.icon} size={24} color={cat.color} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 精选画廊 (Gallery) */}
        <SectionHeader title="精选画廊" actionLabel="全部" onAction={() => navigation.navigate('PetList')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {displayedPets.slice(0, 6).map((p) => (
            <TouchableOpacity key={p.id} style={styles.featuredCard} onPress={() => navigation.navigate('PetDetail', { petId: p.id })}>
              <Image source={{ uri: p.avatar }} style={styles.featuredImage} />
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle}>{p.zh_name} · {p.breed}</Text>
                <Text style={styles.featuredSub}>{p.city} · 准备回家</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pet Knowledge */}
        <SectionHeader title="养宠新知" actionLabel="更多" onAction={() => {}} />
        <View style={styles.knowledgeList}>
          {KNOWLEDGE_ARTICLES.map(article => (
            <TouchableOpacity 
              key={article.id} 
              style={styles.knowledgeCard}
              onPress={() => navigation.navigate('KnowledgeDetail', { articleId: article.id })}
            >
              <Image source={{ uri: article.image }} style={styles.knowledgeImg} />
              <View style={styles.knowledgeInfo}>
                <Text style={styles.knowledgeTag}>{article.tag}</Text>
                <Text style={styles.knowledgeTitle}>{article.title}</Text>
                <Text style={styles.knowledgeAuthor}>{article.author} · 刚刚</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 发现新伙伴 (Horizontal) */}
        <SectionHeader title="发现新伙伴" actionLabel="同城推荐" onAction={() => setCityModalVisible(true)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {displayedPets.map((pet) => (
            <View key={pet.id} style={{ marginRight: 12 }}>
              <PetCard pet={pet} onPress={() => navigation.navigate('PetDetail', { petId: pet.id })} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFilterModalVisible(false)}>
          <View style={[styles.modalSheet, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
            <Text style={styles.modalTitle}>筛选宠物</Text>
            
            <Text style={styles.filterGroupTitle}>宠物分类</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.filterChip, tempSpecies === cat.id && styles.filterChipActive]}
                  onPress={() => setTempSpecies(tempSpecies === cat.id ? null : cat.id)}
                >
                  <Text style={[styles.filterChipText, tempSpecies === cat.id && styles.filterChipTextActive]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterGroupTitle}>年龄段</Text>
            <View style={styles.chipRow}>
              {AGE_RANGES.map(range => (
                <TouchableOpacity
                  key={range.id}
                  style={[styles.filterChip, tempAge === range.id && styles.filterChipActive]}
                  onPress={() => setTempAge(tempAge === range.id ? null : range.id)}
                >
                  <Text style={[styles.filterChipText, tempAge === range.id && styles.filterChipTextActive]}>{range.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                <Text style={styles.clearBtnText}>重置</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                <Text style={styles.applyBtnText}>查看结果</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* City Picker Modal */}
      <Modal visible={cityModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCityModalVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>选择推荐城市</Text>
            <View style={styles.citiesGrid}>
              {['上海', '北京', '广州', '深圳', '成都', '杭州', '武汉', '南京'].map(city => (
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
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 13, color: '#8A7C71' },
  username: { fontSize: 18, fontWeight: '800', color: '#3C2A21', marginTop: 2 },
  cityButton: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7E3D4', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  cityText: { fontSize: 12, color: '#C55A2B', marginHorizontal: 4 },
  searchRow: { marginTop: 18, flexDirection: 'row', alignItems: 'center' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4E8DE', borderRadius: 18, paddingHorizontal: 12, height: 44 },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 13, color: '#3C2A21' },
  filterBtn: { marginLeft: 10, width: 44, height: 44, borderRadius: 18, backgroundColor: '#C55A2B', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  filterDot: { position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF6B6B', borderWidth: 1, borderColor: '#C55A2B' },
  featuredCard: { width: 220, height: 140, borderRadius: 24, overflow: 'hidden', marginRight: 14, backgroundColor: '#EBD9CB' },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(60,42,33,0.5)' },
  featuredTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  featuredSub: { color: '#FFD700', fontSize: 10, marginTop: 2, fontWeight: '600' },
  categoryScroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  categoryItem: { alignItems: 'center', marginRight: 24 },
  categoryIcon: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  categoryLabel: { fontSize: 13, fontWeight: '600', color: '#3C2A21' },
  knowledgeList: { paddingHorizontal: 20, marginTop: 8 },
  knowledgeCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, marginBottom: 12 },
  knowledgeImg: { width: 80, height: 80, borderRadius: 12 },
  knowledgeInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  knowledgeTag: { fontSize: 10, color: '#C55A2B', fontWeight: '700', textTransform: 'uppercase' },
  knowledgeTitle: { fontSize: 14, fontWeight: '700', color: '#3C2A21', marginTop: 4 },
  knowledgeAuthor: { fontSize: 11, color: '#8A7C71', marginTop: 6 },
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#3C2A21', marginBottom: 20 },
  filterGroupTitle: { fontSize: 14, fontWeight: '700', color: '#6B5B53', marginTop: 16, marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F4E8DE', marginRight: 10, marginBottom: 10 },
  filterChipActive: { backgroundColor: '#C55A2B' },
  filterChipText: { fontSize: 13, color: '#8A7C71' },
  filterChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  modalFooter: { flexDirection: 'row', marginTop: 24, borderTopWidth: 1, borderTopColor: '#F4E8DE', paddingTop: 20 },
  clearBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  clearBtnText: { color: '#8A7C71', fontSize: 15, fontWeight: '600' },
  applyBtn: { flex: 2, backgroundColor: '#C55A2B', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  applyBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  citiesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  cityChip: { width: '22%', marginHorizontal: '1.5%', paddingVertical: 8, borderRadius: 999, backgroundColor: '#F4E8DE', alignItems: 'center', marginBottom: 12 },
  cityChipActive: { backgroundColor: '#C55A2B' },
  cityChipText: { fontSize: 13, color: '#8A7C71' },
  cityChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
});
