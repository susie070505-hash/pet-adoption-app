import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { supabase } from '../supabase';

export default function RegisterScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('信息不完整', '请填写手机号码和密码。');
      return;
    }
    if (password.length < 6) {
      Alert.alert('密码太短', '密码至少需要 6 位。');
      return;
    }
    if (!agree) {
      Alert.alert('隐私协议', '请先阅读并同意用户协议和隐私政策。');
      return;
    }

    setLoading(true);
    try {
      // 1. Request Location Permission
      let city = '上海'; // Default
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const reverse = await Location.reverseGeocodeAsync(loc.coords);
          if (reverse[0]?.city || reverse[0]?.district) {
            city = reverse[0].city || reverse[0].district;
          }
        }
      } catch (locErr) {
        console.log('Location error:', locErr);
      }

      // 2. Register with Supabase (Email workaround)
      const cleanPhone = phone.trim().replace(/\s/g, '').replace(/[^0-9]/g, '');
      const fakeEmail = `${cleanPhone}@m.petapp.com`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: password.trim(),
      });

      if (signUpError) {
        // If user already exists, try to log in instead
        if (signUpError.message.includes('already registered') || signUpError.status === 400 && signUpError.message.includes('User already registered')) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: fakeEmail,
            password: password.trim(),
          });
          if (signInError) throw signInError;
        } else if (signUpError.message.includes('rate limit')) {
          Alert.alert('操作太快', '系统检测到过于频繁的操作，请 60 秒后重试。');
          setLoading(false);
          return;
        } else {
          throw signUpError;
        }
      }

      // 3. Create/Update Profile
      if (data?.user || (await supabase.auth.getUser()).data.user) {
        const userId = data?.user?.id || (await supabase.auth.getUser()).data.user.id;
        await supabase.from('profiles').upsert({
          id: userId,
          nickname: `用户${cleanPhone.slice(-4)}`,
          city: city,
        });
      }

      navigation.replace('MainTabs');
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('操作失败', err.message || '请检查网络或稍后重试');
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
        <View style={styles.cityBadge}>
          <Ionicons name="location-outline" size={14} color="#C55A2B" />
          <Text style={styles.cityText}>发现梦中情宠</Text>
        </View>
      </View>

      <Text style={styles.title}>加入宠遇</Text>
      <Text style={styles.subtitle}>开启您的领养之旅，我们会根据您的位置推荐同城毛孩子。</Text>

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

        <Text style={styles.label}>设置密码</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#B9B3AA" />
          <TextInput
            style={styles.input}
            placeholder="6-16位字母或数字"
            placeholderTextColor="#B9B3AA"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.agreeRow}>
          <Switch
            value={agree}
            onValueChange={setAgree}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#E2D7CF', true: '#C55A2B' }}
          />
          <Text style={styles.agreeText}>我已阅读并知晓系统将申请定位权限，并同意《隐私政策》</Text>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, (!agree || loading) && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.registerText}>开启领养之旅</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginRow} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>已有账号？点击这里登录</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52, paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  cityBadge: {
    marginLeft: 'auto', flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7E3D4', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4
  },
  cityText: { fontSize: 12, color: '#C55A2B', marginHorizontal: 4 },
  title: { marginTop: 24, fontSize: 24, fontWeight: '800', color: '#3C2A21' },
  subtitle: { marginTop: 8, fontSize: 14, color: '#8A7C71' },
  form: { marginTop: 28 },
  label: { marginTop: 16, fontSize: 13, color: '#6B5B53', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F4E8DE', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10
  },
  input: { marginLeft: 8, flex: 1, fontSize: 14, color: '#3C2A21' },
  agreeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  agreeText: { marginLeft: 8, fontSize: 12, color: '#8A7C71', flex: 1 },
  registerButton: {
    marginTop: 24, backgroundColor: '#C55A2B',
    borderRadius: 999, paddingVertical: 14, alignItems: 'center'
  },
  registerText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loginRow: { marginTop: 18, flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 12, color: '#8A7C71', fontStyle: 'italic' },
});
