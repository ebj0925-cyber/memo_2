# 반짝이는 순간들 · MyQuickNote

> Expo React Native 기반 감성 메모 앱 | 기록 조각 · 생각 다이어리 · 마음 서랍

기록을 잘하는 사람보다, **기록을 자주 놓치는 사람**을 위한 가벼운 기록 경험을 목표로 설계했습니다.  
스쳐 지나가는 생각을 부담 없이 남기고, 날짜와 결별로 다시 꺼내볼 수 있는 개인 메모 앱입니다.

---

## 📌 목차
 
- 🚩 [개요](#-개요)
- 🔧 [기술 스택](#-기술-스택)
- 🗂️ [폴더 구조](#%EF%B8%8F-폴더-구조)
- ✨ [핵심 기능](#-핵심-기능)
- 💡 [코드와 제품 의사결정](#-코드와-제품-의사결정)
- 🔁 [프로젝트 회고](#-프로젝트-회고)
- ▶️ [로컬 실행](#%EF%B8%8F-로컬-실행-방법)
- 🔗 [링크](#-링크)

---

## 🚩 개요

| 항목 | 내용 |
|---|---|
| **프로젝트명** | 반짝이는 순간들 / MyQuickNote |
| **유형** | 1인 개인 프로젝트 |
| **개발 기간** | 2025.03 |
| **목표** | 떠오른 생각을 빠르게 기록하고, 날짜와 결별로 다시 탐색할 수 있는 감성 메모 앱 구현 |
| **역할** | 기획 · UX 설계 · 화면 구현 · 상태 관리 · 로컬 저장 구조 설계 |

### 문제 정의

기존 메모 앱은 사용자가 기록을 잘 정리한다는 전제를 갖고 있습니다.  
하지만 실제 사용자는 기록을 남기기 전에 부담을 느끼거나, 적어둔 메모를 다시 찾지 못해 이탈합니다.

이 프로젝트는 다음 질문에서 시작했습니다.

> **"완벽하게 정리하지 않아도, 생각을 가볍게 남길 수 있다면 기록은 더 오래 지속될까?"**

---

## 기술 스택

| 구분 | 기술 | 역할 |
|---|---|---|
| **Framework** | Expo / React Native | iOS, Android, Web 기반 앱 구현 |
| **Language** | TypeScript | 타입 안정성과 유지보수성 확보 |
| **Navigation** | Expo Router | 파일 기반 라우팅, 탭/상세 화면 구성 |
| **Storage** | AsyncStorage | 서버 없이 로컬 메모 데이터 저장 |
| **Calendar** | react-native-calendars | 날짜별 기록 점 표시와 선택 날짜 필터링 |
| **Image** | expo-image-picker | 사진 첨부 기능 |
| **File** | expo-document-picker | 문서 및 파일 첨부 기능 |
| **Icons** | MaterialCommunityIcons | 탭, 카테고리, 첨부 UI 아이콘 |

---

## 폴더 구조

```text
memo_app_fixed/
├── app/
│   ├── _layout.tsx              # 루트 Stack 설정
│   ├── [category].tsx           # 결별 기록 상세 화면
│   └── (tabs)/
│       ├── _layout.tsx          # 하단 탭 설정
│       ├── index.tsx            # 기록 조각 홈
│       ├── explore.tsx          # 생각 다이어리 달력
│       └── categories.tsx       # 마음 서랍
├── components/
│   └── EditModal.tsx            # 기록 상세/수정 모달
├── constants/
│   └── theme.ts                 # 공통 테마
├── hooks/
│   └── use-color-scheme.ts      # 컬러 스킴 훅
├── assets/images/               # 앱 아이콘 및 스플래시 이미지
├── app.json                     # Expo 앱 설정
├── package.json                 # 의존성 및 실행 스크립트
└── README.md
```

---

## ✨ 핵심 기능
 
### 📝 1.기록 조각
빠르게 메모를 남기는 홈 화면입니다.
 
- 랜덤 질문 프롬프트로 기록 시작 유도
- 결 선택 후 텍스트 입력
- 사진 및 파일 첨부
- 저장된 기록을 최신순 카드로 확인
- 기록 선택 시 상세 모달로 수정 가능

### 📅 2.생각 다이어리
날짜 기반으로 기록을 회고하는 화면입니다.
 
- 기록이 있는 날짜에 파란 점 표시
- 날짜 선택 시 해당 날짜의 기록만 필터링
- 빈 날짜도 부정적으로 보이지 않도록 안내 문구 처리
- 달력에서 기록 상세 화면으로 이동 가능

### 🗄️ 3.마음 서랍
기록을 7가지 결로 모아보는 아카이브 화면입니다.
 
| 결 | 설명 |
|---|---|
| ✨ 반짝 아이디어 | 번뜩이는 발상을 빠르게 |
| 📝 메모 | 가볍게 남기는 일상 기록 |
| 💡 영감 | 영감을 주는 문장, 장면 |
| ✅ 할일 | 상태 관리가 필요한 기록 |
| 💬 나에게 한마디 | 나를 위한 짧은 응원 |
| 😊 오늘 기분 | 하루의 감정 기록 |
| ⭐ 중요 | 놓치면 안 되는 것들 |
 
### ☑️ 4.할일 상태 관리
모든 기록에 상태를 강요하지 않고, `할일` 결에서만 상태 UI를 노출합니다.
 
- **준비중** · **진행중** · **완료** 3단계 상태
- 완료된 기록은 취소선과 낮은 투명도로 표시


---

## 주요 화면

<table>
  <tr>
    <td width="50%" align="center">
      <img src="./images/screen-home-write.png" alt="기록 조각 입력 화면" width="320" />
      <br />
      <strong>기록 조각</strong>
      <br />
      <sub>결 선택, 빠른 입력, 사진/파일 첨부를 한 화면에서 처리합니다.</sub>
    </td>
    <td width="50%" align="center">
      <img src="./images/screen-calendar.png" alt="생각 다이어리 달력 화면" width="320" />
      <br />
      <strong>생각 다이어리</strong>
      <br />
      <sub>날짜별 기록 여부와 선택 날짜의 기록을 확인합니다.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="./images/screen-heart-drawer.png" alt="마음 서랍 화면" width="320" />
      <br />
      <strong>마음 서랍</strong>
      <br />
      <sub>7가지 결로 기록을 모아보고 기록 개수를 확인합니다.</sub>
    </td>
    <td width="50%" align="center">
      <img src="./images/screen-category-detail.png" alt="반짝 아이디어 모음 화면" width="320" />
      <br />
      <strong>결별 기록 모음</strong>
      <br />
      <sub>선택한 결의 기록만 모아 상세하게 탐색합니다.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="./images/screen-note-detail.png" alt="기록 상세 화면" width="320" />
      <br />
      <strong>기록 상세</strong>
      <br />
      <sub>내용 수정, 결 변경, 첨부 관리를 한 곳에서 수행합니다.</sub>
    </td>
    <td width="50%" align="center">
      <img src="./images/screen-todo-done.png" alt="할일 완료 화면" width="320" />
      <br />
      <strong>할일 상태 관리</strong>
      <br />
      <sub>할일 결에서만 준비중, 진행중, 완료 상태를 노출합니다.</sub>
    </td>
  </tr>
</table>

---

## 💡코드와 제품 의사결정

### Decision 01. AsyncStorage 안전 저장

앱 시작 시 AsyncStorage에서 기존 기록을 불러오기 전에 저장 로직이 실행되면, 기존 데이터가 빈 배열로 덮어써질 수 있습니다.  
이를 막기 위해 로드 완료 여부를 `isLoaded`로 분리했습니다.

```tsx
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  if (isLoaded) {
    saveNotes(notes);
  }
}, [notes, isLoaded]);
```

> 데이터 유실은 곧 사용자 신뢰 유실이기 때문에, 저장 타이밍을 명확히 분리했습니다.

### Decision 02. 할일에서만 상태 UI 노출

`기분`, `영감`, `메모` 같은 기록에 `완료` 상태를 붙이면 오히려 기록 경험이 무거워집니다.  
그래서 상태 UI는 `할일` 결에서만 조건부로 보여줍니다.

```tsx
{category === '할일' && (
  <View style={styles.statusGroup}>
    {['준비중', '진행중', '완료'].map((item) => (
      <TouchableOpacity
        key={item}
        onPress={() => handleStatusChange(item)}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}
```

> 기능을 많이 넣는 것보다, 필요한 순간에만 보이게 하는 것이 제품 밀도를 높입니다.

### Decision 03. 달력 기록 마킹

기록이 있는 날짜만 달력에 점으로 표시해 사용자가 자신의 기록 흐름을 가볍게 확인할 수 있도록 했습니다.

```tsx
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
```

### Decision 04. 파일 첨부 기능

사진뿐 아니라 문서나 파일도 기록에 붙일 수 있도록 `expo-document-picker`를 추가했습니다.

```tsx
const result = await DocumentPicker.getDocumentAsync({
  copyToCacheDirectory: true,
  multiple: true,
});

if (!result.canceled) {
  setTempFiles([...tempFiles, ...result.assets]);
}
```

> 단순 메모에서 개인 아카이브로 확장하기 위한 기능입니다.

---

## 🔁 프로젝트 회고

### 잘한 점

* **기록 부담을 낮추는 UX 설계**  
  완성된 글보다 한 줄을 남기는 경험에 집중했습니다.

* **7개 결 구조**  
  선택지를 과하게 늘리지 않고, Miller's Law 관점에서 기억 가능한 범위 안에 카테고리를 제한했습니다.

* **조건부 UI 설계**  
  할일 상태 기능을 모든 기록에 강제하지 않고, 필요한 결에서만 노출했습니다.

* **비동기 저장 안정성 개선**  
  AsyncStorage 로드 전 저장되는 문제를 `isLoaded` 패턴으로 방지했습니다.

* **기록 상세 UX 개선**  
  상세 화면에서 결 변경, 파일 추가, 입력칸 시인성 개선을 반영했습니다.

### 개선 예정

| 항목 | 현재 상태 | 개선 방향 |
|---|---|---|
| 검색 기능 | 미구현 | 키워드 및 날짜 기반 검색 |
| 오늘 날짜 필터 | 전체 기록 표시 | 홈 화면 오늘 기록 중심으로 정리 |
| 녹음 기능 | UI만 존재 | expo-av 연동 |
| 삭제 UX | 미구현 | 롱프레스 삭제 및 확인 절차 |
| 백업 | 로컬 저장 | 클라우드 동기화 |

### 배운 점

> 좋은 메모 앱은 많은 기능을 제공하는 앱이 아니라, 사용자가 다시 열 수 있을 만큼 가벼운 앱입니다.

이번 프로젝트를 통해 기능 구현뿐 아니라 용어, 노출 시점, 빈 상태 문구 같은 작은 결정이 제품 경험을 크게 바꾼다는 점을 배웠습니다.

---

## 로컬 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/ebj0925-cyber/memo_2.git

# 2. 프로젝트 폴더 이동
cd memo_2

# 3. 패키지 설치
npm install

# 4. 개발 서버 실행
npx expo start
```

브라우저에서 확인하려면 실행 후 `w`를 입력하거나 아래 명령어를 사용할 수 있습니다.

```bash
npm run web
```

---
## Portfolio

- [PPT 다운로드](./memo-portfolio/MyQuickNote_PM_Portfolio.pptx)
- [PDF 보기](./memo-portfolio/MyQuickNote_PM_Portfolio.pdf)

### Preview

<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0001.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0002.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0003.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0004.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0005.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0006.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0007.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0008.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0009.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0010.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0011.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0012.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0013.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0014.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0015.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0016.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0017.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0018.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0019.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0020.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0021.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0022.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0023.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0024.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0025.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0026.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0027.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0028.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0029.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0030.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0031.png" width="800" />
<img src="./memo-portfolio/images/MyQuickNote_PM_Portfolio_0032.png" width="800" />



## 링크

* **GitHub:** https://github.com/ebj0925-cyber/memo_2
* **PPT 포트폴리오:** 별도 제출 자료
* **Email:** kae8231@gmail.com

---

<p align="right">
  <sub>MyQuickNote · 반짝이는 순간들 · 조은정</sub>
</p>
