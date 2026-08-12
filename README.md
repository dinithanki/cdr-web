# 🍽️ Dragon Dine

### Full-Stack Restaurant E-Commerce Platform

> A modern full-stack restaurant e-commerce platform built with the MERN stack, providing customers with a responsive interface for browsing food items, managing their cart, and completing the ordering workflow.

## 🌐 Live Demo

### 👉 [Visit Dragon Dine](https://cdr-web-weld.vercel.app/)

---

## 📌 About the Project

**Dragon Dine** is a full-stack restaurant e-commerce web application developed using modern JavaScript technologies.

The project was built to provide a complete digital restaurant experience while demonstrating practical skills in **frontend development, backend API development, database management, authentication, state management, third-party API integration, and deployment**.

The application follows a client-server architecture where the React frontend communicates with a Node.js/Express backend through REST APIs, while MongoDB is used for persistent data storage.

---

## ✨ Key Features

* 🍔 Browse restaurant food/menu items
* 🔎 Product browsing and product details
* 🛒 Shopping cart management
* ➕ Add products to cart
* ➖ Update product quantities
* 🗑️ Remove products from cart
* 👤 User registration and authentication
* 🔐 Protected application functionality
* 📦 Order workflow
* 🖼️ Cloud-based image storage
* 📧 Email-related functionality
* 📱 Responsive user interface
* 🔗 RESTful API communication
* ☁️ Production deployment

---

# 🛠️ Technology Stack

### Frontend

* **React.js**
* **Vite**
* **Tailwind CSS**
* **Zustand**
* **JavaScript**

### Backend

* **Node.js**
* **Express.js**
* **REST APIs**
* **Mongoose**

### Database

* **MongoDB**
* **MongoDB Atlas**

### External Services

* **Supabase Storage** — Image and file storage
* **Brevo API** — Email-related functionality

### Development & Deployment

* **Git**
* **GitHub**
* **Vercel**

---

# ⭐ My Contributions

I developed Dragon Dine as a full-stack application and worked across the **frontend, backend, database, authentication, third-party integrations, and deployment**.

## 🎨 Frontend Development

* Developed the frontend using **React.js and Vite**.
* Built reusable and modular React components.
* Designed responsive user interfaces using **Tailwind CSS**.
* Developed dynamic restaurant menu and product interfaces.
* Implemented product browsing and product-detail functionality.
* Developed shopping cart interactions.
* Used **Zustand** for client-side state management.
* Integrated frontend components with backend REST APIs.
* Designed the application to provide a responsive experience across different screen sizes.

## ⚙️ Backend Development

* Developed the backend using **Node.js and Express.js**.
* Designed and implemented **RESTful APIs**.
* Organized backend routes and application logic into modular components.
* Implemented request validation and backend processing.
* Added error-handling mechanisms.
* Connected the backend application with MongoDB using **Mongoose**.
* Implemented API communication between the frontend and backend.

## 🗄️ Database Development

* Designed MongoDB data structures for application entities.
* Created **Mongoose schemas and models**.
* Implemented database operations for application data.
* Connected the application to **MongoDB Atlas**.
* Managed persistent product, user, and order-related data.

## 🔐 Authentication & Security

* Implemented user registration and login functionality.
* Added authentication handling for protected functionality.
* Implemented backend validation for user-related requests.
* Applied secure handling of authentication credentials.
* Separated authentication responsibilities between frontend and backend.

## 🖼️ Cloud Storage Integration

* Integrated **Supabase Storage** for product and application images.
* Connected stored image resources with application data.
* Used cloud storage instead of storing image files directly inside MongoDB.

## 📧 Third-Party API Integration

* Integrated the **Brevo API** for email-related functionality.
* Connected the backend application with an external third-party service.
* Managed external service configuration through environment variables.

## 🚀 Deployment & Version Control

* Used **Git and GitHub** for source-code management and version control.
* Maintained the project using a structured development workflow.
* Configured environment variables for sensitive configuration.
* Prepared the application for production deployment.
* Deployed the frontend application using **Vercel**.

---

# 🏗️ System Architecture

Dragon Dine follows a client-server architecture:

```text
                    ┌───────────────────┐
                    │       User        │
                    │     Browser       │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   React + Vite    │
                    │   Tailwind CSS    │
                    │      Zustand      │
                    └─────────┬─────────┘
                              │
                         REST APIs
                              │
                              ▼
                    ┌───────────────────┐
                    │ Node.js + Express │
                    │      Backend      │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             ┌─────────────┐    ┌─────────────────┐
             │   MongoDB   │    │ External Services│
             │    Atlas    │    │                 │
             └─────────────┘    │ Supabase        │
                                │ Brevo            │
                                └─────────────────┘
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
Browse Restaurant Menu
 │
 ▼
View Product
 │
 ▼
Add Product to Cart
 │
 ▼
Manage Cart
 │
 ▼
Checkout / Order Workflow
 │
 ▼
React Frontend
 │
 │ REST API
 ▼
Express.js Backend
 │
 ▼
MongoDB
```

---

# 📁 Project Structure

```text
cdr-web/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── assets/
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

> The exact folder structure may vary depending on the current implementation.

---

# ⚙️ Local Setup

## Prerequisites

Make sure the following are installed:

* [Node.js](https://nodejs.org/)
* npm
* Git
* MongoDB / MongoDB Atlas

You will also need the required credentials for the external services used by the application.

## 1. Clone the Project

```bash
git clone https://github.com/dinithanki/cdr-web.git
cd cdr-web
```

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

# 🔑 Environment Variables

Create the required `.env` files and configure the necessary environment variables.

Example backend configuration:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

BREVO_API_KEY=your_brevo_api_key
```

> **Never commit `.env` files, API keys, database credentials, JWT secrets, or other sensitive information to GitHub.**

---

# ▶️ Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

If a development script is not configured:

```bash
npm start
```

## Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will run through the Vite development server.

---

# ☁️ Deployment

The frontend is deployed using **Vercel**.

Production architecture:

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
React + Vite Frontend
   │
   │ REST API
   ▼
Node.js + Express Backend
   │
   ▼
MongoDB Atlas

External Services
├── Supabase Storage
└── Brevo API
```

---

# 🧠 Skills Demonstrated

This project demonstrates practical experience with:

* Full-Stack Web Development
* MERN Stack
* React.js
* JavaScript
* Vite
* Tailwind CSS
* Zustand
* Node.js
* Express.js
* REST API Development
* MongoDB
* Mongoose
* MongoDB Atlas
* Authentication
* API Integration
* Cloud Storage
* Third-Party API Integration
* Git & GitHub
* Responsive Web Design
* Vercel Deployment
* Environment Configuration

---

# 🔮 Future Improvements

Potential improvements for future versions include:

* 💳 Online payment gateway integration
* 📊 Restaurant administration dashboard
* 📍 Real-time order tracking
* ⭐ Product reviews and ratings
* 🎟️ Discount and coupon system
* 📈 Advanced analytics
* 🧪 Automated testing
* 🐳 Docker containerization
* 🔄 CI/CD pipeline
* 📊 Application monitoring and logging

---

# 👨‍💻 Author

**Dinith Pamunuwatte**

Software Engineering Undergraduate
University of Kelaniya, Sri Lanka

🌐 **Portfolio:**
https://dinith-pamunuwatte.vercel.app/

🌐 **Live Demo:**
https://cdr-web-weld.vercel.app/

---

# 📄 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for details.
