import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const categoryOptions = [
  {
    label: '반짝 아이디어',
    value: '아이디어',
    description: '떠오른 생각과 기획 씨앗을 모았어요',
    icon: 'lightbulb-on-outline',
    color: '#FF9500',
    bg: '#FFF9F0',
  },
  {
    label: '메모',
    value: '메모',
    description: '바로 적어둔 짧은 기록을 모았어요',
    icon: 'note-text-outline',
    color: '#8E8E93',
    bg: '#F4F4F6',
  },
  {
    label: '영감',
    value: '영감',
    description: '좋았던 문장과 장면을 모았어요',
    icon: 'sparkles',
    color: '#5856D6',
    bg: '#F5F0FF',
  },
  {
    label: '할일',
    value: '할일',
    description: '해야 할 일과 완료한 일을 모았어요',
    icon: 'checkbox-marked-circle-outline',
    color: '#34C759',
    bg: '#F2FFF5',
  },
  {
    label: '나에게 한마디',
    value: '칭찬하기',
    description: '스스로에게 남긴 응원을 모았어요',
    icon: 'heart-outline',
    color: '#FF8FA3',
    bg: '#FFF0F3',
  },
  {
    label: '오늘 기분',
    value: '오늘 기분',
    description: '하루의 감정과 상태를 모았어요',
    icon: 'emoticon-happy-outline',
    color: '#5E9BFF',
    bg: '#F0F5FF',
  },
  {
    label: '중요',
    value: '중요',
    description: '놓치면 안 되는 기록을 모았어요',
    icon: 'pin-outline',
    color: '#FF3B30',
    bg: '#FFF2F2',
  },
];

export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const currentCategory = String(category || '');
  const categoryInfo =
    categoryOptions.find((item) => item.value === currentCategory) || {
      label: currentCategory || '기록',
      value: currentCategory,
      description: '모아둔 기록을 확인해 보세요',
      icon: 'folder-heart-outline',
      color: '#FF9500',
      bg: '#FFF9F0',
    };

  const doneCount = useMemo(
    () => filteredNotes.filter((note) => note.status === '완료').length,
    [filteredNotes],
  );

  useEffect(() => {
    const loadFilteredNotes = async () => {
      try {
        const data = await AsyncStorage.getItem('@my_notes');
        if (data) {
          const allNotes = JSON.parse(data);
          setFilteredNotes(
            allNotes.filter((note: any) => note.category === currentCategory),
          );
        } else {
          setFilteredNotes([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadFilteredNotes();
  }, [currentCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={26}
            color="#1C1C1E"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryInfo.label}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.summaryPanel,
            {
              backgroundColor: categoryInfo.bg,
              borderColor: categoryInfo.color,
            },
          ]}
        >
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons
                name={categoryInfo.icon as any}
                size={26}
                color={categoryInfo.color}
              />
            </View>
            <View style={styles.summaryTextBox}>
              <Text style={styles.summaryTitle}>{categoryInfo.label} 모음</Text>
              <Text style={styles.summaryDescription}>
                {categoryInfo.description}
              </Text>
            </View>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: categoryInfo.color }]}>
                {filteredNotes.length}
              </Text>
              <Text style={styles.statLabel}>전체 기록</Text>
            </View>
            {currentCategory === '할일' && (
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#34C759' }]}>
                  {doneCount}
                </Text>
                <Text style={styles.statLabel}>완료</Text>
              </View>
            )}
          </View>
        </View>

        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="tray-heart"
              size={42}
              color="#C7C7CC"
            />
            <Text style={styles.emptyTitle}>아직 모인 기록이 없어요</Text>
            <Text style={styles.emptyText}>
              기록 조각에서 이 주머니에 어울리는 생각을 남겨보세요
            </Text>
          </View>
        ) : (
          filteredNotes.map((note) => {
            const hasImages = note.imgs?.length > 0;
            const hasFiles = note.files?.length > 0;
            const isDone = note.status === '완료';

            return (
              <View
                key={note.id}
                style={[
                  styles.card,
                  { borderLeftColor: categoryInfo.color },
                  isDone && styles.doneCard,
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.time}>
                    {note.date} {note.time}
                  </Text>
                  {note.status && currentCategory === '할일' && (
                    <Text
                      style={[
                        styles.statusPill,
                        {
                          color: isDone ? '#2E7D32' : categoryInfo.color,
                          backgroundColor: isDone ? '#E8F5E9' : categoryInfo.bg,
                        },
                      ]}
                    >
                      {note.status}
                    </Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.content,
                    isDone && styles.doneContent,
                  ]}
                  numberOfLines={3}
                >
                  {note.content || '(미디어 기록)'}
                </Text>

                {(hasImages || hasFiles) && (
                  <View style={styles.metaRow}>
                    {hasImages && (
                      <View style={styles.metaChip}>
                        <MaterialCommunityIcons
                          name="image-outline"
                          size={14}
                          color="#8E8E93"
                        />
                        <Text style={styles.metaText}>
                          사진 {note.imgs.length}
                        </Text>
                      </View>
                    )}
                    {hasFiles && (
                      <View style={styles.metaChip}>
                        <MaterialCommunityIcons
                          name="paperclip"
                          size={14}
                          color="#8E8E93"
                        />
                        <Text style={styles.metaText}>
                          파일 {note.files.length}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1E' },
  headerSpacer: { width: 38 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  summaryPanel: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  summaryTextBox: { flex: 1 },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  summaryDescription: { fontSize: 13, lineHeight: 19, color: '#6E6E73' },
  summaryStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  statItem: {
    minWidth: 86,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  statNumber: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#8E8E93' },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  doneCard: { opacity: 0.68 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  time: { flex: 1, fontSize: 11, color: '#AEAEB2', fontWeight: '700' },
  statusPill: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2C2C2E',
    fontWeight: '500',
  },
  doneContent: { textDecorationLine: 'line-through', color: '#8E8E93' },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#F2F2F7',
  },
  metaText: { fontSize: 11, color: '#8E8E93', fontWeight: '700' },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '800',
    color: '#8E8E93',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#C7C7CC',
    textAlign: 'center',
  },
});
