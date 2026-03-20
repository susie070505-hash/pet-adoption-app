import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { profile, updateProfile } = useApp();
  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ nickname: nickname.trim(), city: city.trim() });
      Alert.alert('保存成功', '个人信息已更新。');
      navigation.goBack();
    } catch (err) {
      Alert.alert('保存失败', err.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#3C2A21" />
        </TouchableOpacity>
        <Text style={styles.title}>编辑个人信息</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.label}>昵称</Text>
          <TextInput
            style={styles.input}
            placeholder="设置你的昵称"
            placeholderTextColor="#B9B3AA"
            value={nickname}
            onChangeText={setNickname}
          />
          <Text style={styles.label}>所在地</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：上海"
            placeholderTextColor="#B9B3AA"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveBtnText}>保存</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  headerRow: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' },
  title: { marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 24 },
  label: { fontSize: 12, color: '#8A7C71', marginTop: 12 },
  input: { marginTop: 6, backgroundColor: '#F6ECE3', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#3C2A21' },
  saveBtn: { backgroundColor: '#C55A2B', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
