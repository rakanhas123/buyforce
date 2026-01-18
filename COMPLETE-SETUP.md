# 🚀 BuyForce - חיבור מלא: Backend ↔ Frontend ↔ Mobile

## ✅ סיכום המערכת

### המערכת כוללת 3 חלקים מחוברים:

1. **Backend** (Port 3000) - Node.js + Express + PostgreSQL
2. **Web Frontend** (Port 5173) - React + Vite
3. **Admin Panel** (Port 5174) - React + Vite
4. **Mobile App** - React Native + Expo

---

## 🎯 מה עשינו

### Backend
✅ עדכנו את קובץ [.env](BuyForce-Backend/src/.env) - פורט 5433 וסיסמה נכונה  
✅ עדכנו [app.module.ts](BuyForce-Backend/src/app.module.ts) - שימוש במשתני סביבה  
✅ הוספנו CORS ב-[main.ts](BuyForce-Backend/src/main.ts) ו-[server.ts](BuyForce-Backend/src/server.ts)  
✅ מילאנו את הבסיס נתונים ב-data מלא  
✅ הסרנו packages מיושנים (@types/mongoose, @types/stripe)

### Web Frontend
✅ יצרנו [api.ts](BuyForce1/packages/features/api.ts) - API Client מלא  
✅ יצרנו [.env](BuyForce1/apps/web/.env) - `VITE_API_URL=http://localhost:3000`  
✅ עדכנו [http.ts](BuyForce1/apps/admin-web/src/api/http.ts) - שימוש במשתנה סביבה

### Mobile App
✅ יצרנו [api.ts](BuyForce1/apps/mobile/app/lib/api.ts) - API Client למובייל  
✅ יצרנו [AuthContext.tsx](BuyForce1/apps/mobile/app/lib/AuthContext.tsx) - ניהול authentication  
✅ עדכנו [login.tsx](BuyForce1/apps/mobile/app/(auth)/login.tsx) - התחברות אמיתית  
✅ עדכנו [register.tsx](BuyForce1/apps/mobile/app/(auth)/register.tsx) - הרשמה אמיתית  
✅ עדכנו [_layout.tsx](BuyForce1/apps/mobile/app/_layout.tsx) - הוספנו AuthProvider  
✅ יצרנו [groups-new.tsx](BuyForce1/apps/mobile/app/(tabs)/groups-new.tsx) - מסך קבוצות מהשרת

---

## 🚀 הוראות הפעלה

### 1️⃣ Docker (Database)
```bash
cd BuyForce-Backend/docker
docker-compose up -d
```
✅ PostgreSQL על פורט **5433**  
✅ MongoDB על פורט **27017**  
✅ Redis על פורט **6379**

### 2️⃣ Backend
```bash
cd BuyForce-Backend
pnpm install
pnpm dev
```
✅ רץ על **http://localhost:3000**

### 3️⃣ Web Frontend
```bash
cd BuyForce1/apps/web
pnpm install
pnpm dev
```
✅ רץ על **http://localhost:5173**

### 4️⃣ Admin Panel
```bash
cd BuyForce1/apps/admin-web
pnpm install
pnpm dev
```
✅ רץ על **http://localhost:5174**

### 5️⃣ Mobile App
```bash
cd BuyForce1/apps/mobile
pnpm install
pnpm start
```
✅ Android: `pnpm android`  
✅ iOS: `pnpm ios`  
✅ Web: `pnpm web`

---

## 🔐 משתמשים לבדיקה

הבסיס נתונים מכיל 20 משתמשים עם סיסמה: `Password123!`

דוגמאות:
- david.cohen@example.com
- sarah.levi@example.com
- michael.mizrahi@example.com

---

## 📡 API Endpoints

### Authentication
- `POST /v1/auth/login` - התחברות
- `POST /v1/auth/register` - הרשמה
- `POST /v1/auth/logout` - התנתקות
- `GET /v1/auth/me` - פרטי משתמש מחובר

### Products
- `GET /api/products` - כל המוצרים (67 מוצרים)
- `GET /api/products/:id` - מוצר לפי ID

### Groups
- `GET /v1/groups` - כל הקבוצות (15 קבוצות)
- `GET /v1/groups/:id` - קבוצה לפי ID
- `POST /v1/groups/:id/join` - הצטרפות לקבוצה

### Wishlist
- `GET /v1/wishlist` - רשימת משאלות
- `POST /v1/wishlist` - הוספה לרשימת משאלות
- `DELETE /v1/wishlist/:id` - מחיקה

