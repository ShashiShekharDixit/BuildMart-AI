# 🏗️ BuildMart AI — Smart Construction Material Marketplace

> India's most advanced AI-powered construction material marketplace  
> Built with Java Spring Boot + React.js + OpenAI GPT-4

---

## 🚀 QUICKEST WAY TO RUN (3 minutes)

### Windows
```
1. Extract the ZIP
2. Double-click start.bat
3. Choose option 1 (Frontend only)
4. Browser opens at http://localhost:3000
```

### Linux / Mac
```bash
cd buildmart
chmod +x start.sh
./start.sh
# Choose option 1 — Frontend only
```

---

## 📋 PREREQUISITES

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18+ | https://nodejs.org (LTS) |
| **Java JDK** | 17+ | https://adoptium.net |
| **Maven** | 3.9+ | https://maven.apache.org |
| **MySQL** | 8.0+ | https://dev.mysql.com/downloads |
| **Redis** | 7+ | https://redis.io/download (optional) |
| **Docker** | Latest | https://docker.com (optional) |

---

## 🎯 THREE WAYS TO RUN

### Option 1 — Frontend Only (Fastest, No Java Needed)

```bash
cd buildmart/frontend
npm install
npm start
# Opens at http://localhost:3000
```
Demo products, AI advisor demo, full UI — all work without backend.

---

### Option 2 — Full Stack (Recommended)

**Step 1 — Set up MySQL:**
```sql
mysql -u root -p
CREATE DATABASE buildmart_db CHARACTER SET utf8mb4;
EXIT;
```

