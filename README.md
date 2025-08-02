# <a href="https://hask-ai.vercel.app" styles={text-decoration:none;color:white}><img width="30px" src="https://ik.imagekit.io/48vn2y3yn/Hask.png?updatedAt=1754120210758" />Hask AI</a>

Hask AI is an intelligent chatbot web application that integrates both **text-to-text** and **text-to-image** generation using the **Groq AI API** and **Hugging Face API**. Designed with modern full-stack architecture, it delivers secure user authentication, interactive chat experience, and dynamic image generation — all in one.

<center><a href="https://hask-ai.vercel.app"><img width="100px" src="https://ik.imagekit.io/48vn2y3yn/Hask.png?updatedAt=1754120210758" /></a></center><!-- Optional: replace with actual banner -->

---

## 🚀 Features

- 💬 **AI Chatbot** – Real-time intelligent responses using Groq’s LLM
- 🖼️ **Image Generator** – Converts text prompts into AI-generated images
- 🔐 **Secure Authentication** – Firebase Authentication for sign-up, login, and profile management
- 🌐 **Full-Stack MERN** – Built with React, Node.js, Express, and MongoDB
- 🎨 **Modern UI** – Responsive, user-friendly frontend with clean design

---

## 📸 Demo

> 🔗 Live Demo: [https://hask-ai.vercel.app](https://hask-ai.vercel.app)  
> 🔐 Test Login: `test@demo.com` / `password123`

---

## 🛠️ Tech Stack

| Frontend        | Backend        | APIs Used         | Auth             |
|-----------------|----------------|-------------------|------------------|
| React.js        | Node.js        | Groq AI (LLM)     |     |
| Tailwind CSS    | Express.js     | Hugging Face (T2I)|   JWT Auth    |
| Vite            | MongoDB        | Gemini (I2I)  |     |

---

## 📁 Project Structure

```bash
hask-ai-website/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js

## 🔐 Environment Variables

GROQ_API_KEY=your_groq_key
HUGGINGFACE_API_KEY=your_huggingface_token
MONGO_URI=your_mongodb_connection_string
PORT=5000

## 🧪 How to Run Locally

# 1. Clone the repo
git clone https://github.com/Hariprasath-2218/Hask-ai.git
cd hask-ai-website

# 2. Setup backend
cd backend
npm install
npm run dev

# 3. Setup frontend
cd ../frontend
npm install
npm run dev

## 🧠 Future Improvements

-🗂️ Add chat history with MongoDB

-🧠 Allow model selection (Groq, OpenAI, etc.)

-📸 Improve image generation fidelity and resolution

-🪪 Use JWT with Firebase for enhanced security

## 👨‍💻 Author


Made with ❤️ by Hariprasath G




