import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const categories = [
  { label: '반짝 아이디어', value: '아이디어', color: '#FF9500' },
  { label: '메모', value: '메모', color: '#8E8E93' },
  { label: '영감', value: '영감', color: '#5856D6' },
  { label: '할일', value: '할일', color: '#34C759' },
  { label: '나에게 한마디', value: '칭찬하기', color: '#FFB7B2' },
  { label: '오늘 기분', value: '오늘 기분', color: '#B2CEFE' },
  { label: '중요', value: '중요', color: '#FF3B30' },
];

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>생각 주머니</Text>
        <Text style={styles.headerSub}>성격별로 모인 기록을 확인해 보세요</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {categories.map((category) => {
            const [firstWord, ...rest] = category.label.split(' ');
            const displayTitle = rest.length > 0 ? rest.join(' ') : category.label;

            return (
              <TouchableOpacity
                key={category.value}
                style={[styles.catCard, { borderTopColor: category.color }]}
                onPress={() => router.push(`/${category.value}`)}
              >
                <Text style={styles.catEmoji}>{firstWord}</Text>
                <Text style={styles.catLabel}>{displayTitle}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#AEAEB2"
                  style={styles.arrow}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSub: { fontSize: 14, color: '#8E8E93', marginTop: 5 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catCard: {
    backgroundColor: '#fff',
    width: (width - 50) / 2,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderTopWidth: 4,
    elevation: 3,
  },
  catEmoji: { fontSize: 18, marginBottom: 10, fontWeight: '700' },
  catLabel: { fontSize: 16, fontWeight: 'bold' },
  arrow: { position: 'absolute', bottom: 20, right: 15 },
});
