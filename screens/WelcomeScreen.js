import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.cardLarge}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800'
            }}
            style={styles.imgLarge}
          />
        </View>
        <View style={styles.cardSmall}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800'
            }}
            style={styles.imgSmall}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.badge}>宠遇</Text>
        <Text style={styles.title}>欢迎来到{'\n'}宠遇</Text>
        <Text style={styles.subtitle}>
          为每一个流浪的小生命，寻找一份属于它们的温暖承诺。
        </Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryText}>立即开始</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>已有账号？立即登录</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>了解更多</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>帮助与支持</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F1',
    paddingHorizontal: 24,
    paddingTop: 60
  },
  hero: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardLarge: {
    width: 210,
    height: 230,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#EEE0D6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  imgLarge: {
    width: '100%',
    height: '100%'
  },
  cardSmall: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    width: 130,
    height: 140,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFF7F1',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }
  },
  imgSmall: {
    width: '100%',
    height: '100%'
  },
  content: {
    marginTop: 28
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F7D8BF',
    color: '#C55A2B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '600'
  },
  title: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: '800',
    color: '#3C2A21',
    lineHeight: 32
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#8A7C71'
  },
  primaryButton: {
    backgroundColor: '#C55A2B',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  loginLink: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 4
  },
  loginLinkText: {
    fontSize: 13,
    color: '#8A7C71',
    fontWeight: '500'
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerLink: {
    fontSize: 13,
    color: '#8A7C71'
  }
});

