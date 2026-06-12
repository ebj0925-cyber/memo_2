import EditModal from '@/components/EditModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales.ko = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

export default function ExploreScreen() {
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const convertFormat = useCallback((dateStr: string) => {
    const match = dateStr.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
    if (!match) return null;

    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }, []);

  const markedDates = useMemo(() => {
    const marks: any = {};

    allNotes.forEach((note) => {
      const dateKey = convertFormat(note.date);
      if (dateKey) {
        marks[dateKey] = { marked: true, dotColor: '#007AFF' };
      }
    });

    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: '#007AFF',
      selectedTextColor: '#fff',
    };

    return marks;
  }, [allNotes, convertFormat, selectedDate]);

  const loadAllNotes = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@my_notes');
      const notes = jsonValue != null ? JSON.parse(jsonValue) : [];
      setAllNotes(notes);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAllNotes();
    }, [loadAllNotes]),
  );

  const saveNotes = async (newNotes: any[]) => {
    try {
      await AsyncStorage.setItem('@my_notes', JSON.stringify(newNotes));
    } catch (error) {
      console.error(error);
    }
  };

  const updateNote = (updatedNote: any) => {
    const updated = allNotes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note,
    );
    setAllNotes(updated);
    saveNotes(updated);
    setModalVisible(false);
  };

  const dayNotes = allNotes.filter(
    (note) => convertFormat(note.date) === selectedDate,
  );

  const getCatColor = (category: string) => {
    switch (category) {
      case '중요':
        return '#FF3B30';
      case '영감':
        return '#5856D6';
      case '아이디어':
        return '#FF9500';
      case '할일':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>아이디어 달력</Text>
      </View>

      <Calendar
        current={selectedDate}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#007AFF',
          todayTextColor: '#007AFF',
          arrowColor: '#007AFF',
          dotColor: '#007AFF',
        }}
      />

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          선택한 날의 기록 <Text style={{ color: '#007AFF' }}>{dayNotes.length}</Text>
        </Text>
      </View>

      <ScrollView style={styles.dayNoteList}>
        {dayNotes.length > 0 ? (
          dayNotes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.miniCard}
              onPress={() => {
                setSelectedNote(note);
                setModalVisible(true);
              }}
            >
              <View
                style={[
                  styles.catDot,
                  { backgroundColor: getCatColor(note.category) },
                ]}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.miniContent,
                    note.status === '완료' && { color: '#AEAEB2' },
                  ]}
                  numberOfLines={1}
                >
                  {note.content || '(미디어 기록)'}
                </Text>
                <Text style={styles.miniTime}>
                  {note.time} · {note.category}
                </Text>
              </View>
              {note.status === '완료' && (
                <Text style={styles.compLabel}>완료</Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>이날은 아직 기록이 없어요</Text>
          </View>
        )}
      </ScrollView>

      <EditModal
        visible={modalVisible}
        note={selectedNote}
        onClose={() => setModalVisible(false)}
        onSave={updateNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F2F2F7',
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  listHeader: {
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderColor: '#F2F2F7',
  },
  listTitle: { fontSize: 13, fontWeight: '700', color: '#48484A' },
  dayNoteList: { flex: 1 },
  miniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: '#F2F2F7',
  },
  catDot: { width: 6, height: 6, borderRadius: 3, marginRight: 12 },
  miniContent: { fontSize: 15, color: '#1C1C1E', marginBottom: 2 },
  miniTime: { fontSize: 11, color: '#AEAEB2' },
  compLabel: { fontSize: 11, color: '#34C759', fontWeight: 'bold' },
  emptyView: { padding: 50, alignItems: 'center' },
  emptyText: { color: '#C7C7CC', fontSize: 14 },
});
