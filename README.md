# 💬 Chat App with File Upload – alu-test-front 

This project is a modern chat application built with **React**, **Vite**, **TypeScript**, and **HeroUI**, supporting **real-time messaging** and **file uploads** (.xlsx, .csv, .xls) integrated directly into the conversation. --- ## 🚀 Getting Started ### 1. Clone the repository
```bash
git clone https://github.com/your-username/alu-test-front.git
cd alu-test-front
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

- 🔧 Technologies Used 
- ⚛️ React 18 + TypeScript 
- ⚡ Vite 
- 🎨 TailwindCSS 
- 🎛 HeroUI (@heroui/react)
- 🔌 Socket.IO
- 🧹 ESLint + Prettier

### 🧠 Solution Summary 
- ✅ Real-time chat powered by socket.io-client
- ✅ Modal file upload component (UploadFile)
- ✅ Drag & drop + file format validation
- ✅ File preview before sending
- ✅ File metadata is posted in the chat as a message

### 💬 Example message after uploading a file:
📎 File uploaded: report.xlsx (82 KB)
    
### ⚠️ Known Limitations / Next Steps

- ❌ Files are not actually uploaded to a backend (only file metadata is displayed)
- 🧩 Uploaded files are not stored or downloadable
- 🔗 Future upgrade: use FormData to upload files and display download links
- 📁 Add support for PDFs, images, and other file types
- ⏳ Add upload progress or loading state (UI enhancement)

### 👨‍💻 Author

Built with ❤️ by Eng. Tony