**Step 2 — Configure backend:**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
openai.api.key=sk-YOUR_OPENAI_KEY
```

> **No OpenAI key?** AI features use formula-based fallback — still works!

> **No Redis?** Change `spring.cache.type=redis` to `spring.cache.type=simple`

> **No MySQL?** Uncomment the H2 section in application.properties for in-memory DB.

**Step 3 — Run backend:**
```bash
cd buildmart/backend
mvn spring-boot:run
# Wait for: "BuildMart AI — Marketplace Running"
```

**Step 4 — Run frontend (new terminal):**
```bash
cd buildmart/frontend
npm install
npm start
```

---

### Option 3 — Docker (Everything Automated)

```bash
cd buildmart
cp .env.example .env
# Edit .env — add your OPENAI_API_KEY
docker compose up --build
```

App available at http://localhost:3000

---

## 🔑 LOGIN CREDENTIALS

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@demo.com | Demo@1234 |
| Vendor | vendor@demo.com | Demo@1234 |
| Admin | admin@buildmart.ai | Demo@1234 |

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/api/swagger-ui.html |
| H2 Console | http://localhost:8080/api/h2-console |
| Health Check | http://localhost:8080/api/actuator/health |

---

## 🤖 AI FEATURES

### Material Advisor
Go to `/ai-advisor` → Enter project description → Get material quantities + costs.
- Works with OpenAI API (GPT-4o-mini)
- Falls back to formula-based estimates without API key

### Price Predictor
Predict if material prices will rise or fall next month for any city.

### AI Chatbot
Floating chat button (bottom-right) — ask anything about construction materials.

**To enable real AI:** Add your OpenAI API key to `application.properties`:
```
openai.api.key=sk-your-key-here
```
Get a key at: https://platform.openai.com/api-keys (~$0.01 for 100 questions)

---

## 📁 PROJECT STRUCTURE

```
buildmart/
├── 📁 backend/                    Java Spring Boot
│   └── src/main/java/com/buildmart/
│       ├── BuildMartApplication.java     Main entry
│       ├── controller/                   REST endpoints
│       │   ├── AuthController.java       Login/Register/JWT
│       │   ├── ProductController.java    Products CRUD
│       │   ├── OrderController.java      Orders + Cart
│       │   ├── AIController.java         OpenAI integration
│       │   └── VendorAdminController.java Vendor + Admin
│       ├── entity/Entities.java          JPA entities (15)
│       ├── repository/Repositories.java  JPA repositories
│       ├── service/Services.java         Business logic
│       ├── security/SecurityConfig.java  JWT + auth
│       ├── exception/                    Error handling
│       ├── config/                       App + Swagger + WS
│       └── util/SecurityUtils.java       Rate limiting
│
├── 📁 frontend/                   React.js
│   └── src/
│       ├── App.js                        Routing + Theme
│       ├── pages/
│       │   ├── HomePage.js               Landing page
│       │   ├── ProductsPage.js           Search + Filter
│       │   ├── AIAdvisorPage.js          AI tools
│       │   ├── LoginPage.js              Auth pages
│       │   ├── vendor/VendorDashboard.js Analytics
│       │   └── admin/AdminDashboard.js   Admin panel
│       ├── components/
│       │   ├── ai/AIChatbot.js           Floating chatbot
│       │   └── common/                   Navbar, Footer, etc.
│       ├── store/                        Redux (auth, cart)
│       ├── services/api.js               Axios + JWT refresh
│       ├── hooks/                        useApi, useAuth
│       └── utils/                        Formatters, constants
│
├── 📁 scripts/init.sql            DB seed with demo data
├── docker-compose.yml             Full Docker setup
├── .env.example                   Environment template
├── start.sh                       Linux/Mac quick start
└── start.bat                      Windows quick start
```

---

## 🔌 API ENDPOINTS

### Authentication
```
POST /api/auth/register          Register customer or vendor
POST /api/auth/login             Login → returns JWT
POST /api/auth/refresh           Refresh access token
GET  /api/auth/verify-email      Verify email address
POST /api/auth/send-otp          Send phone OTP
POST /api/auth/verify-otp        Verify phone OTP
POST /api/auth/forgot-password   Password reset link
POST /api/auth/logout            Invalidate token
```

### Products
```
GET  /api/products/public/search          Search with filters
GET  /api/products/public/{id}            Product details
GET  /api/products/public/categories      All categories
GET  /api/products/public/featured        Featured products
GET  /api/products/public/nearby          Near a location
POST /api/products/vendor/add             Vendor: add product
PATCH /api/products/vendor/{id}/stock     Update stock
POST /api/products/{id}/review            Add review
```

### Orders
```
POST /api/orders/place                   Place order
GET  /api/orders                         Order history
GET  /api/orders/{no}/track              Live tracking
GET  /api/orders/{no}/invoice            Invoice PDF
POST /api/orders/{no}/cancel             Cancel order
POST /api/orders/{no}/return             Return request
POST /api/orders/repeat/{no}             Reorder
```

### AI
```
POST /api/ai/material-advisor    Estimate materials (GPT-4)
POST /api/ai/price-prediction    Price trend prediction
POST /api/ai/chat                Conversational chatbot
POST /api/ai/fraud-check         Admin: fraud detection
GET  /api/ai/recommendations     Personalized products
```

### Cart & Wishlist
```
GET    /api/cart                  View cart
POST   /api/cart/add              Add item
PATCH  /api/cart/item/{id}        Update quantity
DELETE /api/cart/item/{id}        Remove item
GET    /api/wishlist              View wishlist
POST   /api/wishlist/{productId}  Add to wishlist
DELETE /api/wishlist/{productId}  Remove from wishlist
```

---

## 🛡️ SECURITY FEATURES

| Feature | Implementation |
|---------|----------------|
| Password Hashing | BCrypt cost factor 12 |
| JWT Auth | HS512, 24h access + 7d refresh |
| Role-Based Access | CUSTOMER / VENDOR / ADMIN |
| SQL Injection | JPA parameterized queries |
| XSS Protection | Input sanitization |
| CSRF | Stateless JWT (no sessions) |
| Rate Limiting | 60 req/min per IP |
| Account Lockout | After 5 failed logins |
| CORS | Configurable origins |
| Security Headers | X-Frame, X-XSS, etc. |
| AI Fraud Detection | GPT-4 vendor analysis |
| Audit Logging | All actions tracked |

---

## ⚙️ CONFIGURATION REFERENCE

Key settings in `application.properties`:

```properties
# Switch to H2 (no MySQL needed):
spring.datasource.url=jdbc:h2:mem:buildmartdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true

# Disable Redis:
spring.cache.type=simple

# OpenAI:
openai.api.key=sk-...
openai.model=gpt-4o-mini

# Email:
spring.mail.username=your@gmail.com
spring.mail.password=app-password
```

---

## 🐛 TROUBLESHOOTING

**Frontend won't start:**
```bash
rm -rf node_modules && npm install
```

**Port 3000 in use (Windows):**
```cmd
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

**Port 8080 in use:**
```properties
# Change in application.properties:
server.port=8090
```

**MySQL connection refused:**
- Use H2 instead (see Configuration Reference above)
- Or check MySQL is running: `sudo systemctl start mysql`

**AI features not working:**
- Check OpenAI key in application.properties
- Fallback estimates are shown when AI unavailable

**Redis connection error:**
- Set `spring.cache.type=simple` in application.properties

---

## 📞 TECH STACK

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2 |
| Security | Spring Security, JWT (jjwt) |
| Database | MySQL 8 / H2, Hibernate JPA |
| Cache | Redis 7 |
| Frontend | React 18, MUI 5, Redux Toolkit |
| Charts | Recharts |
| Animation | Framer Motion |
| AI/LLM | OpenAI GPT-4o-mini |
| Real-time | WebSocket (STOMP) |
| Build | Maven, npm |
| Deploy | Docker, Nginx |
| API Docs | Swagger / SpringDoc OpenAPI |

---

*BuildMart AI — Made for Indian construction professionals 🇮🇳*
