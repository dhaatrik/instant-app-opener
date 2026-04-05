# 📱 Instant App Opener

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![CI Status](https://github.com/dhaatrik/instant-app-opener/actions/workflows/ci.yml/badge.svg)

## 📖 Overview

**Instant App Opener** is a modern, lightweight web application designed to seamlessly convert standard social media URLs into mobile-app-compatible URI schemes (deep links). 

**The Problem:** When users click standard social media links (like a YouTube video or X post) on their mobile devices, they are often frustratingly redirected to the mobile web browser instead of the native app. This degrades the user experience, forcing unnecessary logins and clunky navigation.

**The Solution:** This application instantly generates deep links that bypass the browser and force the native application to open. It provides a frictionless bridge between web sharing and native mobile consumption. 

Built with a focus on performance and UI/UX, the app features a premium dark glassmorphic theme and fluid animations, ensuring the link-generation process is as satisfying as it is functional.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Installation & Requirements](#-installation--requirements)
- [Usage Instructions](#-usage-instructions)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🛠 Tech Stack

This project leverages a modern React ecosystem for optimal performance and developer experience:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Standalone Export)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/) (Framer Motion)
- **Testing:** [Vitest](https://vitest.dev/) & React Testing Library
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript

---

## 🚀 Installation & Requirements

To run this project locally, ensure you have **Node.js (v20.x or higher)** installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhaatrik/instant-app-opener.git
   cd instant-app-opener


2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

4.  **View the app:** Open your browser and navigate to `http://localhost:3000`.

-----

## 💡 Usage Instructions

Using Instant App Opener is straightforward and requires no backend database:

1.  **Copy a Link:** Grab any standard URL from a supported platform (Currently supports: *YouTube, X/Twitter, LinkedIn, Instagram, Facebook*).
    > Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
2.  **Paste & Convert:** Paste the link into the central input field. The app automatically detects the platform, validates the URL, and generates a mobile-ready deep link.
3.  **Share or Copy:** - Click **Copy Link** (or use `Cmd/Ctrl + C`) to save the generated URL to your clipboard.
      - Click **Share** (or use `Cmd/Ctrl + S`) to trigger your device's native Web Share API for instant distribution.

-----

## 🧪 Testing

This project maintains high code quality through automated continuous integration (CI) via GitHub Actions.

The application uses **Vitest** and **React Testing Library** to test URL parsing logic, custom hooks, and component rendering without relying on a browser engine.

To run the test suite locally:

```bash
# Run tests once
npm test

# Run the linter to check for code formatting issues
npm run lint
```

-----

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Ensure your code passes all tests (`npm test`)
4.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
5.  Push to the Branch (`git push origin feature/AmazingFeature`)
6.  Open a Pull Request

For more detailed instructions, please read our [CONTRIBUTING.md](https://www.google.com/search?q=CONTRIBUTING.md).

-----

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

Copyright (c) 2026 Dhaatrik Chowdhury
