# 📱 PhoneStore – Frontend

A modern, responsive smartphone e-commerce website built with **React, TypeScript, Vite, and Tailwind CSS**. PhoneStore allows customers to browse smartphones, explore product details, manage shopping carts, place orders, upload payment proof, and track their purchases.

## 🚀 Features

### Customer Features
- Responsive and modern user interface.
- User registration and login.
- Browse and search smartphones.
- Filter products by brand, condition, and price.
- View detailed product information and images.
- Select phone variants such as color, storage, and RAM.
- Add products to shopping cart.
- Update quantities and remove cart items.
- Checkout and submit customer information.
- Upload payment proof.
- Track orders using order number and email.
- View personal order history.

### Admin Features
- Admin dashboard.
- Manage smartphone products.
- Create and edit product information.
- Manage product variants, prices, and stock.
- Upload product images and galleries.
- Manage customer orders.
- Verify payment submissions.
- Update order statuses.
- Manage customer accounts.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend library |
| TypeScript | Type safety |
| Vite | Development and build tool |
| Tailwind CSS | Styling and responsive design |
| React Router DOM | Application routing |
| Axios | Backend API communication |
| Zustand | State management |
| Lucide React | Icons |

## 📁 Project Structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── layout/
│   │   ├── product/
│   │   └── ui/
│   ├── pages/
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Home/
│   │   ├── Orders/
│   │   └── Products/
│   ├── store/
│   ├── types/
│   ├── lib/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_FRONTEND_GITHUB_URL
```

### 2. Navigate to the project

```bash
cd frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Make sure this variable name matches the API configuration in your Axios client.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## 🏗️ Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🔗 Backend Integration

The frontend communicates with the PhoneStore Django REST Framework backend through REST API endpoints.

Main API modules include:

- Authentication
- Product catalog
- Product brands
- Product variants
- Shopping orders
- Payment proof submissions
- Admin dashboard
- User management

See the backend repository for API implementation and configuration.

## 🔐 Environment Variables

Never commit private API keys, passwords, or sensitive environment configuration to GitHub.

Add `.env` to `.gitignore`.

## 👨‍💻 Developer

**PhoneStore E-commerce Project**

Frontend developed using React, TypeScript, and Tailwind CSS.

## 📄 License

This project is developed for educational and software development purposes.
