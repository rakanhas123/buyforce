# BuyForce Mobile App

אפליקציית מובייל של BuyForce בנויה עם React Native ו-Expo.

## דרישות מקדימות

- Node.js (גרסה 18 ומעלה)
- pnpm (מומלץ) או npm
- Expo Go באפליקציה בטלפון (לפיתוח)

## התקנה והרצה

### 1. התקן את התלויות

```bash
cd apps/mobile
pnpm install
```

### 2. הרץ את האפליקציה

```bash
pnpm exec expo start
```

או:

```bash
npx expo start
```

### 3. פתח את האפליקציה

- **iOS**: סרוק את קוד ה-QR עם אפליקציית Camera
- **Android**: סרוק את קוד ה-QR עם אפליקציית Expo Go
- **Web**: לחץ על `w` בטרמינל או גש ל-`http://localhost:8081`
- **iOS Simulator**: לחץ על `i` בטרמינל
- **Android Emulator**: לחץ על `a` בטרמינל

## עדכונים חשובים שבוצעו

### שדרוגי חבילות נדרשים

האפליקציה דורשת את הגרסאות הבאות:

```json
{
  "dependencies": {
    "expo": "^54.0.0",
    "expo-router": "^6.0.21",
    "expo-status-bar": "~3.0.9",
    "expo-constants": "18.0.12",
    "expo-linking": "8.0.11",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.76.6",
    "react-native-web": "^0.21.0",
    "react-native-safe-area-context": "5.6.2",
    "react-native-screens": "4.19.0",
    "@expo/vector-icons": "15.0.3"
  },
  "devDependencies": {
    "@types/react": "18.3.12"
  }
}
```

### תיקונים שבוצעו

1. **שדרוג React ל-19.1.0**
   - Expo Router 6.0.21 דורש React 19 עבור `react.use()` API
   - שדרוג `react` ו-`react-dom` לגרסה 19.1.0

2. **התקנת @types/react@18.3.12**
   - שמירה על `@types/react` בגרסה 18.3.12 לתאימות עם React Native types
   - זה מאפשר שימוש ב-React 19 בזמן ריצה תוך שמירה על types תואמים

3. **הסרת Global Expo CLI**
   - הסרת `expo-cli` הישן: `npm uninstall -g expo-cli`
   - שימוש ב-local Expo CLI דרך `npx expo` או `pnpm exec expo`

4. **התקנת תלויות חסרות**
   - `expo-constants`
   - `expo-linking`
   - `react-native-safe-area-context`
   - `react-native-screens`
   - `@expo/vector-icons`

5. **תיקון מבנה הניווט**
   - יצירת קובץ `app/(tabs)/_layout.tsx` עבור Tabs navigation
   - המרת קבצים מ-Next.js ל-React Native (החלפת `next/image` ו-`next/navigation`)

6. **תיקון app.json**
   - הסרת הפניות לקבצי assets שלא קיימים
   - הגדרה נקייה של splash screen ואפליקציה

## מבנה הפרויקט

```
apps/mobile/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Home screen
│   ├── (auth)/
│   │   └── register.tsx     # Registration screen
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tabs layout
│   │   ├── home.tsx         # Home tab
│   │   ├── categories.tsx   # Categories tab
│   │   ├── groups.tsx       # Groups tab
│   │   ├── wishlist.tsx     # Wishlist tab
│   │   ├── notifications.tsx # Notifications tab
│   │   └── profile.tsx      # Profile tab
│   └── product/
│       └── [id].tsx         # Product details
├── assets/                  # Images and assets
├── app.json                 # Expo configuration
├── package.json
└── README.md               # This file
```

## בעיות נפוצות ופתרונות

### שגיאת "react.use is not a function"
**פתרון**: ודא ש-React בגרסה 19.1.0:
```bash
pnpm add react@19.1.0 react-dom@19.1.0
```

### שגיאות TypeScript עם React Native components
**פתרון**: ודא ש-@types/react בגרסה 18.3.12:
```bash
pnpm add -D @types/react@18.3.12
```

### "expo-cli is deprecated"
**פתרון**: הסר את הגרסה הגלובלית:
```bash
npm uninstall -g expo-cli
```
ואז השתמש ב-local CLI:
```bash
npx expo start
```

### Cache issues
**פתרון**: נקה את ה-cache:
```bash
pnpm exec expo start --clear
```

## סקריפטים זמינים

```bash
# הרצת שרת הפיתוח
pnpm start

# הרצת שרת עם ניקוי cache
pnpm exec expo start --clear

# הרצה על Android
pnpm android

# הרצה על iOS
pnpm ios

# הרצה על Web
pnpm web
```

## משתני סביבה

צור קובץ `.env` (אופציונלי):

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## פיצ'רים

- ✅ Expo Router לניווט
- ✅ React Native components
- ✅ Tabs navigation
- ✅ Authentication screens
- ✅ Product browsing
- ✅ Wishlist management
- ✅ Group buying features
- ✅ Notifications

## טכנולוגיות

- **React Native** - Framework למובייל
- **Expo** - פלטפורמה לפיתוח React Native
- **Expo Router** - ניווט מבוסס קבצים
- **TypeScript** - Type safety
- **React 19** - Latest React features

## תמיכה

אם נתקלת בבעיות, בדוק:
1. שכל התלויות מותקנות: `pnpm install`
2. שהגרסאות נכונות (ראה למעלה)
3. נקה cache: `pnpm exec expo start --clear`
4. מחק `node_modules` והתקן מחדש: `rm -rf node_modules && pnpm install`

---

**הערה**: מומלץ להשתמש ב-pnpm במקום npm לניהול תלויות בפרויקט זה.
