# 📱 Instant App Opener V2

<div align="center">
  <img src="public/icon.png" alt="Instant App Opener Logo" width="128" />
</div>

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![CI Status](https://github.com/dhaatrik/instant-app-opener/actions/workflows/ci.yml/badge.svg)

## 1. Project Title & Description

**Instant App Opener** is a high-performance web application designed to instantly convert standard social media URLs into mobile-app-compatible URI schemes (deep links). 

**The Problem:** When mobile users click on standard social media links (such as a YouTube video or an X post) sent by friends, they are often frustratingly redirected to their mobile web browser rather than the native app. This degrades the user experience by forcing slow loads, unnecessary login prompts, and clunky navigation.

**The Solution:** This application serves as a frictionless bridge. It automatically parses standard web URLs and generates appropriate deep links that bypass the browser, forcing the native application installed on the user's device to open the content directly.

**Why these technologies?**
Built with Next.js and React 19 for optimal server-side and client-side performance, the app features a premium dark glassmorphic UI utilizing Tailwind CSS v4. Framer Motion is heavily integrated to provide fluid, engaging micro-animations that ensure the URL-generation process feels satisfying, instantaneous, and premium.

---

## 2. Table of Contents

- [Project Title & Description](#1-project-title--description)
- [Installation & Requirements](#3-installation--requirements)
- [Usage Instructions & Examples](#4-usage-instructions--examples)
- [Technologies Used (Tech Stack)](#5-technologies-used-tech-stack)
- [Contribution Guidelines](#6-contribution-guidelines)
- [Testing Instructions](#7-testing-instructions)
- [License Information](#8-license-information)

---

## 3. Installation & Requirements

To run this project locally, ensure your environment meets the minimum requirements:
- **Node.js**: v20.x or higher
- **Package Manager**: npm (v9+ recommended)

**Step-by-step Setup:**

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

## 4. Usage Instructions & Examples

Using Instant App Opener is straightforward and requires no backend processing.

1. **Copy a Link:** Grab any standard URL from a supported platform.
   *Currently supported platforms: YouTube, X (Twitter), LinkedIn, Instagram, Facebook, TikTok, Spotify.*
   
   **Example Input:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

2. **Paste & Convert:** Paste the link into the central input field on the homepage. The app automatically detects the platform, validates the URL, and instantly displays a preview card alongside sharing tools.

3. **Open or Share:** 
   - Click **Copy Link** (or use `Cmd/Ctrl + C`) to save the generated app deep link to your clipboard.
   - Click **Share** (or use `Cmd/Ctrl + S`) to trigger your device's native Web Share API to send the deep-link directly to a friend.
   - Click the **QR Code** button to generate a scannable QR code for the link.

---

## 5. Technologies Used (Tech Stack)

This project leverages a cutting-edge React ecosystem to ensure high code quality, typing strictness, and a flawless user experience.

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Standalone Export)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/) (formerly Framer Motion)
- **Testing:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)
- **Icons & Graphics:** [Lucide React](https://lucide.dev/) & Canvas Confetti
- **Parsing:** Cheerio (for rich metadata extraction)

---

## 6. Contribution Guidelines

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

This project and everyone participating in it operates under the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

**How to Contribute:**
1. Fork the Project by clicking the 'Fork' button on GitHub.
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
3. Ensure your code passes all tests: `npm test`
4. Commit your Changes: `git commit -m 'Add some AmazingFeature'`
5. Push to the Branch: `git push origin feature/AmazingFeature`
6. Open a Pull Request from your branch to the main repository.

If you find bugs or have feature requests, please use the GitHub Issues page first before submitting an unauthorized Pull Request.

---

## 7. Testing Instructions

This project maintains strict testing standards through automated continuous integration (CI) via GitHub Actions. We use **Vitest** for our test runner framework alongside **React Testing Library** for component validation.

To run the test suite locally and verify your changes:

```bash
# Run all tests once
npm run test

# Run tests in UI mode for visual debugging
npm run test -- --ui

# Run the linter to verify code formatting issues
npm run lint
```
*Note: We enforce a 100% pass rate. Pull requests with failing tests will not be merged.*

---

## 8. License Information

Distributed under the **MIT License**. This allows anyone to use, modify, distribute, or sell the software, provided they include the original copyright and license notice in any copy of the software or substantial portion of it. 

See the `LICENSE` file for more detailed information.

---

*Copyright (c) 2026 Dhaatrik Chowdhury*
