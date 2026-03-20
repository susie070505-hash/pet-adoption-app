import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function AdoptionFormScreen({ route, navigation }) {
  const { petId } = route.params;
  const { pets, submitAdoption, user } = useApp();
  const pet = pets.find((p) => p.id === petId);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [experience, setExperience] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !contact.trim()) {
      Alert.alert('信息不完整', '请填写姓名和联系方式后再提交。');
      return;
    }
    if (!user) {
      Alert.alert('请先登录', '您需要登录后才能提交领养申请。');
      return;
    }
    setLoading(true);
    try {
      await submitAdoption(petId, { name, contact, experience, note });
      Alert.alert(
        '申请已提交 🐾',
        '感谢您的爱心！我们已收到您的领养申请，工作人员将在 1-3 个工作日内与您联系，请耐心等待审核结果。',
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
        <Text style={styles.title}>申请领养 · {pet?.zh_name ?? ''}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepTitle}>建立初步联系</Text>

        <Text style={styles.groupTitle}>基本身份信息</Text>
        <View style={styles.card}>
          <Text style={styles.label}>姓名</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：李晨"
            placeholderTextColor="#B9B3AA"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>联系方式</Text>
          <TextInput
            style={styles.input}
            placeholder="手机或邮箱"
            placeholderTextColor="#B9B3AA"
            value={contact}
            onChangeText={setContact}
          />
        </View>

        <Text style={styles.groupTitle}>养宠经验与生活方式</Text>
        <View style={styles.card}>
          <Text style={styles.label}>养宠经验</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="请简单描述您的养宠经验…"
            placeholderTextColor="#B9B3AA"
            multiline
            value={experience}
            onChangeText={setExperience}
          />

          <Text style={styles.label}>备注</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="对领养有任何补充或问题？"
            placeholderTextColor="#B9B3AA"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.submitText}>提交申请表</Text>
          }
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  title: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#3C2A21'
  },
  stepTitle: {
    marginTop: 20,
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: '800',
    color: '#3C2A21'
  },
  groupTitle: {
    marginTop: 18,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#8A7C71'
  },
  card: {
    marginTop: 8,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: '#8A7C71'
  },
  input: {
    marginTop: 6,
    backgroundColor: '#F6ECE3',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#3C2A21'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  submitButton: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#C55A2B',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  }
});

