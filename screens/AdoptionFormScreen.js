import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,
  ScrollView, ActivityIndicator, Modal, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';

export default function AdoptionFormScreen({ route, navigation }) {
  const { petId } = route.params;
  const { pets, submitAdoption, user } = useApp();
  const pet = pets.find((p) => p.id === petId);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [experience, setExperience] = useState('');
  const [note, setNote] = useState('');
  const [idCardFront, setIdCardFront] = useState(null);
  const [idCardBack, setIdCardBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const pickImage = async (side) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要权限', '请在设置中允许访问相册。');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      if (side === 'front') setIdCardFront(result.assets[0].uri);
      else setIdCardBack(result.assets[0].uri);
    }
  };

  const handleSubmitPress = () => {
    if (!name.trim() || !contact.trim()) {
      Alert.alert('信息不完整', '请填写姓名和联系方式后再提交。');
      return;
    }
    if (!user) {
      Alert.alert('请先登录', '您需要登录后才能提交领养申请。');
      return;
    }
    // Show privacy policy first
    setPrivacyModalVisible(true);
  };

  const handleConfirmSubmit = async () => {
    setPrivacyModalVisible(false);
    setLoading(true);
    try {
      await submitAdoption(petId, { name, contact, experience, note, idCardFront, idCardBack });
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>建立初步联系</Text>

        <Text style={styles.groupTitle}>基本身份信息</Text>
        <View style={styles.card}>
          <Text style={styles.label}>姓名</Text>
          <TextInput style={styles.input} placeholder="例如：李晨" placeholderTextColor="#B9B3AA" value={name} onChangeText={setName} />
          <Text style={styles.label}>联系方式</Text>
          <TextInput style={styles.input} placeholder="手机或邮箱" placeholderTextColor="#B9B3AA" value={contact} onChangeText={setContact} />
        </View>

        <Text style={styles.groupTitle}>养宠经验与生活方式</Text>
        <View style={styles.card}>
          <Text style={styles.label}>养宠经验</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="请简单描述您的养宠经验…" placeholderTextColor="#B9B3AA" multiline value={experience} onChangeText={setExperience} />
          <Text style={styles.label}>备注</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="对领养有任何补充或问题？" placeholderTextColor="#B9B3AA" multiline value={note} onChangeText={setNote} />
        </View>

        <Text style={styles.groupTitle}>上传身份证（二代居民身份证）</Text>
        <View style={styles.card}>
          <Text style={styles.label}>身份证正面</Text>
          <TouchableOpacity style={styles.idUpload} onPress={() => pickImage('front')}>
            {idCardFront
              ? <Image source={{ uri: idCardFront }} style={styles.idPreview} />
              : <View style={styles.idPlaceholder}>
                  <Ionicons name="camera-outline" size={28} color="#B9B3AA" />
                  <Text style={styles.idPlaceholderText}>点击上传正面</Text>
                </View>
            }
          </TouchableOpacity>
          <Text style={styles.label}>身份证背面</Text>
          <TouchableOpacity style={styles.idUpload} onPress={() => pickImage('back')}>
            {idCardBack
              ? <Image source={{ uri: idCardBack }} style={styles.idPreview} />
              : <View style={styles.idPlaceholder}>
                  <Ionicons name="camera-outline" size={28} color="#B9B3AA" />
                  <Text style={styles.idPlaceholderText}>点击上传背面</Text>
                </View>
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.7 }]} onPress={handleSubmitPress} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitText}>提交申请表</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* Privacy Policy Modal */}
      <Modal visible={privacyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>隐私政策与数据授权</Text>
            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalBody}>
                {`在提交领养申请前，请您仔细阅读以下内容：\n\n1. 您提交的个人信息（包括姓名、联系方式、身份证信息）将用于领养资质审核，不会向第三方公开。\n\n2. 身份证信息将加密存储，仅供内部审核人员查阅，审核完成后将被妥善保管。\n\n3. 您有权随时申请删除个人数据，请联系客服处理。\n\n4. 提交申请视为您已阅读并同意以上隐私条款。`}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalConfirmBtn, !privacyAgreed && { opacity: 0.5 }]}
              onPress={handleConfirmSubmit}
              disabled={!privacyAgreed}
            >
              <Text style={styles.modalConfirmText}>同意并提交</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalAgreeRow} onPress={() => setPrivacyAgreed(!privacyAgreed)}>
              <Ionicons name={privacyAgreed ? 'checkbox' : 'square-outline'} size={20} color="#C55A2B" />
              <Text style={styles.modalAgreeText}>我已阅读并同意上述隐私政策</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setPrivacyModalVisible(false)}>
              <Text style={styles.modalCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  headerRow: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' },
  title: { marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  stepTitle: { marginTop: 20, paddingHorizontal: 20, fontSize: 20, fontWeight: '800', color: '#3C2A21' },
  groupTitle: { marginTop: 18, paddingHorizontal: 20, fontSize: 14, color: '#8A7C71' },
  card: { marginTop: 8, marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14 },
  label: { marginTop: 8, fontSize: 12, color: '#8A7C71' },
  input: { marginTop: 6, backgroundColor: '#F6ECE3', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#3C2A21' },
  textArea: { height: 80, textAlignVertical: 'top' },
  idUpload: { marginTop: 8, backgroundColor: '#F6ECE3', borderRadius: 14, height: 120, overflow: 'hidden' },
  idPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  idPlaceholderText: { marginTop: 6, fontSize: 13, color: '#B9B3AA' },
  idPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  submitButton: { marginTop: 24, marginHorizontal: 20, backgroundColor: '#C55A2B', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#3C2A21', marginBottom: 12 },
  modalBody: { fontSize: 14, color: '#6B5B53', lineHeight: 22 },
  modalAgreeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  modalAgreeText: { marginLeft: 8, fontSize: 13, color: '#3C2A21', flex: 1 },
  modalConfirmBtn: { marginTop: 16, backgroundColor: '#C55A2B', borderRadius: 999, paddingVertical: 13, alignItems: 'center' },
  modalConfirmText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalCancelBtn: { marginTop: 10, alignItems: 'center' },
  modalCancelText: { color: '#8A7C71', fontSize: 14 },
});
