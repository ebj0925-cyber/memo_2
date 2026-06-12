import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type EditModalProps = {
  visible: boolean;
  note: any;
  onClose: () => void;
  onSave: (note: any) => void;
};

export default function EditModal({
  visible,
  note,
  onClose,
  onSave,
}: EditModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState('준비중');
  const [completedDate, setCompletedDate] = useState<string | null>(null);
  const [lastEdited, setLastEdited] = useState<string>('');

  useEffect(() => {
    if (note && visible) {
      setContent(note.content || '');
      setCategory(note.category || '아이디어');
      setImages(note.imgs || []);
      setStatus(note.status || '준비중');
      setCompletedDate(note.completedDate || null);
      setLastEdited(note.lastEdited || note.time);
    }
  }, [note, visible]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleSave = () => {
    const now = new Date();
    const editTime = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    onSave({
      ...note,
      content,
      category,
      imgs: images,
      status,
      completedDate,
      lastEdited: editTime,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);

    if (newStatus === '완료') {
      const now = new Date();
      setCompletedDate(
        `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`,
      );
    } else {
      setCompletedDate(null);
    }
  };

  if (!note) return null;

  const isCompleted = status === '완료';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>기록 상세</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoSection}>
            <Text style={styles.dateText}>{note.date}</Text>
            <View style={styles.timeRow}>
              <MaterialCommunityIcons
                name="clock-check-outline"
                size={14}
                color="#FF9500"
              />
              <Text style={styles.lastEditedText}>최종 수정: {lastEdited}</Text>
            </View>
            {isCompleted && (
              <View style={styles.doneBadge}>
                <MaterialCommunityIcons
                  name="checkbox-marked-circle"
                  size={18}
                  color="#2E7D32"
                />
                <Text style={styles.doneBadgeText}>
                  {completedDate} 완료 조각
                </Text>
              </View>
            )}
          </View>

          {category === '할일' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>진행 단계</Text>
              <View style={styles.statusGroup}>
                {['준비중', '진행중', '완료'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => handleStatusChange(item)}
                    style={[
                      styles.statusTab,
                      status === item && {
                        backgroundColor: item === '완료' ? '#34C759' : '#007AFF',
                        borderColor: 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTabText,
                        status === item && { color: '#fff' },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.toolBar}>
            <TouchableOpacity style={styles.toolItem} onPress={pickImage}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={26}
                color="#007AFF"
              />
              <Text style={styles.toolLabel}>사진 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolItem}
              onPress={() => Alert.alert('준비중')}
            >
              <MaterialCommunityIcons
                name="microphone-outline"
                size={26}
                color="#48484A"
              />
              <Text style={styles.toolLabel}>녹음</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolItem}
              onPress={() => Alert.alert('준비중')}
            >
              <MaterialCommunityIcons
                name="paperclip"
                size={26}
                color="#48484A"
              />
              <Text style={styles.toolLabel}>파일</Text>
            </TouchableOpacity>
          </View>

          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              {images.map((img, index) => (
                <View key={`${img}-${index}`} style={styles.imageContainer}>
                  <Image source={{ uri: img }} style={styles.detailImg} />
                  <TouchableOpacity
                    style={styles.imageDelete}
                    onPress={() =>
                      setImages(images.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color="rgba(0,0,0,0.5)"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <TextInput
            style={[
              styles.input,
              isCompleted && {
                color: '#AEAEB2',
                textDecorationLine: 'line-through',
              },
            ]}
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="내용을 채워주세요..."
            placeholderTextColor="#C7C7CC"
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  cancelText: { color: '#8E8E93', fontSize: 16 },
  saveBtn: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  scrollBody: { flex: 1, paddingHorizontal: 25 },
  infoSection: { marginTop: 30, marginBottom: 25 },
  dateText: { fontSize: 28, fontWeight: '800', color: '#1C1C1E' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 5 },
  lastEditedText: { fontSize: 13, color: '#FF9500', fontWeight: '600' },
  doneBadge: {
    marginTop: 15,
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  doneBadgeText: { fontSize: 13, color: '#2E7D32', fontWeight: 'bold' },
  section: { marginBottom: 25 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AEAEB2',
    marginBottom: 12,
  },
  statusGroup: { flexDirection: 'row', gap: 10 },
  statusTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  statusTabText: { fontSize: 14, fontWeight: '700', color: '#8E8E93' },
  toolBar: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: '#E5E5E5',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  toolItem: { alignItems: 'center' },
  toolLabel: {
    fontSize: 12,
    color: '#48484A',
    marginTop: 6,
    fontWeight: '600',
  },
  imageScroll: { marginBottom: 25 },
  imageContainer: { position: 'relative', marginRight: 15 },
  detailImg: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 24,
    backgroundColor: '#EEE',
  },
  imageDelete: { position: 'absolute', top: 10, right: 10 },
  input: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2C2C2E',
    textAlignVertical: 'top',
    minHeight: 350,
  },
});
