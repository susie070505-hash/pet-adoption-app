import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const STATUS_COLOR = { pending: '#FFC107', approved: '#4CAF50', rejected: '#F44336' };
const STATUS_LABEL = { pending: '审核中', approved: '已通过', rejected: '未通过' };

export default function ProfileScreen({ navigation }) {
  const { user, profile, signOut, adoptionApplications } = useApp();

  const handleSignOut = () => {
    Alert.alert('退出登录', '确定要退出当前账号吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定退出', style: 'destructive', onPress: async () => {
          await signOut();
          navigation.replace('Welcome');
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>个人中心</Text>
      </View>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(profile?.nickname ?? user?.email ?? 'U')[0].toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile?.nickname ?? '用户'}</Text>
          <Text style={styles.subtitle}>{profile?.city ?? '未设置所在地'}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="pencil" size={16} color="#C55A2B" />
        </TouchableOpacity>
      </View>

      {/* My Adoption Applications */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>我的领养申请</Text>
        {adoptionApplications.length === 0 ? (
          <Text style={styles.emptyText}>暂无申请记录</Text>
        ) : (
          adoptionApplications.map((app) => (
            <View key={app.id} style={styles.appRow}>
              <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[app.status] ?? '#FFC107' }]} />
              <Text style={styles.appPetName}>{app.pets?.zh_name ?? `宠物 ${app.pet_id.slice(0, 6)}`}</Text>
              <Text style={styles.appStatus}>{STATUS_LABEL[app.status] ?? app.status}</Text>
            </View>
          ))
        )}
      </View>

      {/* Account settings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>账号设置</Text>
        <ProfileItem icon="person-outline" label="个人信息" onPress={() => navigation.navigate('EditProfile')} />
        <ProfileItem icon="shield-checkmark-outline" label="隐私与安全" onPress={() => navigation.navigate('PrivacySettings')} />
      </View>

      {/* Upload Pet */}
      <TouchableOpacity style={styles.uploadCard} onPress={() => navigation.navigate('AddPet')}>
        <Ionicons name="paw" size={22} color="#C55A2B" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.uploadTitle}>上传宠物信息</Text>
          <Text style={styles.uploadSub}>帮助流浪宠物找到温暖的家</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CBBFB6" />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
        <Text style={styles.logoutText}>退出当前账号</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.itemRow} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={18} color="#C55A2B" />
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBBFB6" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  headerRow: { paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#3C2A21' },
  profileCard: {
    marginTop: 20, marginHorizontal: 20, backgroundColor: '#FFFFFF',
    borderRadius: 22, padding: 16, flexDirection: 'row', alignItems: 'center'
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0D3BF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#C55A2B' },
  name: { fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  subtitle: { marginTop: 4, fontSize: 12, color: '#8A7C71' },
  editButton: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1,
    borderColor: '#F0D3BF', justifyContent: 'center', alignItems: 'center'
  },
  sectionCard: {
    marginTop: 18, marginHorizontal: 20, backgroundColor: '#FFFFFF',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#3C2A21', marginBottom: 4 },
  emptyText: { fontSize: 13, color: '#B9B3AA', marginTop: 8 },
  appRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  appPetName: { flex: 1, fontSize: 13, color: '#3C2A21' },
  appStatus: { fontSize: 12, color: '#8A7C71' },
  itemRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemLabel: { marginLeft: 10, fontSize: 13, color: '#3C2A21' },
  uploadCard: {
    marginTop: 18, marginHorizontal: 20, backgroundColor: '#FFF0E6',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F0D3BF'
  },
  uploadTitle: { fontSize: 14, fontWeight: '700', color: '#3C2A21' },
  uploadSub: { marginTop: 2, fontSize: 12, color: '#8A7C71' },
  logoutBtn: { marginTop: 24, marginHorizontal: 20, alignItems: 'center' },
  logoutText: { fontSize: 13, color: '#C55A2B' },
});
