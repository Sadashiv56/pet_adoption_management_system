🐾 Pet Adoption Management System

This is a full-stack Pet Adoption Management System with Admin and User roles.
Admins can manage pets and applications, while users can apply to adopt pets and track their application status.

🚀 Project Setup
🔧 Default Configuration

By default, the frontend expects the backend API at:

http://localhost:5000/api


To override this, create a .env file in the client folder and add:

REACT_APP_API_URL=http://localhost:5000/api

📦 Installation & Running the Project
1️⃣ Backend Setup
cd backend
npm install
npm run dev


Backend will run on:

http://localhost:5000

2️⃣ Frontend Setup
cd client
npm install
npm start


Frontend will run on:

http://localhost:3000

🔐 Admin Setup
Create Admin User

An admin seed file is already created.

node seedAdmin.js


✅ This command will create the admin user in the database.

After running the command:

Login through the UI using admin credentials.

🧑‍💼 Admin Features

Once logged in as Admin, you can access the following modules:

🐕 1. Pets Management

Add new pets

Edit pet details

Delete pets

Manage all pet records

📋 2. Available Pets

View all pets that are currently available for adoption

These pets are visible to users for adoption

📝 3. Applications Management

View all adoption applications

Update application status:

Approved

Rejected

Pending

Admins have full control over application status.

👤 User Features
🔑 User Login

Login as a registered user to access the dashboard

📊 User Dashboard

View all submitted adoption applications

Track application status:

Approved

Rejected

Pending

🐾 Pet Adoption

Click on Pet Adopt

View list of available pets

Apply for adoption

Application is submitted successfully and appears in dashboard

🔍 Additional Features

✅ Search functionality

✅ Pagination

✅ Proper status management

✅ Role-based access (Admin / User)

All features are fully functional and working as expected.

🛠️ Tech Stack

Frontend: React

Backend: Node.js, Express

Database: MongoDB

Authentication: Role-based (Admin & User)

📌 Notes

Ensure MongoDB is running before starting the backend

Seed admin before trying to log in as admin

Environment variables must be set correctly for API communication
