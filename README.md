# 💰 **Fintracx: Finance Dashboard (RBAC)**

Fintracx is a full-stack finance dashboard that enables users to manage financial records with role-based access control. It demonstrates backend architecture, data modeling, RBAC, and analytical APIs. It focuses on building a scalable backend system with clear separation of concerns, secure authentication, and efficient data aggregation.

---

## 🚀 **Features**

- JWT-based authentication  
- Role-based access control (Viewer, Analyst, Admin)  
- Financial record management (CRUD)  
- Filtering, search, and pagination  
- Date range filtering (startDate, endDate)  
- Dashboard analytics (income, expense, trends) 
- Graphical data visualizations (frontend)
- User management (Admin only)  
- Profile management  
- Soft delete for records  
- Rate limiting & security middleware  

---

## 👥 **Role Definitions**

### 👁️ Viewer
- Read-only access to dashboard and records  
- Cannot modify data  

### 📊 Analyst
- Can create and manage their own records  
- Access analytics  

### 🛠️ Admin
- Full system access  
- Manage users, roles, and all records  

---

## 🛠️ **Tech Stack**

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- express-validator  
- express-rate-limit  
- helmet  

### Frontend
- Next.js  
- React  
- Chart.js  
---
## 🤝 **Contributing** 
Contributions are welcome! If you’d like to improve feel free to fork the repo and submit a pull request.

### **Steps to Contribute:**

### **1. Fork the repository**

### **2. Create a new branch:**

```bash
git checkout -b feature-branch
```

### **3. Make your changes and commit:**

```bash
git commit -m "Added new feature"
```
### **4. Push to the branch:**

```bash
git push origin feature-branch
```
### **5. Open a Pull Request**




