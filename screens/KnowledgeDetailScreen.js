import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ARTICLES = {
  '1': {
    title: '幼犬到家第一周必看指南',
    author: '宠遇小助手',
    date: '2026-03-20',
    content: `新成员到家总是令人兴奋，但第一周也是建立习惯的关键期。

1. 准备安全空间：为幼犬准备一个安静的角落，放置舒适的窝。
2. 规律饮食：保持原主人的喂食时间，避免突然换粮导致肠胃不适。
3. 观察健康状况：注意呼吸、大便形状及精神状态。
4. 建立信任：多陪伴，但不要过度惊吓它。

记住，耐心是最好的良药。🐾`,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800'
  },
  '2': {
    title: '猫咪应激反应如何缓解？',
    author: '资深养宠专家',
    date: '2026-03-19',
    content: `猫咪是敏感的动物，搬家、新成员加入都可能引起应激。

- 提供躲避处：让猫咪有地方躲藏。
- 使用费洛蒙：可以有效安抚情绪。
- 循序渐进：如果是新猫进家，先隔离观察。
- 减少外界噪音：保持环境安静。

如果猫咪出现长时间不进食，请及时咨询兽医。`,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800'
  },
  '3': {
    title: '春季宠物过敏预防手册',
    author: '宠物健康管家',
    date: '2026-03-18',
    content: `春天万物复苏，也是过敏高发期。

- 减少外出：花粉飘散季节尽量缩短散步时间。
- 回家擦拭：用湿巾擦拭毛发和脚掌。
- 均衡营养：增强免疫力。
- 定期体检：预防皮肤炎症。

发现瘙痒、发红请尽快就医。`,
    image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&q=80&w=800'
  }
};

export default function KnowledgeDetailScreen({ route, navigation }) {
  const { articleId } = route.params;
  const article = ARTICLES[articleId] || ARTICLES['1'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#3C2A21" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>养宠新知</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: article.image }} style={styles.heroImage} />
        <View style={styles.content}>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.author}>{article.author}</Text>
            <Text style={styles.date}>{article.date}</Text>
          </View>
          <Text style={styles.body}>{article.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F4E8DE'
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#3C2A21' },
  heroImage: { width: '100%', height: 250 },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#3C2A21', lineHeight: 30 },
  meta: { flexDirection: 'row', marginTop: 12, marginBottom: 24 },
  author: { fontSize: 13, color: '#C55A2B', fontWeight: '600', marginRight: 12 },
  date: { fontSize: 13, color: '#8A7C71' },
  body: { fontSize: 15, color: '#3C2A21', lineHeight: 26 }
});
