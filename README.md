# 🚀 Team Project Management API

A secure and scalable **backend system** built with **Node.js**, **Express.js**, and **MongoDB**, designed to streamline team collaboration by managing **projects**, **tasks**, and **team roles** efficiently.

This RESTful API provides **role-based access control (RBAC)**, ensuring that **Admins** manage the system while **Members** focus on their assigned projects and tasks — all powered by JWT authentication.

---

## 🧠 Overview

The **Team Project Management API** serves as the backend foundation for a collaborative team management platform. 

It allows teams to organize projects, assign members, and manage tasks efficiently while maintaining strict access control through **role-based permissions**.

This project is ideal for startups, internal tools, or learning how to build a **production-grade Node.js API**.

---

## 🎯 Core Objectives

- Develop a **robust REST API** for managing users, projects, and tasks.  
- Enforce **role-based permissions** for Admins and Members.  
- Implement **secure authentication** using JWT and password hashing.  
- Provide a **developer-friendly structure** for easy testing and integration.

---

## 🧩 Key Features

| Category | Description |
| :--- | :--- |
| **🔐 Authentication** | User registration and login with JWT-based authentication. |
| **👥 Role-Based Access Control** | Admins and Members have clearly defined capabilities. |
| **📁 Project Management (Admin)** | Create, update, assign members, and delete projects. |
| **🧑‍🤝‍🧑 Team Management** | Admins assign/remove members; members view only their projects. |
| **📝 Task Management** | Members manage tasks (create, update, delete, view) in assigned projects. |
| **🛡️ Security** | Password hashing via **bcrypt**, secure token-based sessions. |
| **🧠 Developer Friendly** | RESTful structure, clean codebase, and Postman support. |

---

## 🧰 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Security** | bcrypt for password hashing |
| **Environment Config** | dotenv |
| **Testing** | Postman |
| **Version Control** | Git & GitHub |

---

## 🧑‍💼 User Roles & Permissions

| Role | Description | Capabilities |
|------|--------------|--------------|
| **Admin** | Has full control of the system. | - Manage users, projects, and teams<br>- Assign/remove members<br>- View/edit/delete all projects and tasks |
| **Member** | Limited to assigned projects. | - View assigned projects<br>- Manage (create/update/delete) their own tasks<br>- View all tasks within their projects |

---

## 🧩 User Stories (Feature Requirements)

### 👤 Authentication & User Management
- Register a new account (name, email, password)
- Login to receive a JWT token
- Admins can view all registered users

### 🗂️ Project Management (Admin)
- Create, update, or delete projects
- Deleting a project removes all related tasks automatically

### 👥 Team Management
- Admin assigns or removes members from a project
- Members can only view projects they are part of

### ✅ Task Management (Members)
- Create, view, update, or delete tasks in assigned projects
- Update task statuses (To Do → In Progress → Done)

---

## ⚙️ Installation and Setup 
Follow these simple steps to set up and run the **Team Project Management API** locally. 
### 1. Clone the Repository
```
git clone https://github.com/pateljainil2204/team-project-management-api
cd team-project-management-api
```
### 2. Install Dependencies
```
npm install
```
### 3. Create File Inside the root directory, 
create a .env file and add the following environment variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
### 4. Run the Server
```
npm run dev
```
The API will start running at:
```
http://localhost:5000
```

## 🧪 Postman Collection (API Testing) 
You can test all API routes using the ready-made **Postman Collection**: 

🔗 **Postman Collection Link:**
```
https://pateljainil22-2328610.postman.co/workspace/JAINIL-PATEL's-Workspace~d608882a-766a-44c6-89e1-0d78fca8b51c/collection/48171917-30684921-e377-436c-bc6d-8a84240de15a?action=share&source=copy-link&creator=48171917
```
**Note:** 

- Ensure your local server is running (npm run dev) before testing. 
- Remember to include the **JWT token** as a **Bearer Token** in Postman for protected endpoints.

## 🧭 Workflow of Team Project Management

The workflow below explains how different users (Admins and Members) interact with the **Team Project Management API** step by step:

### 1. 👤 User Registration & Authentication
- New users register using their **name**, **email**, and **password**.  
- Passwords are securely hashed using **bcrypt**.  
- Upon successful login, users receive a **JWT token** for authentication.  
- This token must be included in the **Authorization header** for all protected API requests.

### 2. 🧑‍💼 Role Assignment
- Each user is assigned a role: **Admin** or **Member**.  
- **Admins** have full system control.  
- **Members** have limited access, restricted to projects they are assigned to.

### 3. 🗂️ Project Management (Admin)
- Admins create new projects by providing a **name** and **description**.  
- Admins can **update** project details or **delete** projects.  
- Deleting a project automatically removes all related tasks.  
- Admins can **assign or remove members** from any project.

### 4. 👥 Team Collaboration
- Once assigned, **Members** can view the projects they belong to.  
- Members cannot access unassigned projects, ensuring secure data access.  
- Each project serves as a workspace for managing related tasks.

### 5. 📝 Task Management (Members)
- Members can **create**, **update**, **view**, or **delete** tasks within their assigned projects.  
- Each task includes a **title**, **description**, and **status** (e.g., *To Do*, *In Progress*, *Done*).  
- Members can track progress by updating task statuses as work advances.

### 6. 🔐 Access Control & Security
- All endpoints are protected using **JWT tokens**.  
- Middleware ensures only authorized roles perform specific actions:
  - Admin-only routes for system management.
  - Member routes restricted to assigned projects.
- Sensitive data (like passwords) is never exposed or stored in plain text.

## 👨‍💻 Author

| Name | Contact | GitHub |
| :--- | :--- | :--- |
| **Jainil Patel** | pateljainil.2204@gmail.com | https://github.com/pateljainil2204 |