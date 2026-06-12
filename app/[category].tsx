import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);

  useEffect(() => {
    const loadFilteredNotes = async () => {
      try {
        const data = await AsyncStorage.getItem('@my_notes');
        if (data) {
          const allNotes = JSON.parse(data);
          setFilteredNotes(
            allNotes.filter((note: any) => note.category === category),
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadFilteredNotes();
  }, [category]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color="#1C1C1E"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category} 모음</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.list}>
        {filteredNotes.map((note) => (
          <View key={note.id} style={styles.card}>
            <Text style={styles.time}>
              {note.date} {note.time}
            </Text>
            <Text style={styles.content}>{note.content || '(미디어 기록)'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  list: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
  },
  time: { fontSize: 11, color: '#AEAEB2', marginBottom: 5 },
  content: { fontSize: 15, color: '#2C2C2E' },
});
