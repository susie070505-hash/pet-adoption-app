import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import PetCard from '../components/PetCard';
import SectionHeader from '../components/SectionHeader';

export default function HomeScreen({ navigation }) {
  const { pets } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={22} color="#3C2A21" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.appName}>萌宠画廊</Text>
        </View>
        <TouchableOpacity style={styles.profileCircle}>
          <Text style={styles.profileText}>J</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>遇见你的灵魂伴侣</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#B9B3AA" />
            <Text style={styles.searchPlaceholder}>搜索品种、花色…</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>搜索</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chipRow}>
          {['狗狗', '猫咪', '兔兔', '小动物'].map((label, index) => (
            <View key={label} style={[styles.chip, index === 0 && styles.chipActive]}>
              <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        <SectionHeader title="精选画廊" actionLabel="查看全部" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
            />
          ))}
        </ScrollView>

        <SectionHeader title="更多伙伴" actionLabel="浏览列表" />

        <TouchableOpacity style={styles.listBanner} onPress={() => navigation.navigate('PetList')}>
          <View>
            <Text style={styles.listTitle}>查看所有待领养宠物</Text>
            <Text style={styles.listSub}>滚动浏览，发现更多温柔灵魂。</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#C55A2B" />
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>
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
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center'
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C2A21'
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0D3BF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileText: {
    color: '#C55A2B',
    fontWeight: '700'
  },
  welcome: {
    marginTop: 24,
    paddingHorizontal: 20,
    fontSize: 22,
    lineHeight: 30,
    color: '#3C2A21',
    fontWeight: '800'
  },
  searchRow: {
    marginTop: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4E8DE',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 42
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 13,
    color: '#B9B3AA'
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#C55A2B',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  chipRow: {
    marginTop: 18,
    paddingHorizontal: 20,
    flexDirection: 'row'
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F4E8DE',
    marginRight: 10
  },
  chipActive: {
    backgroundColor: '#C55A2B'
  },
  chipText: {
    fontSize: 12,
    color: '#8A7C71'
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  listBanner: {
    marginTop: 8,
    marginHorizontal: 20,
    backgroundColor: '#F7E3D4',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3C2A21'
  },
  listSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#8A7C71'
  }
});

