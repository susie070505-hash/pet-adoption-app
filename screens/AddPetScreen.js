import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';
import { useApp } from '../context/AppContext';

export default function AddPetScreen({ navigation }) {
  const { user } = useApp();
  const [name, setName] = useState('');
  const [zhName, setZhName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !zhName.trim() || !breed.trim()) {
      Alert.alert('信息不完整', '请至少填写英文名、中文名和品种。');
      return;
    }
    if (!user) {
      Alert.alert('请先登录', '登录后才能提交宠物信息。');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('pet_submissions').insert({
        submitter_id: user.id,
        name: name.trim(),
        zh_name: zhName.trim(),
        breed: breed.trim(),
        age: age.trim(),
        avatar: avatar.trim(),
        description: description.trim(),
        status: 'pending',
      });
      if (error) throw error;
      Alert.alert(
        '提交成功 🐾',
        '感谢您的爱心！我们将尽快审核您上传的宠物信息，审核通过后将显示在首页。',
        [{ text: '好的', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('提交失败', err.message || '请稍后重试');
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
        <Text style={styles.title}>上传宠物信息</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepTitle}>填写宠物资料</Text>

        <Text style={styles.groupTitle}>基本信息</Text>
        <View style={styles.card}>
          <Text style={styles.label}>中文名 *</Text>
          <TextInput style={styles.input} placeholder="例如：小白" placeholderTextColor="#B9B3AA" value={zhName} onChangeText={setZhName} />

          <Text style={styles.label}>英文名 *</Text>
          <TextInput style={styles.input} placeholder="例如：Snowy" placeholderTextColor="#B9B3AA" value={name} onChangeText={setName} />

          <Text style={styles.label}>品种 *</Text>
          <TextInput style={styles.input} placeholder="例如：拉布拉多" placeholderTextColor="#B9B3AA" value={breed} onChangeText={setBreed} />

          <Text style={styles.label}>年龄</Text>
          <TextInput style={styles.input} placeholder="例如：1岁" placeholderTextColor="#B9B3AA" value={age} onChangeText={setAge} />
        </View>

        <Text style={styles.groupTitle}>图片与介绍</Text>
        <View style={styles.card}>
          <Text style={styles.label}>图片链接 (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="粘贴宠物照片的网络地址"
            placeholderTextColor="#B9B3AA"
            value={avatar}
            onChangeText={setAvatar}
            autoCapitalize="none"
          />

          <Text style={styles.label}>宠物介绍</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="描述一下这个小家伙的性格、习惯…"
            placeholderTextColor="#B9B3AA"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.submitText}>提交信息</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  headerRow: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' },
  title: { marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  stepTitle: { marginTop: 20, paddingHorizontal: 20, fontSize: 20, fontWeight: '800', color: '#3C2A21' },
  groupTitle: { marginTop: 18, paddingHorizontal: 20, fontSize: 14, color: '#8A7C71' },
  card: {
    marginTop: 8, marginHorizontal: 20, backgroundColor: '#FFFFFF',
    borderRadius: 18, padding: 14
  },
  label: { marginTop: 8, fontSize: 12, color: '#8A7C71' },
  input: {
    marginTop: 6, backgroundColor: '#F6ECE3', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#3C2A21'
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: {
    marginTop: 24, marginHorizontal: 20, backgroundColor: '#C55A2B',
    borderRadius: 999, paddingVertical: 14, alignItems: 'center'
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});
