import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function PrivacySettingsScreen({ navigation }) {
  const { profile, updateProfile } = useApp();
  const [saving, setSaving] = React.useState(false);

  const toggle = async (key, value) => {
    setSaving(true);
    try {
      await updateProfile({ [key]: value });
    } catch (err) {
      Alert.alert('保存失败', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#3C2A21" />
        </TouchableOpacity>
        <Text style={styles.title}>隐私与安全</Text>
        {saving && <ActivityIndicator size="small" color="#C55A2B" style={{ marginLeft: 8 }} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>隐私偏好</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>公开个人资料</Text>
            <Text style={styles.rowSub}>关闭后，其他用户将仅能看到您的头像和昵称</Text>
          </View>
          <Switch
            value={profile?.show_profile_to_others ?? true}
            onValueChange={(v) => toggle('show_profile_to_others', v)}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#E2D7CF', true: '#C55A2B' }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  headerRow: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' },
  title: { marginLeft: 12, fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  section: { marginTop: 24, marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16 },
  sectionTitle: { fontSize: 13, color: '#8A7C71', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: '#3C2A21' },
  rowSub: { fontSize: 12, color: '#8A7C71', marginTop: 2 },
});
