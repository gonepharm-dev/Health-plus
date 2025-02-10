# Express.js API Documentation

## 📖 Overview
This is a Node.js and Express.js API that includes user management and real-time appointment functionalities.

## 🚀 Features
- User management endpoints
- Real-time appointment handling
- CORS enabled
- JSON request handling
- Logging with Morgan

---

## 📦 Installatio

1. Install dependencies:
   ```sh
   npm install
   ```

---

## ▶️ Running the Server

To start the server, run:
   ```sh
   npm start
   ```

The server will start on **http://localhost:3001**.

---

## 🛠 API Endpoints

### **Base URL:** `http://localhost:3001`

### **User Routes**
| Method | Endpoint                  | Description       |
|--------|---------------------------|-------------------|
| GET    | `/api/collections/users`   | Fetch all users  |
| POST   | `/api/collections/users`   | Create a user    |

### **Appointment Routes**
| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| GET    | `/api/realtime`      | Fetch real-time appointments   |
| POST   | `/api/realtime`      | Create a new appointment       |

---


---

## ✨ Middleware Used
- **express.json()** - Parses incoming JSON requests.
- **cors** - Enables Cross-Origin Resource Sharing.
- **morgan** - Logs HTTP requests for debugging.

---

