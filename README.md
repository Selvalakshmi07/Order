🚀 Custom Dashboard Builder

A powerful full-stack web application that allows users to create dynamic, customizable dashboards using drag-and-drop widgets like charts, tables, and KPI cards.

---

📌 Overview

The Custom Dashboard Builder enables users to:

- Build personalized dashboards
- Configure widgets (Charts, Tables, KPIs)
- View real-time customer order data
- Manage and edit layouts dynamically

---

✨ Features

🧩 Dashboard Builder

- Drag & Drop Widgets
- Resize & Reposition Components
- Dynamic Layout Management

📊 Widgets

- 📈 Charts (Bar, Line, Pie)
- 📋 Tables with Sorting & Filtering
- 📌 KPI Cards (Revenue, Orders, Quantity)

⚙️ Configuration Panel

- Select Metrics (Revenue, Orders, Avg Value)
- Apply Aggregations (Sum, Avg, Count, Max, Min)
- Sorting Options (Ascending, Descending)

🔄 Real-Time Data

- Integrated with Customer Order Module
- Instant UI Updates

📱 Responsive Design

- Works on Desktop, Tablet, Mobile

---

🛠️ Tech Stack

Frontend

- React.js (with TypeScript)
- Tailwind CSS
- Zustand (State Management)
- Vite

Backend

- Node.js
- Express.js
- MongoDB

---

📂 Project Structure

Order/
│
├── backend/
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── widgets/
│   │   ├── store/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json

---

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/selvalakshmi07/Order.git
cd Order

---

2️⃣ Backend Setup

cd backend
npm install
npm run dev

---

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

---

🌐 Environment Variables

Create a ".env" file in backend:

MONGO_URI=your_mongodb_connection_string
PORT=5000

---

📊 Sample Data

- Seed script included ("seed.js")
- Preloaded customer order data

---

📸 Screenshots

Add your UI screenshots here

---

🧠 Challenges & Learnings

- Implementing drag-and-drop UI
- Managing global state efficiently
- Real-time data synchronization
- Responsive dashboard design

---

🚀 Future Improvements

- User Authentication
- Save & Load Dashboard Layouts
- Advanced Analytics
- Export Reports

---

👨‍💻 Author

Selva S
GitHub: https://github.com/selvalakshmi07

---

📜 License

This project is for assessment purposes (Halleyx Challenge).

## 🎥 Demo Video
[![Watch the demo](https://img.youtube.com/vi/W7KuyMxyNnA/0.jpg)](https://youtu.be/W7KuyMxyNnA)
