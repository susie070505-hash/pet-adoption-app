import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';

export default function ChatDetailScreen({ route, navigation }) {
  const { chatId, petName } = route.params;
  const { chats, addMessageToChat } = useApp();
  const chat = chats.find((c) => c.id === chatId);

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
        <Ionicons name="call-outline" size={20} color="#C55A2B" />
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={chat?.messages ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble text={item.text} fromMe={item.is_from_user} />}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      />

      <ChatInput onSend={handleSend} />
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
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C2A21'
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: '#8A7C71'
  }
});

