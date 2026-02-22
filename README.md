# 🏨 overstay

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Theme: Weird](https://img.shields.io/badge/Theme-Life_But_Make_It_Weird-purple)](#)
[![Theme: Useless](https://img.shields.io/badge/Theme-Uselessly_Useful-blue)](#)
[![Version](https://img.shields.io/badge/version-2.0.0--enterprise-orange)](#)
[![License](https://img.shields.io/badge/license-MIT-yellow)](#)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome%2C_probably-informational)](#)

---

## 🎭 Project Vision

OEHN is a high-performance backend system built on the philosophy that **simple tasks deserve complex solutions**.

> *"Why check in a guest in 30 seconds when you can do it in 30 seconds, with 14 validation layers, 3 database joins, and a JWT token that refreshes every 47 minutes for reasons no one can fully remember?"*
> — The Architect Syndicate, founding charter

### 🌌 1. Life, But Make It Weird

Checking into a hotel shouldn't be a 30-second interaction. In OEHN, every booking is treated as a high-stakes cinematic event, backed by over-engineered validation logic and exhaustive database normalization.

We believe a room reservation should pass through no fewer than **seven middleware functions** before being committed to the database. Each function performs a critical role, most of which are still being documented.

### 🛠️ 2. Uselessly Useful

We solve problems that didn't exist, and we solve them with style. Whether it's tracking the sub-millisecond timestamps of a lightbulb change or auditing "unforeseen magical occurrences" in the budget, OEHN handles it with enterprise-grade precision.

Our motto: **"If it can be done simply, we haven't tried hard enough."**

---

## 👥 The Architect Syndicate

| Name | Role | Student ID | Primary Contribution |
|---|---|---|---|
| **Tashin** | Lead Over-Engineer | 220041239 | Invented problems, then solved them |
| **Mazharul** | Master of Redundancy | 220041251 | Wrote the same function twice, on purpose |
| **Nirzan** | Senior Chaos Architect | 220041208 | Ensured the system works despite understanding |

---

## ✨ Elegant UI & Seamless UX

A system this powerful requires an interface that doesn't get in the way. OEHN features a **Goodlooking UI** designed for maximum clarity. We believe that ease of use is a human right; therefore, the dashboard uses a minimalist aesthetic to hide the "chaos" of the backend.

- **Intuitive Navigation:** Users can manage bookings, staff, and payments without a manual.
- **Responsive Feedback:** Real-time visual cues ensure the user always knows the system state.
- **Accessibility:** High-contrast elements and logical flow make it easy for any staff member to master in minutes.
- **Dashboard Analytics:** A real-time overview of occupancy, revenue, and the number of lightbulbs changed this week.
- **Dark Mode:** Because every serious enterprise application has a dark mode, and our dark mode is very dark indeed.

---

## 🚀 Why OEHN Matters: Real-World Usefulness

In a world of "good enough" software, OEHN stands as a fortress of reliability. By over-engineering the boring parts of hotel management, we eliminate the human error that typically plagues hospitality. When every lightbulb change and every cent of salary is tracked through high-security ledgers, the "unknowns" of running a business disappear.

---

## 🌍 Impact on Real Life

How does this make life easier? For the manager, it means **total transparency**. You no longer guess where the budget went; you see it in high-definition analytics. By making the mundane "weird" and the useless "useful," we've created a tool that ensures day-to-day operations remain smooth and predictable.

Concretely, OEHN solves the following real-world pain points:

- A front-desk clerk double-booking Room 204 on a Saturday night? **Impossible.** Three mutex locks and a distributed transaction prevent it.
- A maintenance worker forgetting to log a broken faucet? **Unthinkable.** The system sends a reminder every 4 hours until it is logged.
- A manager not knowing who changed the lightbulb in Room 101 at 2:37 PM on a Tuesday? **Unacceptable — and now, also preventable.**

---

## 🗂️ Core Features

### 🛎️ Booking & Reservation Engine
The heart of OEHN. Room reservations are handled through a multi-stage pipeline that validates guest identity, room availability, rate applicability, and cosmic alignment (configurable). Supports single-night stays, extended stays, group bookings, and theoretical bookings pending management approval.

- Conflict-free double-booking prevention with row-level DB locking
- Automated confirmation emails with booking reference codes
- Cancellation & modification workflows with audit trails
- Dynamic pricing hooks (not yet connected to anything, but the hooks are there)

### 👷 Staff & HR Management
Every employee in OEHN is a first-class entity. Their schedules, roles, salaries, and shift notes are tracked with the same reverence as a Fortune 500 payroll system, regardless of whether the hotel has 8 rooms or 800.

- Role-based access: Admin, Manager, Front Desk, Housekeeping, Maintenance
- Shift scheduling with conflict detection
- Salary ledger with per-entry audit logs
- Performance note system (currently only used to log "arrived on time" and "did not arrive on time")

### 🔧 Maintenance & Asset Tracking
The crown jewel of OEHN's over-engineered philosophy. Every physical asset in the hotel — from the industrial boiler to individual desk lamps — has a lifecycle record in the database.

- Asset registration with category, location, and purchase date
- Maintenance request ticketing with priority levels: `LOW`, `MEDIUM`, `HIGH`, `CATASTROPHIC`, `MAGICAL`
- Sub-millisecond timestamp logging for all status updates
- A dedicated `magical_occurrences` audit table for budget entries that cannot otherwise be explained

### 💰 Financial Ledger & Budget Tracking
Money flows through OEHN with the same traceability as an international wire transfer. Revenue from bookings, costs from maintenance, and staff salaries are reconciled in real time against department budgets.

- Income vs. expenditure tracking per department
- Invoice generation for guests on checkout
- Monthly financial summaries with drill-down capability
- The aforementioned `magical_occurrences` column, fully indexed

### 📊 Reporting & Analytics
Managers deserve data. OEHN provides it, perhaps in excess.

- Occupancy rate trends (daily, weekly, monthly)
- Revenue per available room (RevPAR) calculations
- Staff attendance summaries
- Maintenance cost breakdowns by asset category
- A heatmap of which rooms guests complain about most (Room 204 is always red)

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────┐
│              CLIENT LAYER                   │
│   Browser / Mobile  ──►  OEHN Frontend      │
└────────────────────┬────────────────────────┘
                     │  HTTPS / REST
┌────────────────────▼────────────────────────┐
│              API GATEWAY                    │
│   Express.js  │  JWT Auth  │  Rate Limiter  │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Booking  │ │  Staff   │ │ Finance  │
  │ Service  │ │ Service  │ │ Service  │
  └────┬─────┘ └────┬─────┘ └────┬─────┘
       │             │             │
┌──────▼─────────────▼─────────────▼──────┐
│           MySQL Database Layer           │
│  (Highly Normalized, Deeply Respected)   │
└──────────────────────────────────────────┘
```

OEHN follows a **service-oriented monolith** architecture pattern — not quite microservices, not quite a monolith, but something in between that we feel good about.

---

## 🗄️ Database Design

The OEHN database schema is a testament to normalization. We are in **Third Normal Form (3NF)** and quietly aspiring toward **Boyce-Codd Normal Form (BCNF)** for the tables we are most proud of.

Key design decisions:
- Every table has a `created_at` and `updated_at` timestamp, even the lookup tables
- Foreign key constraints are enforced religiously
- The `magical_occurrences` field is a `VARCHAR(255)` because some things defy enumeration
- All monetary values are stored as `DECIMAL(15,2)` because we do not trust floating point arithmetic with money

**Core Tables (abridged):**

```
guests           → bookings         → rooms
staff            → shifts           → departments
assets           → maintenance_logs → asset_categories
invoices         → payments         → payment_methods
budget_entries   → departments      → magical_occurrences (audit)
```

---

## 🔐 Google Authentication & Security

Friction is the enemy of productivity. OEHN supports **Direct Google Login**, allowing staff and administrators to bypass traditional password hurdles. By integrating OAuth2 protocols, we leverage world-class security while making account access a one-click reality.

**Security Stack:**
- **Bcrypt** — passwords hashed with a cost factor of 12, because 10 felt casual
- **JWT** — access tokens (15 min expiry) + refresh tokens (7 day expiry), stored securely
- **Google OAuth2** — for users who find passwords philosophically exhausting
- **HTTPS Enforcement** — all traffic is encrypted; unencrypted requests are turned away politely
- **Input Sanitization** — every user input is treated as a potential threat, because it might be
- **RBAC** — Role-Based Access Control ensures a housekeeper cannot access the financial ledger, no matter how curious they are

---

## 💳 A Superior Payment Ecosystem

OEHN introduces a **Robust Payment System** that supports Credit Cards, E-Wallets, and modern digital transactions. The backend synchronizes booking amounts and maintenance costs in real-time, ensuring that the hotel's financial health is always accurate and up-to-date.

**Supported Payment Methods:**
| Method | Status | Notes |
|---|---|---|
| Credit / Debit Card | ✅ Active | Visa, Mastercard, AmEx |
| E-Wallet | ✅ Active | Generic integration layer |
| Cash (Manual Entry) | ✅ Active | Logged with full audit trail |
| Bank Transfer | ⚠️ Planned | The middleware is ready |
| Cryptocurrency | ❌ Not planned | The Architect Syndicate drew a line |

---

## 🛠️ Technical Stack

| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js (≥18.x) | Non-blocking I/O for maximum throughput |
| Framework | Express.js | Flexible, minimal, battle-tested |
| Database | MySQL 8.x | ACID compliance, relational integrity |
| ORM / Query | Raw SQL + connection pooling | We wanted to know what was happening |
| Authentication | Bcrypt, JWT, Google OAuth2 | Belt, suspenders, and a safety pin |
| Environment | dotenv | Secrets stay secret |
| Dev Tools | Nodemon, ESLint | Sanity preservation |

---

## 📁 Project Structure

```
oehn/
├── src/
│   ├── config/
│   │   ├── db.js               # Database connection pool
│   │   └── passport.js         # Google OAuth2 strategy
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── staffController.js
│   │   ├── maintenanceController.js
│   │   └── financeController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # RBAC enforcement
│   │   └── errorMiddleware.js  # Global error handler
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── staffRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   └── financeRoutes.js
│   ├── models/                 # DB query abstractions
│   └── utils/                  # Helpers, validators, formatters
├── sql/
│   └── schema.sql              # The full normalized schema
├── .env.example
├── package.json
└── README.md                   # You are here
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18.0.0
- MySQL 8.x running locally or remotely
- A Google Cloud project with OAuth2 credentials (for Google Login)
- A willingness to embrace complexity

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/oehn.git
cd oehn

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your database credentials, JWT secret, and Google OAuth keys

# 4. Initialize the database
mysql -u root -p < sql/schema.sql

# 5. Start the development server
npm run dev
```

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=oehn_db

# Authentication
JWT_SECRET=a_very_long_and_unguessable_string
JWT_REFRESH_SECRET=another_very_long_and_unguessable_string
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Misc
BCRYPT_SALT_ROUNDS=12
```

---

## 🧪 API Reference (Abridged)

All endpoints are prefixed with `/api/v1`. Authentication is required unless marked `[public]`.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new staff account |
| `POST` | `/auth/login` | Login with email & password |
| `GET` | `/auth/google` `[public]` | Initiate Google OAuth2 flow |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/logout` | Invalidate refresh token |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/bookings` | List all bookings |
| `POST` | `/bookings` | Create a new booking |
| `GET` | `/bookings/:id` | Get booking details |
| `PATCH` | `/bookings/:id` | Modify a booking |
| `DELETE` | `/bookings/:id` | Cancel a booking |

### Staff
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/staff` | List all staff |
| `POST` | `/staff` | Register a new staff member |
| `GET` | `/staff/:id/shifts` | View staff shift schedule |
| `POST` | `/staff/:id/shifts` | Assign a shift |

### Maintenance
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/assets` | List all hotel assets |
| `POST` | `/maintenance/requests` | Submit a maintenance request |
| `PATCH` | `/maintenance/requests/:id` | Update request status |
| `GET` | `/maintenance/logs` | Full maintenance audit log |

---

## 🔮 Future Roadmap

These are features the Architect Syndicate has considered, debated, and placed on a list titled "Someday, Perhaps":

- [ ] **WebSocket-based live dashboard** — so managers can watch occupancy change in real time
- [ ] **Multi-property support** — for hotel chains that also believe in over-engineering
- [ ] **Mobile app** — React Native, because one platform was not enough
- [ ] **AI-powered room recommendations** — using guest history to suggest the room least likely to disappoint
- [ ] **Predictive maintenance** — alert staff *before* a lightbulb fails, using luminosity trend analysis
- [ ] **`magical_occurrences` ML classifier** — automatically categorize the unexplainable
- [ ] **Blockchain audit log** — we won't do this, but we wanted you to know we considered it

---

## 🤝 Contributing

We welcome contributions from engineers who share our belief that no solution is too elaborate for a sufficiently mundane problem.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/add-seventh-validation-layer`
3. Commit your changes: `git commit -m "feat: add seventh middleware layer to booking pipeline"`
4. Push to the branch: `git push origin feature/add-seventh-validation-layer`
5. Open a Pull Request and describe the problem you invented and then solved

Please follow the existing code style and ensure all new endpoints are thoroughly documented in Postman or equivalent.

---

## ⚖️ License

This project is licensed under the **MIT License** — meaning you are free to use, modify, and distribute this software, including its over-engineering philosophy, in your own projects.

---

*Built with excessive ambition and a genuine love for hospitality infrastructure.*
*The Architect Syndicate — 220041239 · 220041251 · 220041208*