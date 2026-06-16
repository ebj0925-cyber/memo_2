import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
  {
    label: '반짝 아이디어',
    value: '아이디어',
    description: '떠오른 생각과 기획 씨앗',
    icon: 'lightbulb-on-outline',
    color: '#FF9500',
    bg: '#FFF9F0',
  },
  {
    label: '메모',
    value: '메모',
    description: '바로 적어둔 짧은 기록',
    icon: 'note-text-outline',
    color: '#8E8E93',
    bg: '#F4F4F6',
  },
  {
    label: '영감',
    value: '영감',
    description: '좋았던 문장과 장면',
    icon: 'sparkles',
    color: '#5856D6',
    bg: '#F5F0FF',
  },
  {
    label: '할일',
    value: '할일',
    description: '준비중, 진행중, 완료 기록',
    icon: 'checkbox-marked-circle-outline',
    color: '#34C759',
    bg: '#F2FFF5',
  },
  {
    label: '나에게 한마디',
    value: '칭찬하기',
    description: '스스로에게 남긴 응원',
    icon: 'heart-outline',
    color: '#FF8FA3',
    bg: '#FFF0F3',
  },
  {
    label: '오늘 기분',
    value: '오늘 기분',
    description: '하루의 감정과 상태',
    icon: 'emoticon-happy-outline',
    color: '#5E9BFF',
    bg: '#F0F5FF',
  },
  {
    label: '중요',
    value: '중요',
    description: '놓치면 안 되는 기록',
    icon: 'pin-outline',
    color: '#FF3B30',
    bg: '#FFF2F2',
  },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useFocusEffect(
    useCallback(() => {
      const loadCounts = async () => {
        try {
          const data = await AsyncStorage.getItem('@my_notes');
          const notes = data ? JSON.parse(data) : [];
          const nextCounts = categories.reduce<Record<string, number>>(
            (acc, category) => {
              acc[category.value] = notes.filter(
                (note: any) => note.category === category.value,
              ).length;
              return acc;
            },
            {},
          );

          setCounts(nextCounts);
        } catch (error) {
          console.error(error);
        }
      };

      loadCounts();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>생각 주머니</Text>
        <Text style={styles.headerSub}>성격별로 모인 기록을 확인해 보세요</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[styles.catCard, { borderTopColor: category.color }]}
              onPress={() => router.push(`/${category.value}`)}
            >
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.iconBadge,
                    { backgroundColor: category.bg },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={category.icon as any}
                    size={22}
                    color={category.color}
                  />
                </View>
                <Text style={[styles.countText, { color: category.color }]}>
                  {counts[category.value] ?? 0}개
                </Text>
              </View>
              <Text style={styles.catLabel}>{category.label}</Text>
              <Text style={styles.catDescription} numberOfLines={2}>
                {category.description}
              </Text>
              <View style={styles.cardBottom}>
                <Text style={[styles.openText, { color: category.color }]}>
                  모아보기
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={category.color}
                />
              </View>
            </TouchableOpacity>
          ))}
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
  scrollContent: { paddingHorizontal: 18, paddingBottom: 40 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catCard: {
    backgroundColor: '#fff',
    width: (width - 48) / 2,
    minHeight: 156,
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
    borderTopWidth: 4,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontSize: 12, fontWeight: '800' },
  catLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  catDescription: {
    minHeight: 36,
    fontSize: 12,
    lineHeight: 18,
    color: '#8E8E93',
  },
  cardBottom: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  openText: { fontSize: 12, fontWeight: '800' },
});
