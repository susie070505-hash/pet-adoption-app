import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>个人中心</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={22} color="#3C2A21" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800'
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>艾琳娜 · 理查森</Text>
          <Text style={styles.subtitle}>
            专注流浪宠物关怀，为每一只灵魂找到归属。
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#C55A2B" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>我的领养申请</Text>
        <View style={styles.badgeRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>库珀 · 待审核</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>账号设置</Text>
        <ProfileItem icon="person-outline" label="个人信息" />
        <ProfileItem icon="shield-checkmark-outline" label="隐私与安全" />
        <ProfileItem icon="notifications-outline" label="通知设置" />
      </View>

      <TouchableOpacity
        style={styles.uploadCard}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Ionicons name="paw" size={22} color="#C55A2B" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.uploadTitle}>上传宠物信息</Text>
          <Text style={styles.uploadSub}>帮助流浪宠物找到温暖的家</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CBBFB6" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>退出当前账号</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileItem({ icon, label }) {
  return (
    <TouchableOpacity style={styles.itemRow}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={18} color="#C55A2B" />
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBBFB6" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F1',
    paddingTop: 52
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3C2A21'
  },
  profileCard: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C2A21'
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#8A7C71'
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F0D3BF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionCard: {
    marginTop: 18,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3C2A21'
  },
  badgeRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
    marginRight: 6
  },
  statusText: {
    fontSize: 13,
    color: '#8A7C71'
  },
  itemRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemLabel: {
    marginLeft: 10,
    fontSize: 13,
    color: '#3C2A21'
  },
  logoutBtn: {
    marginTop: 24,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  logoutText: {
    fontSize: 13,
    color: '#C55A2B'
  },
  uploadCard: {
    marginTop: 18,
    marginHorizontal: 20,
    backgroundColor: '#FFF0E6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0D3BF'
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3C2A21'
  },
  uploadSub: {
    marginTop: 2,
    fontSize: 12,
    color: '#8A7C71'
  }
});

