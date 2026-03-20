import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ChatInput from '../components/ChatInput';

export default function ChatDetailScreen({ route, navigation }) {
  const { chatId, petName } = route.params;
  const { chats, addMessageToChat, profile } = useApp();
  const chat = chats.find((c) => c.id === chatId);
  const [infoVisible, setInfoVisible] = useState(false);

  const handleSend = (text) => {
    addMessageToChat(chatId, text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#3C2A21" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{chat?.with_user_name || petName || '在线沟通'}</Text>
          <Text style={styles.subtitle}>通常几小时内回复</Text>
        </View>
        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <Ionicons name="information-circle-outline" size={22} color="#C55A2B" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={chat?.messages ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubbleContainer, item.is_from_user ? styles.myContainer : styles.theirContainer]}>
            <View style={[styles.bubble, item.is_from_user ? styles.myBubble : styles.theirBubble]}>
              <Text style={[styles.bubbleText, item.is_from_user ? styles.myText : styles.theirText]}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <ChatInput onSend={handleSend} />

      {/* Partner Info Modal */}
      <Modal visible={infoVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setInfoVisible(false)}>
          <View style={styles.infoSheet}>
            <View style={styles.infoAvatar}>
              <Text style={styles.infoAvatarText}>{(chat?.with_user_name || '🐾')[0]}</Text>
            </View>
            <Text style={styles.infoName}>{chat?.with_user_name || '宠物主人'}</Text>
            <Text style={styles.infoSub}>{chat?.with_city || '未知地区'}</Text>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>已通过实名认证</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setInfoVisible(false)}>
              <Text style={styles.closeBtnText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F1', paddingTop: 52 },
  headerRow: { flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'space-between' },
  headerCenter: { alignItems: 'center', flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  subtitle: { marginTop: 2, fontSize: 11, color: '#8A7C71' },
  bubbleWrapper: { marginBottom: 16, flexDirection: 'row' },
  myBubbleWrapper: { justifyContent: 'flex-end' },
  theirBubbleWrapper: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  myBubble: { backgroundColor: '#C55A2B', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  myBubbleText: { color: '#FFFFFF' },
  theirBubbleText: { color: '#3C2A21' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  infoSheet: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 30, alignItems: 'center', width: '80%' },
  infoAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0D3BF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  infoAvatarText: { fontSize: 32, fontWeight: '700', color: '#C55A2B' },
  infoName: { fontSize: 20, fontWeight: '800', color: '#3C2A21' },
  infoSub: { fontSize: 13, color: '#8A7C71', marginTop: 6 },
  infoBadge: { marginTop: 16, backgroundColor: '#F7E3D4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  infoBadgeText: { fontSize: 11, color: '#C55A2B', fontWeight: '700' },
  closeBtn: { marginTop: 24, paddingVertical: 10 },
  closeBtnText: { color: '#CBBFB6', fontSize: 14, fontWeight: '600' }
});

