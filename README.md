# 🛒 Scatch – Full Stack E-Commerce Web Application

Scatch is a full-stack e-commerce web application built using Node.js, Express.js, MongoDB, and EJS. It provides a complete online shopping experience with user authentication, product management, order tracking, and real-time status updates.

---

## 🚀 Features

### 👤 User Features

* User registration and login (JWT authentication)
* Browse products with dynamic UI
* Add to cart and checkout system
* Secure payment integration using Stripe
* Order placement and tracking
* Real-time order status updates
* Email notifications:

  * Account creation
  * Order confirmation
  * Order status updates (Shipped, Delivered, etc.)

---

### 🧑‍💻 Admin Features

* Admin dashboard with analytics
* Add, edit, and delete products
* Manage product stock and pricing
* View all orders in structured format
* Update order status:

  * Pending
  * Shipped
  * Out for Delivery
  * Delivered
  * Cancelled
* Order timeline tracking

---

### ⚙️ Technical Features

* MVC architecture
* RESTful routing
* MongoDB schema design (Users, Products, Orders)
* Image handling using Base64 and API routes
* Secure environment variables using `.env`
* Email integration using Nodemailer
* Payment gateway integration using Stripe
* Flash messages for user feedback

---

## 🛠 Tech Stack

* **Frontend:** EJS, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT
* **Payment:** Stripe
* **Email Service:** Nodemailer
* **Version Control:** Git & GitHub
* **Deployment:** Render (recommended)

---

## 📂 Project Structure

```
SCATCH/
│── models/
│── routes/
│── controllers/
│── views/
│── public/
│── utils/
│── middlewares/
│── config/
│── app.js
│── package.json
```

---

## 🔐 Environment Variables

Create a `.env` file and add:

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_KEY=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

STRIPE_SECRET_KEY=your_stripe_key
```

---

## ▶️ Run Locally

```bash
git clone https://github.com/yourusername/scatch.git
cd scatch
npm install
npm start
```

---

## 🌐 Live Demo

👉 Coming Soon (after deployment)

---

## 📸 Screenshots

*Add screenshots of your project here (Home page, Admin panel, Orders, etc.)*

---

## 💡 Key Highlights

* Full order lifecycle system (Admin ↔ User sync)
* Real-time UI updates based on order status
* Email automation system for better user experience
* Secure authentication and payment integration
* Scalable and clean backend structure

---

## 📌 Future Improvements

* Cloud image storage (Cloudinary / AWS S3)
* Advanced search and filtering
* Product reviews and ratings
* Invoice PDF generation
* Admin analytics dashboard (charts)

---

## 🙌 Author

Developed by **Manju Natha**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
