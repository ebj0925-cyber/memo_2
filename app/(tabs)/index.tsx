import EditModal from '@/components/EditModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  { label: '반짝 아이디어', value: '아이디어', color: '#FF9500', bg: '#FFF9F0' },
  { label: '메모', value: '메모', color: '#8E8E93', bg: '#F2F2F7' },
  { label: '영감', value: '영감', color: '#5856D6', bg: '#F5F0FF' },
  { label: '할일', value: '할일', color: '#34C759', bg: '#F2FFF5' },
  { label: '나에게 한마디', value: '칭찬하기', color: '#FFB7B2', bg: '#FFF0F0' },
  { label: '오늘 기분', value: '오늘 기분', color: '#B2CEFE', bg: '#F0F5FF' },
  { label: '중요', value: '중요', color: '#FF3B30', bg: '#FFF2F2' },
];

const questions = [
  '지금 막 스친 그 생각, 적어볼까요?',
  '완벽하지 않아도 괜찮아요. 한 줄만 남겨요.',
  '오늘 당신의 하루는 어떤 색이었나요?',
  '정리하지 말고 일단 잡아둬 보세요.',
];

export default function HomeScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [currentCategory, setCurrentCategory] = useState('아이디어');
  const [tempImages, setTempImages] = useState<string[]>([]);
  const [tempFiles, setTempFiles] = useState<any[]>([]);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [todayQuestion, setTodayQuestion] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadNotes();
    setTodayQuestion(questions[Math.floor(Math.random() * questions.length)]);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveNotes(notes);
    }
  }, [notes, isLoaded]);

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem('@my_notes');
      if (data) {
        setNotes(JSON.parse(data));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveNotes = async (data: any[]) => {
    try {
      await AsyncStorage.setItem('@my_notes', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setTempImages([...tempImages, ...result.assets.map((asset) => asset.uri)]);
      setIsAttachOpen(false);
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (!result.canceled) {
      setTempFiles([...tempFiles, ...result.assets]);
      setIsAttachOpen(false);
    }
  };

  const addNote = () => {
    if (
      text.trim().length === 0 &&
      tempImages.length === 0 &&
      tempFiles.length === 0
    ) {
      return;
    }

    const now = new Date();
    const newNote = {
      id: Date.now(),
      content: text,
      category: currentCategory,
      date: `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`,
      time: now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      imgs: tempImages,
      files: tempFiles,
      status: '준비중',
      completedDate: null,
      lastEdited: null,
    };

    setNotes([newNote, ...notes]);
    setText('');
    setTempImages([]);
    setTempFiles([]);
    setIsAttachOpen(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>나의 생각 조각</Text>
          <Text style={styles.headerSub}>
            오늘 스친 아이디어를 놓치지 마세요
          </Text>
        </View>

        <View style={styles.questionBox}>
          <Text style={styles.questionLabel}>아이디어 스위치</Text>
          <Text style={styles.questionText}>{todayQuestion}</Text>
        </View>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {notes.map((note) => {
            const categoryStyle =
              categories.find((item) => item.value === note.category) ||
              categories[1];
            const isDone = note.status === '완료';

            return (
              <TouchableOpacity
                key={note.id}
                onPress={() => {
                  setSelectedNote(note);
                  setModalVisible(true);
                }}
              >
                <View
                  style={[
                    styles.card,
                    { borderLeftColor: categoryStyle.color },
                    isDone && { opacity: 0.6 },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.badgeText, { color: categoryStyle.color }]}>
                      {isDone ? '완료 ' : ''}
                      {categoryStyle.label}
                    </Text>
                    <Text style={styles.timeText}>{note.time}</Text>
                  </View>
                  <Text
                    style={[
                      styles.contentText,
                      isDone && { textDecorationLine: 'line-through' },
                    ]}
                    numberOfLines={2}
                  >
                    {note.content || '(미디어 기록)'}
                  </Text>
                  {note.files?.length > 0 && (
                    <View style={styles.attachmentSummary}>
                      <MaterialCommunityIcons
                        name="paperclip"
                        size={14}
                        color="#8E8E93"
                      />
                      <Text style={styles.attachmentSummaryText}>
                        파일 {note.files.length}개
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.inputWrapper}>
          {isAttachOpen && (
            <View style={styles.expandedAttachBar}>
              <TouchableOpacity style={styles.attachItem} onPress={pickImage}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={24}
                  color="#48484A"
                />
                <Text style={styles.attachLabel}>사진</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.attachItem}
                onPress={() => Alert.alert('준비중')}
              >
                <MaterialCommunityIcons
                  name="microphone-outline"
                  size={24}
                  color="#48484A"
                />
                <Text style={styles.attachLabel}>녹음</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.attachItem}
                onPress={pickFile}
              >
                <MaterialCommunityIcons
                  name="paperclip"
                  size={24}
                  color="#48484A"
                />
                <Text style={styles.attachLabel}>파일</Text>
              </TouchableOpacity>
            </View>
          )}

          {tempFiles.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filePreviewList}
            >
              {tempFiles.map((file, index) => (
                <TouchableOpacity
                  key={`${file.uri}-${index}`}
                  style={styles.filePreviewChip}
                  onPress={() =>
                    setTempFiles(
                      tempFiles.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={16}
                    color="#007AFF"
                  />
                  <Text style={styles.filePreviewText} numberOfLines={1}>
                    {file.name || '첨부 파일'}
                  </Text>
                  <MaterialCommunityIcons
                    name="close"
                    size={14}
                    color="#8E8E93"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.catScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                onPress={() => setCurrentCategory(category.value)}
                style={[
                  styles.catChip,
                  currentCategory === category.value && {
                    backgroundColor: category.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catChipText,
                    currentCategory === category.value && { color: '#fff' },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.plusBtn}
              onPress={() => setIsAttachOpen(!isAttachOpen)}
            >
              <MaterialCommunityIcons
                name={isAttachOpen ? 'close' : 'plus'}
                size={28}
                color={isAttachOpen ? '#FF3B30' : '#007AFF'}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder={`${currentCategory} 적어보기...`}
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={addNote}>
              <Text style={styles.sendBtnText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <EditModal
        visible={modalVisible}
        note={selectedNote}
        onClose={() => setModalVisible(false)}
        onSave={(updated: any) => {
          setNotes(notes.map((note) => (note.id === updated.id ? updated : note)));
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { paddingTop: 70, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1C1C1E' },
  headerSub: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  questionBox: {
    padding: 20,
    backgroundColor: '#FFFDF0',
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 4,
  },
  questionText: { fontSize: 15, color: '#48484A' },
  list: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    borderLeftWidth: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  timeText: { fontSize: 11, color: '#AEAEB2' },
  contentText: { fontSize: 16, color: '#2C2C2E', lineHeight: 22 },
  attachmentSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  attachmentSummaryText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#EEE',
    paddingBottom: 40,
  },
  expandedAttachBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#F9F9F9',
  },
  attachItem: { alignItems: 'center' },
  attachLabel: { fontSize: 11, color: '#8E8E93', marginTop: 4 },
  filePreviewList: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  filePreviewChip: {
    maxWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#F2F8FF',
    marginRight: 8,
  },
  filePreviewText: { flexShrink: 1, fontSize: 12, color: '#48484A' },
  catScroll: { paddingVertical: 12 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginLeft: 10,
  },
  catChipText: { fontSize: 13, color: '#8E8E93' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },
  plusBtn: { padding: 5 },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },
});
