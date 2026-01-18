# 🚀 BuyForce - התחברות Frontend ↔ Backend

## סטטוס החיבור ✅

הפרונטאנד והבקאנד מחוברים ומוכנים לעבודה!

## 🔧 הגדרות

### Backend (Port 3000)
- **Express Server**: `http://localhost:3000`
- **Database**: PostgreSQL על פורט 5433
- **CORS**: מאפשר גישה מ-localhost:5173, 5174, 3000

### Frontend
- **Web App**: `http://localhost:5173`
- **Admin Web**: `http://localhost:5174`
- **API URL**: `http://localhost:3000`

## 📦 התקנה והפעלה

### 1️⃣ הפעלת Docker (Database)
```bash
cd BuyForce-Backend/docker
docker-compose up -d
```

### 2️⃣ הפעלת Backend
```bash
cd BuyForce-Backend
pnpm install
pnpm dev
```

הבקאנד יעלה על: `http://localhost:3000`

### 3️⃣ הפעלת Frontend - Web App
```bash
cd BuyForce1/apps/web
pnpm install
pnpm dev
```

האפליקציה תעלה על: `http://localhost:5173`

### 4️⃣ הפעלת Frontend - Admin Panel
```bash
cd BuyForce1/apps/admin-web
pnpm install
pnpm dev
```

הפאנל ניהול יעלה על: `http://localhost:5174`

## 🧪 בדיקת החיבור

### בדיקת Backend Health
```bash
curl http://localhost:3000/v1/health
```

תקבל תשובה:
```json
{
  "status": "OK",
  "service": "BuyForce Backend",
  "version": "v1",
  "db": "OK"
}
```

### בדיקת Products API
```bash
curl http://localhost:3000/api/products
```

## 🔐 API Endpoints זמינים

### Authentication
- `POST /v1/auth/login` - התחברות
- `POST /v1/auth/register` - הרשמה
- `POST /v1/auth/logout` - התנתקות
- `GET /v1/auth/me` - פרטי משתמש מחובר

### Products
- `GET /api/products` - כל המוצרים
- `GET /api/products/:id` - מוצר לפי ID

### Groups
- `GET /v1/groups` - כל הקבוצות
- `GET /v1/groups/:id` - קבוצה לפי ID
- `POST /v1/groups/:id/join` - הצטרפות לקבוצה

### Wishlist
- `GET /v1/wishlist` - רשימת משאלות
- `POST /v1/wishlist` - הוספה לרשימת משאלות
- `DELETE /v1/wishlist/:id` - מחיקה מרשימת משאלות

### Admin
- `GET /v1/admin/users` - כל המשתמשים
- `GET /v1/admin/groups` - כל הקבוצות
- `GET /v1/admin/wishlist` - כל רשימות המשאלות

## 📂 מבנה הקוד

### Backend
```
BuyForce-Backend/
├── src/
│   ├── main.ts              # Entry point (NestJS)
│   ├── server.ts            # Express server
│   ├── app.module.ts        # Main module
│   ├── db/
│   │   └── db.ts           # PostgreSQL connection
│   ├── auth/               # Authentication module
│   ├── users/              # Users module
│   ├── groups/             # Groups module
│   ├── wishlist/           # Wishlist module
│   └── routes/             # Express routes
└── docker/
    ├── docker-compose.yml
    ├── seed_data_corrected.sql
    └── seed_data_additional.sql
```

### Frontend
```
BuyForce1/
├── apps/
│   ├── web/                # Main user app
│   │   ├── app.tsx
│   │   └── .env           # VITE_API_URL=http://localhost:3000
│   └── admin-web/          # Admin panel
│       ├── src/
│       │   ├── api/
│       │   │   ├── http.ts
│       │   │   └── authApi.ts
│       │   └── lib/
│       │       └── AuthContext.tsx
│       └── .env           # VITE_API_URL=http://localhost:3000
└── packages/
    └── features/
        └── api.ts          # Shared API client
```

## 🔒 Authentication Flow

1. משתמש מזין email & password בפרונטאנד
2. הפרונטאנד שולח POST ל-`/v1/auth/login`
3. הבקאנד מאמת את הפרטים ומחזיר JWT token
4. הפרונטאנד שומר את ה-token ב-localStorage
5. בקשות עתידיות נשלחות עם header: `Authorization: Bearer <token>`

## 🌐 CORS Configuration

הבקאנד מאפשר גישה מ:
- `http://localhost:5173` - Web App
- `http://localhost:5174` - Admin Panel  
- `http://localhost:3000` - Same origin

## 📊 Database

הבסיס נתונים מכיל:
- ✅ 21 משתמשים
- ✅ 67 מוצרים
- ✅ 15 קבוצות קנייה
- ✅ 5 קטגוריות
- ✅ 20 תמונות
- ✅ 35 מפרטים טכניים
- ✅ 10 הזמנות
- ✅ 33 קשרי משתמש-קבוצה
- ✅ 2 מנהלים

## 🐛 Troubleshooting

### בעיית CORS?
וודא שהבקאנד רץ על פורט 3000 והפרונטאנד על 5173/5174

### בעיית חיבור ל-Database?
```bash
docker ps  # בדוק שה-container buyforce-postgres רץ
docker logs buyforce-postgres  # בדוק לוגים
```

### Frontend לא רואה את הבקאנד?
בדוק את קובץ `.env` ב-`apps/web` ו-`apps/admin-web`:
```
VITE_API_URL=http://localhost:3000
```

## 🎉 מוכן לעבודה!

כעת הפרונטאנד והבקאנד מחוברים ומוכנים. אפשר להתחיל לפתח features חדשים!