### Admin
- `GET /v1/admin/users` - כל המשתמשים
- `GET /v1/admin/groups` - כל הקבוצות
- `GET /v1/admin/wishlist` - כל רשימות המשאלות

### Health Check
- `GET /v1/health` - בדיקת תקינות

---

## 🌐 CORS Configuration

הבקאנד מאפשר גישה מ:
- `http://localhost:5173` - Web App
- `http://localhost:5174` - Admin Panel
- `http://localhost:3000` - Same origin
- `http://10.0.2.2:3000` - Android Emulator
- `http://localhost:8081` - React Native Metro

---

## 📊 Database Content

הבסיס נתונים מכיל:
- ✅ **21 משתמשים** - עם שמות בעברית
- ✅ **67 מוצרים** - iPhone, MacBook, PS5, ועוד
- ✅ **15 קבוצות** - פעילות, הושלמו, בוטלו
- ✅ **5 קטגוריות** - סמארטפונים, מחשבים, אודיו, קונסולות, מצלמות
- ✅ **20 תמונות** - למוצרים
- ✅ **35 מפרטים טכניים**
- ✅ **10 הזמנות**
- ✅ **33 קשרי משתמש-קבוצה**
- ✅ **2 מנהלים**

---

## 📂 מבנה הפרויקט

```
buyforce/
├── BuyForce-Backend/          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── main.ts           # NestJS entry
│   │   ├── server.ts         # Express server
│   │   ├── app.module.ts     # Main module
│   │   ├── auth/             # Authentication
│   │   ├── users/            # Users module
│   │   ├── groups/           # Groups module
│   │   ├── wishlist/         # Wishlist module
│   │   └── db/               # Database connection
│   └── docker/
│       ├── docker-compose.yml
│       ├── seed_data_corrected.sql
│       └── seed_data_additional.sql
│
└── BuyForce1/                 # Frontend Monorepo
    ├── apps/
    │   ├── web/              # Main user app (React)
    │   │   ├── app.tsx
    │   │   └── .env
    │   ├── admin-web/        # Admin panel (React)
    │   │   ├── src/api/
    │   │   └── .env
    │   └── mobile/           # Mobile app (React Native)
    │       ├── app/
    │       │   ├── lib/
    │       │   │   ├── api.ts
    │       │   │   └── AuthContext.tsx
    │       │   ├── (auth)/
    │       │   └── (tabs)/
    │       └── package.json
    └── packages/
        └── features/
            └── api.ts        # Shared API client
```

---

## 🧪 בדיקות

### Backend Health Check
```bash
# PowerShell
Invoke-WebRequest http://localhost:3000/v1/health

# Browser
http://localhost:3000/v1/health
```

תשובה צפויה:
```json
{
  "status": "OK",
  "service": "BuyForce Backend",
  "version": "v1",
  "db": "OK"
}
```

### Products API
```bash
http://localhost:3000/api/products
```

### Groups API
```bash
http://localhost:3000/v1/groups
```

---

## 🔧 כלים נוספים

### Database Management
- **pgAdmin**: http://localhost:5050
  - Email: admin@buyforce.com
  - Password: admin123

### Docker Commands
```bash
# View containers
docker ps

# View logs
docker logs buyforce-postgres

# Stop all
docker-compose down

# Restart
docker-compose restart
```

---

## 🐛 Troubleshooting

### Backend לא מתחבר ל-Database
```bash
docker ps  # בדוק שה-container רץ
docker logs buyforce-postgres
```

### Frontend לא רואה את הבקאנד
בדוק `.env` files:
- Web: `VITE_API_URL=http://localhost:3000`
- Admin: `VITE_API_URL=http://localhost:3000`

### Mobile לא מתחבר
- Android Emulator: `http://10.0.2.2:3000`
- iOS Simulator: `http://localhost:3000`
- Real Device: השתמש ב-IP של המחשב

### CORS Errors
וודא שהכתובת של הפרונטאנד מופיעה ב-CORS configuration בבקאנד.

---

## 📚 מסמכים נוספים

- [INTEGRATION.md](INTEGRATION.md) - חיבור Web Frontend
- [BuyForce1/apps/mobile/README-BACKEND.md](BuyForce1/apps/mobile/README-BACKEND.md) - חיבור Mobile

---

## 🎉 הכל מוכן!

המערכת מחוברת במלואה ומוכנה לפיתוח:
✅ Backend רץ ומחובר לבסיס נתונים  
✅ Web Frontend מחובר לבקאנד  
✅ Admin Panel מחובר לבקאנד  
✅ Mobile App מחובר לבקאנד  
✅ בסיס נתונים מלא ב-data  

**אפשר להתחיל לפתח features חדשים! 🚀**
