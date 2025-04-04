# 🔐 Vault Password Forge

**Vault Password Forge** is a secure and flexible password & passphrase generator built in **Rust** 🦀. It helps users generate strong credentials for different real-world scenarios like personal use, financial accounts, enterprise logins, and more — all while keeping **privacy and security** at the forefront.

> 🚀 **Built with Rust** for blazing performance and top-level security.

---

## ✨ Features

✅ **Smart Password Generator**: Customize password length, symbols, numbers, and more.  
✅ **Passphrase Generator**: Generate memorable, multi-word passphrases.  
✅ **Purpose-Based Modes**: Generate passwords for specific use cases:

- 🏦 Banking & Finance
- 📱 Social Media
- 💻 Developer Tools
- ✉️ Work & Email Accounts  
  ✅ **🔍 Breach Check (HIBP API)**: Check if a password has been exposed in known data breaches.  
  ✅ **🖥️ Modern UI (via frontend)**: Clean and minimal interface for ease of use.

---

## 🚀 Demo

🔗 **Live demo** (Coming soon...)

---

## 📦 Installation & Setup

### 📌 Prerequisites

- 🦀 [Rust](https://www.rust-lang.org/tools/install)
- ⚡ [Node.js & npm](https://nodejs.org/) – for frontend development

---

### 🔧 Backend (Rust)

```bash
# Clone the repo
git clone https://github.com/abhix2112/vault-password-forge.git
cd vault-password-forge

# Run the backend server
cargo run
```

### 🎨 Frontend (React/Vue/Other)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## 🔗 API Endpoints

| Endpoint        | Method | Description                               |
| --------------- | ------ | ----------------------------------------- |
| `/generate`     | GET    | Generate a secure password                |
| `/passphrase`   | GET    | Generate a memorable passphrase           |
| `/breach-check` | GET    | Check if password is in breached database |
| `/purpose-mode` | GET    | Generate password for specific purposes   |

📌 **Example Usage:**

```bash
/generate?length=16&symbols=true&numbers=true
```

📌 **Response:**

```json
{
  "password": "g7#T9@HqLr%X3pVb"
}
```

---

## 🎯 Purpose-Based Modes

Our **smart generator** includes purpose-based presets:

- 🏦 `banking` – Extra-long, highly secure passwords for financial accounts.
- 📩 `email` – Strong passwords suited for email security.
- 🎭 `social` – Balanced security for social media accounts.
- 💼 `work` – Enterprise-level secure passwords.
- 🛠️ `devtools` – Strong credentials tailored for developer tools.

---

## 🛣️ Roadmap

🔹 ✅ **Add password & passphrase generator**  
🔹 ✅ **Integrate HaveIBeenPwned API**  
🔹 🚧 **Build frontend with modern UI** _(In Progress)_  
🔹 🔜 **Add OAuth user login**  
🔹 🔜 **Deploy to production**  
🔹 🔜 **Develop a browser extension** _(Future Plan)_

---

## 🔒 Security

🔐 **Passwords are never stored or logged**.  
🚀 **API calls are rate-limited** for security.  
🛡️ **Fully stateless design** – secure and privacy-first.  
🦀 **Written in Rust** for maximum safety and performance.

---

## 📜 License

📄 **MIT License** – Feel free to fork, enhance, or contribute!

---

## 🤝 Contributing

Want to improve this project? PRs and issues are welcome! 💡

```bash
git clone https://github.com/abhix2112/vault-password-forge.git
```

---

## 📢 Connect

👨‍💻 **Follow me on [LinkedIn](https://linkedin.com/in/abhix2112) - Abhishek Aggarwal**  
⭐ **Drop a star on [GitHub](https://github.com/abhix2112/vault-password-forge) if you liked this project!**

🚀 Happy coding!
