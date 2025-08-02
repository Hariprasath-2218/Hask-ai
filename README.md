# <a href="https://hask-ai.vercel.app" styles={text-decoration:none;color:white}><img width="30px" src="https://ik.imagekit.io/48vn2y3yn/Hask.png?updatedAt=1754120210758" /> Hask AI</a>

Hask AI is an intelligent AI web application that integrates both **text-to-text** and **text-to-image** generation using the **Groq AI API** and **Hugging Face API** and for **image-to-image** generation using **Gemini AI API** . Designed with modern full-stack architecture, it delivers secure user authentication, interactive chat experience, and dynamic image generation — all in one.

<center><a href="https://hask-ai.vercel.app"><img width="100px" src="https://ik.imagekit.io/48vn2y3yn/Hask.png?updatedAt=1754120210758" /></a></center><!-- Optional: replace with actual banner -->

---

## 🚀 Features

- 💬 **AI Chatbot** – Real-time intelligent responses using Groq’s LLM
- 🖼️ **Image Generator** – Converts text prompts into AI-generated images and upload the images to modify that images using this AI
- 🔐 **Secure Authentication** – JWT Authentication for sign-up, login, and profile management
- 🌐 **Full-Stack MERN** – Built with React, Node.js, Express, and MongoDB
- 🎨 **Modern UI** – Responsive, user-friendly frontend with clean design

---

## 📸 Demo

> 🔗 Live Demo: [https://hask-ai.vercel.app](https://hask-ai.vercel.app)  
> 🔐 Test Login: `test@demo.com` / `password123`

---

## 🛠️ Tech Stack

| Frontend        | Backend        | APIs Used         | Models Used| Auth             |
|-----------------|----------------|-------------------|------------|------------------|
| React.js        | Node.js        | Groq AI (LLM)     | llama3-8b-8192    |
| Tailwind CSS    | Express.js     | Hugging Face (T2I)| black-forest-labs/flux-dev |  JWT Auth    |
| Vite            | MongoDB        | Gemini (I2I)  |  gemini-2.5-flash  |    |

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
```
## 🔐 Environment Variables

- GROQ_API_KEY=your_groq_key
- HUGGINGFACE_API_KEY=your_huggingface_token
- GEMINI_API_KEY=your_gemini_key
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key
- PORT=your_choice
- FRONTEND_URL=your_frontend_url (ex: http://localhost:3000 )

## 🧪 How to Run Locally

# 1. Clone the repo
```bash
git clone https://github.com/Hariprasath-2218/Hask-ai.git
cd hask-ai
```

# 2. Setup backend
```bash
cd backend
npm install
npm run dev
```

# 3. Setup frontend
```bash
cd ../frontend
npm install
npm run dev
```

## 🧠 Future Improvements

- 🗂️ Add chat history with MongoDB

- 🧠 Allow model selection (Groq, OpenAI, etc.)

- 📸 Improve image generation fidelity and resolution

- 🪪 Use JWT with Firebase for enhanced security

## 👨‍💻 Author


Made with ❤️ by Hariprasath G






