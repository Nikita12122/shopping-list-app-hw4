

Project Structure
/shopping-list-backend   → Backend (Node.js, Express, MongoDB)
/untitled4               → Frontend (React app)
/Insomnia_2025-12-08.yaml → Exported Insomnia workspace with all CRUD requests

How to Run the Backend
1. Install dependencies
cd shopping-list-backend
npm install

2. Start MongoDB

Either:

Local MongoDB server (mongod)

Or MongoDB Atlas connection string (configured in server.js)

3. Run the backend
node server.js


If successful, you should see:

API running on http://localhost:3000
MongoDB connected

How to Run the Frontend
1. Install packages:
cd untitled4
npm install

2. Start React app:
npm start


Frontend runs on:

http://localhost:3001



