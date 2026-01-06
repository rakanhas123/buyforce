# Mobile App Integration with Backend

## סיכום העדכונים

כל המסכים באפליקציית המובייל כעת מחוברים לבקאנד ומציגים נתונים אמיתיים.

## מסכים שעודכנו

### ✅ 1. Home Screen (`(tabs)/home.tsx`)
- **שינויים:**
  - הוספת `ActivityIndicator` למצב טעינה
  - שימוש ב-`productsApi.getAll()` לטעינת מוצרים
  - עדכון `renderItem` להציג תמונות, מפרטים ותיאור מהשרת
  - הוספת `RefreshControl` למשיכה-לרענון
  - הסרת תצוגת התקדמות קבוצה (progress bars)
  - הצגת מלאי מוצרים (`stock_quantity`)

- **שדות שמוצגים:**
  - תמונה ראשית (`images[0].image_url`)
  - שם מוצר
  - מחיר
  - תיאור
  - מלאי

### ✅ 2. Categories Screen (`(tabs)/categories.tsx`)
- **שינויים:**
  - שימוש ב-`categoriesApi.getAll()` לטעינת קטגוריות
  - הוספת מיפוי אייקונים לשמות קטגוריות בעברית
  - הוספת מצב טעינה עם `ActivityIndicator`
  - הוספת `RefreshControl`
  - הוספת מסך ריק אם אין קטגוריות
  - שינוי כפתור "Select" ל-"בחר" בעברית

- **CATEGORY_ICONS mapping:**
  ```typescript
  const CATEGORY_ICONS = {
    "אלקטרוניקה": "📱",
    "בגדים": "👔",
    "ספורט": "⚽",
    "בית וגן": "🏡",
    "יופי וטיפוח": "💄",
  };
  ```

### ✅ 3. Profile Screen (`(tabs)/profile.tsx`)
- **שינויים:**
  - שימוש ב-`useAuth()` להצגת משתמש מחובר
  - הצגת נתוני משתמש אמיתיים מהשרת
  - הוספת מצב טעינה
  - הוספת מסך "לא מחובר" למשתמשים שלא התחברו
  - פונקציית התנתקות אמיתית עם `logout()`
  - הצגת תאריך הצטרפות

- **שדות שמוצגים:**
  - מזהה משתמש (`user.id`)
  - שם מלא (`user.full_name`)
  - אימייל (`user.email`)
  - טלפון (`user.phone`)
  - תאריך הצטרפות (`user.created_at`)

### ✅ 4. Product Details Screen (`product/[id].tsx`)
- **שינויים:**
  - שימוש ב-`productsApi.getById(id)` לטעינת פרטי מוצר
  - הוספת מצב טעינה ושגיאות
  - הצגת תמונה ראשית
  - הצגת קטגוריה ומלאי
  - הצגת מפרטים טכניים
  - גלריית תמונות נוספות
  - כפתור "הצטרף לקבוצה" / "אזל מהמלאי"

- **שדות שמוצגים:**
  - תמונה ראשית
  - שם מוצר
  - מחיר
  - תיאור
  - קטגוריה
  - מלאי
  - מפרטים טכניים (`specs`)
  - תמונות נוספות

### ✅ 5. Group Details Screen (`group/[id].tsx`)
- **שינויים:**
  - שימוש ב-`groupsApi.getById(id)` לטעינת פרטי קבוצה
  - הוספת מצב טעינה ושגיאות
  - הצגת סטטוס קבוצה עם צבעים (פעילה/ממתינה/הושלמה/בוטלה)
  - הצגת התקדמות חברים
  - הצגת תאריכי התחלה וסיום
  - הצגת מחיר לחבר
  - כפתור הצטרפות (רק לקבוצות פעילות)

- **שדות שמוצגים:**
  - שם קבוצה
  - סטטוס
  - תיאור
  - התקדמות (`current_members / goal_members`)
  - תאריך התחלה
  - תאריך סיום
  - מחיר

## API Client (`lib/api.ts`)

### Platform Detection
```typescript
const getBaseURL = () => {
  const { platform } = Constants;
  if (platform?.android) {
    return 'http://10.0.2.2:3000'; // Android Emulator
  }
  return 'http://localhost:3000'; // iOS Simulator
};
```

### Types Updated
```typescript
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  stock_quantity: number;
  created_at: string;
  category?: {
    id: number;
    name: string;
  };
  images?: Array<{
    id: number;
    image_url: string;
    is_main: boolean;
  }>;
  specs?: Array<{
    id: number;
    spec_key: string;
    spec_value: string;
  }>;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  current_members: number;
  goal_members: number;
  price?: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}
```

## Authentication Context (`lib/AuthContext.tsx`)

משתמש ב:
- `authApi.login()` להתחברות
- `authApi.register()` להרשמה
- State management למשתמש מחובר וטוקן

## הרצת האפליקציה

### 1. הרצת Backend
```bash
cd BuyForce-Backend
pnpm dev
```

### 2. הרצת Mobile
```bash
cd BuyForce1/apps/mobile
pnpm start
```

### 3. בחירת פלטפורמה
- לחץ `a` ל-Android Emulator
- לחץ `i` ל-iOS Simulator

## בדיקות שבוצעו

✅ כל המסכים טוענים ללא שגיאות TypeScript
✅ API calls מוגדרים נכון עם הטיפוסים הנכונים
✅ מצבי טעינה ושגיאות מטופלים
✅ RefreshControl פועל בכל המסכים הרלוונטיים
✅ Authentication context מחובר למסך Profile
✅ Platform detection עובד עבור Android/iOS

## נתונים בבסיס הנתונים

- 21 משתמשים
- 67 מוצרים
- 15 קבוצות
- 5 קטגוריות
- 20 תמונות מוצרים
- 35 מפרטים טכניים

## השלבים הבאים (אופציונלי)

1. **AsyncStorage Integration**
   - שמירת טוקן ב-AsyncStorage
   - טעינה אוטומטית בהפעלה

2. **Error Handling**
   - הודעות שגיאה ידידותיות יותר
   - Retry mechanism

3. **Caching**
   - שמירת נתונים ב-cache
   - Offline support

4. **Images Optimization**
   - Lazy loading
   - Image caching

5. **Pagination**
   - Infinite scroll למוצרים
   - Load more לקטגוריות

## סיכום

כל המסכים באפליקציית המובייל כעת מחוברים לבקאנד ומציגים נתונים אמיתיים. האפליקציה מוכנה לבדיקה ושימוש!

🎉 **האינטגרציה הושלמה בהצלחה!**
