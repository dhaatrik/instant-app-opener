<div align="center">
  <img src="public/icon.png" alt="Instant App Opener Logo" width="128" />
  <h1>📱 Instant App Opener V2</h1>
  <p><strong>A lightning-fast, glassmorphic utility to convert standard web links into mobile app deep links.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![CI Status](https://img.shields.io/github/actions/workflow/status/dhaatrik/instant-app-opener/ci.yml?style=flat-square&logo=github)](https://github.com/dhaatrik/instant-app-opener/actions)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
</div>

<br />

## 📖 Table of Contents
- [1. Project Overview & Purpose](#1-project-overview--purpose)
- [2. Key Features](#2-key-features)
- [3. Technologies Used](#3-technologies-used)
- [4. Installation & Setup](#4-installation--setup)
- [5. Usage Instructions](#5-usage-instructions)
- [6. Testing Instructions](#6-testing-instructions)
- [7. Contribution Guidelines](#7-contribution-guidelines)
- [8. License](#8-license)

---

## 1. Project Overview & Purpose

**Instant App Opener** is a high-performance web application designed to instantly convert standard social media URLs into mobile-app-compatible URI schemes (deep links).

### ❗ The Problem
When users click on standard social media links (such as a YouTube video, a TikTok, or an X post) sent by friends, they are often frustratingly redirected to their mobile web browser rather than the native app. This degrades the user experience by forcing slow loads, unnecessary login prompts, and broken viewing experiences.

### 💡 The Solution
This application serves as a frictionless bridge. It automatically parses standard web URLs and generates appropriate deep links that bypass the browser, forcing the native application already installed on the user's device to open the content directly.

---

## 2. Key Features

- ⚡ **Instant Link Parsing:** Automatically detects platforms and validates URLs in real-time.
- 🔗 **Deep-Link Generation:** Safely constructs URIs guaranteed to launch the native app directly.
- 🎨 **Premium UI/UX:** A stunning dark glassmorphic design with satisfying micro-animations powered by Framer Motion.
- 📱 **Multi-Platform Supported:** Instantly handles links for YouTube, X (Twitter), LinkedIn, Instagram, Facebook, TikTok, and Spotify.
- 📤 **Native Sharing API:** Seamlessly integrates with mobile Web Share APIs for native sharing experiences.

---

## 3. Technologies Used

This project leverages a cutting-edge React ecosystem to ensure high code quality, typing strictness, and a flawless user experience.

| Category | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router & Standalone Export) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Motion](https://motion.dev/) (Framer Motion) |
| **Testing** | [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/) |
| **Icons & Media** | [Lucide React](https://lucide.dev/) & Canvas Confetti |

---

## 4. Installation & Setup

To run this project locally, ensure your environment meets the minimum requirements:
- **Node.js**: v20.x or higher
- **Package Manager**: npm (v9+ recommended)

### Step-by-step Setup:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhaatrik/instant-app-opener.git
   cd instant-app-opener
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:** Open your browser and navigate to `http://localhost:3000`.

---

## 5. Usage Instructions

Using Instant App Opener is straightforward and happens entirely client-side.

1. **Copy a Link:** Grab any standard URL from a supported platform (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`).
2. **Paste & Convert:** Paste the link into the central input field on the homepage. The app automatically detects the platform, validates the URL, and instantly displays a preview card alongside sharing tools.
3. **Open or Share:**
   - Click **Copy Link** (or use `Cmd/Ctrl + C`) to save the generated app deep link to your clipboard.
   - Click **Share** (or use `Cmd/Ctrl + S`) to trigger your device's native Web Share API to send the deep link directly to a friend.
   - Click **QR Code** to instantly generate a scannable QR code for desktop-to-mobile transfers.

---

## 6. Testing Instructions

This project maintains strict testing standards. We use **Vitest** for our test runner framework alongside **React Testing Library** for component validation. 

Run the test suite locally to verify code integrity:

```bash
# Run all tests once
npm run test

# Run tests in UI mode for visual debugging
npm run test -- --ui

# Verify code styling and formatting
npm run lint
```
*Note: We enforce a 100% pass rate. Pull requests with failing tests or lint errors will not be merged.*

---

## 7. Contribution Guidelines

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

This project operates under the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

**How to Contribute:**
1. Fork the Project.
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`.
3. Commit your Changes: `git commit -m 'Add some AmazingFeature'`.
4. Push to the Branch: `git push origin feature/AmazingFeature`.
5. Open a Pull Request from your branch to the main repository.

*Please ensure your code passes all tests (`npm run test`) and linter checks (`npm run lint`) prior to submitting the PR.*

---

## 8. License

Distributed under the **MIT License**. This allows anyone to freely use, modify, distribute, or sell the software, provided they include the original copyright and license notice.

See the `LICENSE` file for more detailed information.

<br />
<div align="center">
  <p><em>Copyright &copy; 2026 Dhaatrik Chowdhury</em></p>
</div>
