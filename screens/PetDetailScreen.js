import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

function Toast({ visible, message }) {
  if (!visible) return null;
  return (
    <View style={toastStyles.container}>
      <Text style={toastStyles.text}>{message}</Text>
    </View>
  );
}
const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 100, left: 40, right: 40,
    backgroundColor: '#3C2A21', borderRadius: 20, paddingVertical: 12,
    paddingHorizontal: 16, alignItems: 'center', zIndex: 999,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
  },
  text: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' }
});

export default function PetDetailScreen({ route, navigation }) {
  const { petId } = route.params;
  const { pets, isFavorite, toggleFavorite, user } = useApp();
  const pet = pets.find((p) => p.id === petId);
  const favorite = isFavorite(petId);
  const [toastVisible, setToastVisible] = useState(false);

  if (!pet) return null;

  const handleFavorite = () => {
    if (!user) {
      Alert.alert('请先登录', '登录后才能收藏宠物哦～');
      return;
    }
    toggleFavorite(pet.id);
    if (!favorite) {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    }
  };

  const handleContactOwner = () => {
    // navigate to ChatDetail using a deterministic chat id based on petId
    navigation.navigate('ChatDetail', { chatId: `pet-${pet.id}`, petName: pet.zh_name });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: pet.avatar }} style={styles.image} />
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color="#3C2A21" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleFavorite}>
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={20}
                color={favorite ? '#FF6B6B' : '#3C2A21'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.name}>{pet.zh_name} ({pet.name})</Text>
              <Text style={styles.location}>{pet.city} · {pet.breed}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>待领养</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>年龄</Text>
              <Text style={styles.metaValue}>{pet.age}</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>品种</Text>
              <Text style={styles.metaValue}>{pet.breed}</Text>
            </View>
            <View style={[styles.metaCard, { marginRight: 0 }]}>
              <Text style={styles.metaLabel}>性别</Text>
              <Text style={styles.metaValue}>{pet.gender}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>关于我</Text>
          <Text style={styles.description}>{pet.description}</Text>

          <View style={styles.tagsRow}>
            <Tag label="已接种疫苗" active={pet.vaccinated} />
            <Tag label="已基础训练" active={pet.trained} />
            <Tag label="与孩子友好" active={pet.good_with_kids} />
            <Tag label="已绝育" active={pet.neutered} />
          </View>

          {/* Contact Owner */}
          <View style={styles.orgCard}>
            <View style={styles.orgAvatar}>
              <Text style={styles.orgInitial}>🐾</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orgName}>{pet.owner_name ?? '宠物原主'}</Text>
              <Text style={styles.orgSub}>点击右侧按钮与原主联系</Text>
            </View>
            <TouchableOpacity style={styles.orgChat} onPress={handleContactOwner}>
              <Ionicons name="chatbubbles-outline" size={18} color="#C55A2B" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate('AdoptionForm', { petId: pet.id })}
        >
          <Text style={styles.applyText}>申请领养</Text>
          <Ionicons name="paw" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      <Toast visible={toastVisible} message="收藏成功，期待跟您回家 🐾" />
    </View>
  );
}

function Tag({ label, active }) {
  return (
    <View style={[styles.tag, active ? styles.tagActive : styles.tagInactive]}>
      <Text style={[styles.tagText, active ? styles.tagTextActive : styles.tagTextInactive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1' },
  imageWrapper: { height: 320, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden', backgroundColor: '#EBD9CB' },
  image: { width: '100%', height: '100%' },
  topBar: { position: 'absolute', top: 48, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF7F1', justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 22, fontWeight: '800', color: '#3C2A21' },
  location: { marginTop: 4, fontSize: 13, color: '#8A7C71' },
  badge: { backgroundColor: '#F7D8BF', borderRadius: 18, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, color: '#C55A2B', fontWeight: '600' },
  metaRow: { flexDirection: 'row', marginTop: 18, justifyContent: 'space-between' },
  metaCard: { flex: 1, backgroundColor: '#FFFFFF', marginRight: 10, paddingVertical: 10, borderRadius: 16, alignItems: 'center' },
  metaLabel: { fontSize: 12, color: '#8A7C71' },
  metaValue: { marginTop: 4, fontSize: 14, color: '#3C2A21', fontWeight: '600' },
  sectionTitle: { marginTop: 22, fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  description: { marginTop: 8, fontSize: 14, color: '#6B5B53', lineHeight: 20 },
  tagsRow: { marginTop: 18, flexDirection: 'row', flexWrap: 'wrap' },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginRight: 8, marginBottom: 8 },
  tagActive: { backgroundColor: '#F7E3D4' },
  tagInactive: { backgroundColor: '#F0E4DB' },
  tagText: { fontSize: 11 },
  tagTextActive: { color: '#C55A2B', fontWeight: '600' },
  tagTextInactive: { color: '#8A7C71' },
  orgCard: { marginTop: 22, backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
  orgAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F0D3BF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  orgInitial: { fontSize: 20 },
  orgName: { fontSize: 14, fontWeight: '700', color: '#3C2A21' },
  orgSub: { marginTop: 2, fontSize: 12, color: '#8A7C71' },
  orgChat: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#F0D3BF', justifyContent: 'center', alignItems: 'center' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 24, paddingHorizontal: 20 },
  applyButton: { backgroundColor: '#C55A2B', borderRadius: 999, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  applyText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
