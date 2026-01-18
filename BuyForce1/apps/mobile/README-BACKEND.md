# 📱 BuyForce Mobile - חיבור לבקאנד

## ✅ המובייל מחובר לבקאנד!

### מה עשינו:

**1. יצרנו API Client** - [app/lib/api.ts](app/lib/api.ts)
   - תמיכה ב-Android Emulator (10.0.2.2:3000)
   - תמיכה ב-iOS Simulator (localhost:3000)
   - Axios עם interceptors
   - Types ל-TypeScript
   - APIs: Auth, Products, Groups, Categories

**2. יצרנו Auth Context** - [app/lib/AuthContext.tsx](app/lib/AuthContext.tsx)
   - ניהול state של משתמש
   - Login, Register, Logout
   - שמירה ב-memory (אפשר להוסיף AsyncStorage)

**3. עדכנו מסכי Auth**
   - [app/(auth)/login.tsx](app/(auth)/login.tsx) - התחברות אמיתית
   - [app/(auth)/register.tsx](app/(auth)/register.tsx) - הרשמה אמיתית

**4. עדכנו את ה-Layout** - [app/_layout.tsx](app/_layout.tsx)
   - AuthProvider wrapper
   - WishlistProvider wrapper
   - Routes לכל המסכים

**5. יצרנו מסך קבוצות חדש** - [app/(tabs)/groups-new.tsx](app/(tabs)/groups-new.tsx)
   - טעינה מהשרת
   - Pull to refresh
   - סינון לפי סטטוס

## 🚀 איך להריץ

### Backend (יש להריץ קודם)
```bash
cd BuyForce-Backend
pnpm dev
# ✅ רץ על http://localhost:3000
```

### Mobile App

#### התקנת תלויות
```bash
cd BuyForce1/apps/mobile
pnpm install
```

#### Android Emulator
```bash
pnpm android
```
ה-API יתחבר אוטומטית ל-`http://10.0.2.2:3000`

#### iOS Simulator
```bash
pnpm ios
```
ה-API יתחבר אוטומטית ל-`http://localhost:3000`

#### Web (לפיתוח)
```bash
pnpm web
```

## 📡 API Configuration

הכתובת מוגדרת אוטומטית לפי הפלטפורמה:

```typescript
const getBaseURL = () => {
  const { platform } = Constants;
  if (platform?.android) {
    return 'http://10.0.2.2:3000'; // Android Emulator
  }
  return 'http://localhost:3000'; // iOS Simulator
};
```

**למכשיר פיזי:**
שנה ל-IP של המחשב שלך, למשל:
```typescript
return 'http://192.168.1.100:3000';
```

## 🔐 Authentication Flow

1. משתמש פותח את האפליקציה
2. מסך Login/Register
3. הזנת credentials
4. שליחה ל-`/v1/auth/login` או `/v1/auth/register`
5. קבלת JWT token
6. שמירת token ב-AuthContext
7. הוספת token לכל request דרך interceptor

## 📂 מבנה הקוד

```
apps/mobile/
├── app/
│   ├── lib/
│   │   ├── api.ts             # API Client + Types
│   │   ├── AuthContext.tsx    # Authentication Context
│   │   ├── WishlistContext.tsx
│   │   ├── data.tsx           # Local data (backup)
│   │   ├── types.tsx
│   │   └── products.tsx
│   ├── (auth)/
│   │   ├── login.tsx          # ✅ מחובר לבקאנד
│   │   └── register.tsx       # ✅ מחובר לבקאנד
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── groups.tsx
│   │   ├── groups-new.tsx     # ✅ מחובר לבקאנד
│   │   ├── wishlist.tsx
│   │   ├── profile.tsx
│   │   └── notifications.tsx
│   ├── product/[id].tsx
│   ├── group/[id].tsx
│   └── _layout.tsx            # ✅ עם AuthProvider
└── package.json               # ✅ הוספנו axios
```

## 🎯 API Endpoints זמינים

### Auth
- `POST /v1/auth/login` - התחברות
- `POST /v1/auth/register` - הרשמה
- `POST /v1/auth/logout` - התנתקות
- `GET /v1/auth/me` - פרטי משתמש

### Products
- `GET /api/products` - כל המוצרים
- `GET /api/products/:id` - מוצר ספציפי

### Groups
- `GET /v1/groups` - כל הקבוצות
- `GET /v1/groups/:id` - קבוצה ספציפית
- `POST /v1/groups/:id/join` - הצטרפות לקבוצה

### Categories
- `GET /v1/categories` - כל הקטגוריות

### Health
- `GET /v1/health` - בדיקת תקינות

## 🔧 שיפורים עתידיים

### 1. AsyncStorage
הוסף שמירה persistent:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save token
await AsyncStorage.setItem('authToken', token);

// Load token
const token = await AsyncStorage.getItem('authToken');
```

### 2. Error Handling
הוסף Toast notifications:
```bash
pnpm add react-native-toast-message
```

### 3. Loading States
הוסף Skeleton loaders:
```bash
pnpm add react-native-skeleton-placeholder
```

### 4. Images
הוסף Image caching:
```bash
pnpm add expo-image
```

## 📱 בדיקת החיבור

1. הפעל את הבקאנד
2. הפעל את המובייל
3. לחץ על "Login"
4. הזן:
   - Email: `david.cohen@example.com`
   - Password: `Password123!`
5. אמור להתחבר בהצלחה! ✅

## 🐛 Troubleshooting

### Android: Cannot connect to server
- וודא שהבקאנד רץ
- וודא שה-IP הוא `10.0.2.2:3000`
- נסה: `adb reverse tcp:3000 tcp:3000`

### iOS: Network request failed
- וודא שהבקאנד רץ
- וודא ש-localhost מוגדר נכון
- בדוק App Transport Security

### Real Device: Cannot connect
- שנה את ה-URL ל-IP של המחשב
- וודא שהמכשיר והמחשב באותה רשת

## 🎉 מוכן לשימוש!

האפליקציה המובייל מחוברת לבקאנד ומוכנה לפיתוח!
