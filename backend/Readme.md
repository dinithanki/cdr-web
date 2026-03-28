chinese-dragon-backend/
│
├─ config/                # Configuration files
│   └─ db.js              # MongoDB connection
│   └─ constants.js       # Any app-wide constants
│
├─ controllers/           # Handles the logic for each route
│   └─ userController.js
│   └─ menuItemController.js
│   └─ orderController.js
│   └─ reviewController.js
│   └─ contactController.js
│   └─ forumController.js
│
├─ middlewares/           # Middleware functions for requests
│   └─ authMiddleware.js  # Protect routes & verify users
│   └─ errorMiddleware.js # Handle errors globally
│
├─ models/                # MongoDB schemas (collections)
│   └─ User.js
│   └─ MenuItem.js
│   └─ Order.js
│   └─ OrderItem.js
│   └─ Review.js
│   └─ Contact.js
│   └─ ForumPost.js
│   └─ ForumComment.js
│
├─ routes/                # Define API endpoints
│   └─ userRoutes.js
│   └─ menuItemRoutes.js
│   └─ orderRoutes.js
│   └─ reviewRoutes.js
│   └─ contactRoutes.js
│   └─ forumRoutes.js
│
├─ utils/                 # Helper functions
│   └─ generateToken.js   # JWT token generator
│   └─ sendEmail.js       # Email sender (if needed)
│
├─ services/              # Optional: Business logic separate from controllers
│   └─ paymentService.js
│   └─ imageUploadService.js
│
├─ uploads/               # Folder to store uploaded files (like images)
│
├─ .env                   # Environment variables (DB URI, secrets)
├─ index.js               # Server entry point
├─ package.json           # Project dependencies & scripts
└─ README.md              # Project documentation