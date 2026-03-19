import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ChatListScreen({ navigation }) {
  const { chats } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>消息中心</Text>
        <Ionicons name="ellipsis-horizontal" size={22} color="#3C2A21" />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.with.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatName}>{item.with}</Text>
              <Text style={styles.chatPreview} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBBFB6" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>暂时没有会话</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3C2A21'
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0D3BF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    color: '#C55A2B',
    fontWeight: '700',
    fontSize: 18
  },
  chatName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3C2A21'
  },
  chatPreview: {
    marginTop: 4,
    fontSize: 12,
    color: '#8A7C71'
  },
  empty: {
    marginTop: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: '#8A7C71'
  }
});

