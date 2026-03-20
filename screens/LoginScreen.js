import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('信息不完整', '请填写手机号码和密码。');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.trim().replace(/\s/g, '');
      const fakeEmail = `${cleanPhone}@petapp.local`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: password.trim(),
      });

      if (error) throw error;
      
      navigation.replace('MainTabs');
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('登录失败', '手机号或密码错误，请重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#3C2A21" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>账号登录</Text>
      </View>

      <Text style={styles.title}>欢迎回来</Text>
      <Text style={styles.subtitle}>输入手机号与密码即可登录，与您的毛孩子再次相遇。</Text>

      <View style={styles.form}>
        <Text style={styles.label}>手机号码</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="phone-portrait-outline" size={18} color="#B9B3AA" />
          <TextInput
            style={styles.input}
            placeholder="请输入您的手机号"
            placeholderTextColor="#B9B3AA"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Text style={styles.label}>密码</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#B9B3AA" />
          <TextInput
            style={styles.input}
            placeholder="请输入您的密码"
            placeholderTextColor="#B9B3AA"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginText}>立即登录</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchRow} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchText}>没有账号？去注册</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52, paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  title: { marginTop: 40, fontSize: 24, fontWeight: '800', color: '#3C2A21' },
  subtitle: { marginTop: 8, fontSize: 14, color: '#8A7C71' },
  form: { marginTop: 40 },
  label: { marginTop: 16, fontSize: 13, color: '#6B5B53', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F4E8DE', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12
  },
  input: { marginLeft: 8, flex: 1, fontSize: 14, color: '#3C2A21' },
  loginButton: {
    marginTop: 32, backgroundColor: '#C55A2B',
    borderRadius: 999, paddingVertical: 14, alignItems: 'center'
  },
  loginText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  switchRow: { marginTop: 20, alignItems: 'center' },
  switchText: { fontSize: 13, color: '#C55A2B', fontWeight: '600' }
});
