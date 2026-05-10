# 🧺 WeLaund — SaaS Laundry Management System

A premium, modern SaaS-based Laundry Management System built with **Next.js (Frontend)**, **PHP (Backend)**, and **PostgreSQL (Database)**.

---

## 🚀 Getting Started

Follow these steps to set up the project on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
*   **PHP 8.x** (Included in XAMPP)
*   **PostgreSQL 14+** (Accepting connections on port 5432)
*   **Node.js & npm** (For the Next.js frontend)

### 2. Database Setup
1.  Open your PostgreSQL client (pgAdmin or similar).
2.  Create a new database named `welaund`.
3.  Import the schema:
    *   Execute the SQL code in `backend/database/database_schema.sql`.
4.  (Optional) Seed the data:
    *   Execute `backend/database/seed.sql` to create default shops, staff, and admins.

### 3. Backend Configuration
1.  Navigate to the `backend/` folder.
2.  Open the `.env` file (create it if missing).
3.  Configure your database credentials:
    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=welaund
    DB_USER=postgres
    DB_PASS=your_postgres_password
    ```

### 4. Frontend Installation
1.  Navigate to the `frontend/` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  The frontend will be available at `http://localhost:3000`.

---

## 🔑 Default Credentials
If you used the `seed.sql` file, you can log in with:

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `superadmin@welaund.com` | `Admin@123` |
| **Shop Owner** | `owner1@welaund.com` | `Admin@123` |
| **Staff** | `staff1@welaund.com` | `Admin@123` |

---

## 🛠 Features
*   **Multi-tenant SaaS Architecture**: Manage multiple laundry shops under one platform.
*   **Live Order Tracking**: Stage-by-stage status updates for customers.
*   **Digital Payments**: Integrated GCash/Maya reference validation.
*   **Bento Dashboard**: Analytics and reporting for shop owners.
*   **Database Backup & Restore**: Secure data management for Super Admins.
*   **Role-Based Access**: Specialized interfaces for 4 distinct user roles.

---

## 📂 Project Structure
*   `/frontend`: Next.js application using Tailwind CSS and NextUI.
*   `/backend`: PHP API controllers and core business logic.
*   `/backend/database`: SQL schema and seed files.
*   `/backend/api`: RESTful API endpoints for frontend consumption.
