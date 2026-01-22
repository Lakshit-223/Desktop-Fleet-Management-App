

# Fleet Manager Pro 🚛️

A comprehensive desktop application for fleet and vehicle management, featuring offline capabilities, bilingual (English/Urdu) support, and financial tracking.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Distribution](#distribution)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

*   **Desktop Application:** Built with Electron for a seamless native Windows experience.
*   **Offline First:** Utilizes SQLite (`better-sqlite3`) for local data storage. No internet connection required.
*   **Bilingual Support:** Full English & Urdu language toggle with RTL (Right-to-Left) layout and Nastaliq fonts.
*   **Modules:**
    *   **Dashboard:** Real-time overview of expenses, trips, and fleet status.
    *   **Vehicle Management:** Register and track vehicle details (Plate number, Model, Purchase date).
    *   **Trip Management:** Log trips with origin, destination, purpose, and distance.
    *   **Diesel/Fuel Management:** Record fuel consumption, costs per liter, and station details.
    *   **Spare Parts Inventory:** Track parts, stock levels, and cost prices.
    *   **Cashbook:** Record income/expenses, payment modes (Cash/Online/Bank), and generate transaction logs.
*   **Printing:** Built-in print reports for every module (Invoices, History, Inventory lists).
*   **Data Persistence:** All data is stored locally in a local SQLite database file.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19.2.3 + TypeScript
*   **UI Framework:** Electron 28.3.0
*   **Database:** SQLite via `better-sqlite3` (Native Node.js binding)
*   **Bundler:** Webpack 5
*   **Styles:** CSS3 (No external UI libraries used for custom styling)

---

## 📂 Project Structure

```text
fleet-manager-app/
├── src/
│   ├── main/                # Electron Main Process (Backend)
│   │   ├── index.ts        # Entry point, window creation
│   │   ├── database.ts     # SQLite table definitions & queries
│   │   └── ipc.ts          # Inter-Process Communication handlers
│   ├── preload/              # Secure Bridge
│   │   └── index.ts        # Exposes APIs to renderer
│   └── renderer/             # React Frontend (UI)
│       ├── App.tsx         # Main layout & routing
│       ├── LanguageContext.tsx # Language State (English/Urdu)
│       ├── translations.ts   # Dictionary for all UI text
│       ├── components/       # Feature components
│       │   ├── Dashboard.tsx
│       │   ├── Vehicles.tsx
│       │   ├── Trips.tsx
│       │   ├── Diesel.tsx
│       │   ├── Transactions.tsx
│       │   └── SpareParts.tsx
│       ├── index.tsx         # React Render entry
│       └── styles/
│           └── App.css      # Global Styles & RTL support
├── dist/                    # Compiled JS output (Webpack)
├── dist-installer/           # Windows Installer (NSIS)
├── package.json             # Dependencies & Scripts
├── tsconfig.json           # TypeScript Config
└── webpack.config.js       # Build Configuration
```

---

## ⚙️ Prerequisites

1.  **Node.js:** Version 20 or higher (Electron 28.3.0 uses Node v20).
    *   *Note:* If using Node v22, ensure Electron version is compatible or native modules are rebuilt.
2.  **Package Manager:** npm (or pnpm).
3.  **Windows Build Tools (Optional):** Required if you need to manually compile `better-sqlite3`. Pre-built binaries are used by default for version 9.0.0.
4.  **Fonts:** `Noto Nastaliq Urdu` is loaded via Google Fonts for Urdu support.

---

## 🛠️ Installation & Setup

### For Developers (Running from Source)

1.  **Clone/Download** the project folder.
2.  **Open** PowerShell/Terminal in the project root.
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *   *Note:* This installs React, Electron, TypeScript, and `better-sqlite3`.
4.  **Run the Application:**
    ```bash
    npm start
    ```
    *   This command performs two steps:
        1.  Runs `webpack` to bundle React.
        2.  Runs `tsc` to compile the Main process.
        3.  Starts Electron.

### For End Users (Installing the App)

To distribute the app as an executable with a desktop shortcut:

1.  **Build the Installer:**
    ```bash
    npm run dist
    ```
2.  **Locate Installer:**
    *   Go to the `dist-installer` folder created.
    *   Find `Fleet Manager Pro Setup 1.0.0.exe`.
3.  **Install:**
    *   Double-click the `Setup.exe`.
    *   Follow the installation wizard.
    *   A shortcut named **"Fleet Manager Pro"** will be automatically added to your Desktop.

---

## 📘 Usage Guide

### 1. Language Toggle (English/Urdu)
*   Locate the language button at the top of the Sidebar.
*   Click **"اردو (Urdu)"** to switch to Urdu.
*   Click **"English"** to switch back.
*   **Effect:** The entire interface (Text direction, Fonts, Labels) updates instantly.

### 2. Modules Breakdown
*   **Dashboard:** View total vehicle count, total trips, expenses vs income, and cash balance.
*   **Vehicles:**
    *   Click **"Add New Vehicle"**.
    *   Enter details (Name, Plate Number, Model).
    *   **Urdu Input:** When in Urdu mode, input fields accept Nastaliq script text.
*   **Trips:**
    *   Log a new trip by selecting a vehicle and entering Origin/Destination.
    *   History shows detailed list of past trips.
*   **Diesel:**
    *   Record fuel fills. The total cost is calculated automatically based on `Liters * Price`.
    *   Odometer readings help track fuel efficiency.
*   **Spare Parts:**
    *   Manage inventory.
    *   The system highlights **"Low Stock"** if quantity falls below the set minimum level.
*   **Transactions:**
    *   Record Income/Expense.
    *   Categories: Fuel, Maintenance, Salary, etc.
    *   Payment Modes: Cash, Online Transaction, Bank Transfer.

### 3. Printing
*   Every module has a **"Print Report"** button in the top-right corner of the list view.
*   Clicking this opens the Windows Print dialog.
*   The CSS includes a `@media print` block that automatically hides the sidebar and buttons to produce a clean report.

---

## 📤 Distribution

### Sharing the Installer
1.  Run `npm run dist`.
2.  Zip the contents of the `dist-installer` folder.
3.  Send/upload `Fleet Manager Pro Setup 1.0.0.exe`.
4.  Users simply download and run it.

### Updating the Shortcut
If you update the code and create a new installer:
1.  Run `npm run dist` again.
2.  The generated installer will overwrite the old installation.
3.  (Optional) Uninstall the old version before installing the new one to prevent duplicate icons.

---

## 🐛 Troubleshooting

### 1. Error: "The module... was compiled against a different Node.js version"
*   **Cause:** The version of `better-sqlite3` in `node_modules` was compiled for your system's Node.js (e.g., v22), but Electron uses a different internal Node version (e.g., v20).
*   **Solution:**
    1.  Ensure you are using `better-sqlite3` version `^9.0.0` (Stable).
    2.  Delete `node_modules` folder and run `npm install`.
    3.  Ensure you have a `.npmrc` file with `runtime=electron` if manually targeting Electron builds.

### 2. Error: "Webpack is not recognized"
*   **Cause:** `npm install` failed or wasn't run.
*   **Solution:** Run `npm install`.

### 3. Error: "Cannot find module './translations'"
*   **Cause:** Typo in import path or filename mismatch (`translation.ts` vs `translations.ts`).
*   **Solution:** Check `src/renderer/LanguageContext.tsx` import path. It must match the filename exactly.

### 4. Error: "Preload script not found" or Blank White Screen
*   **Cause:** Webpack `clean: true` deleted the `preload` folder, or `preload/index.ts` is missing.
*   **Solution:**
    1.  Ensure `src/preload/index.ts` exists.
    2.  Run `npm run build`.
    3.  Check `dist/preload/index.js` was created.

### 5. Where is my Database data?
*   **Location:** `C:\Users\<YourUser>\AppData\Roaming\fleet-manager-app\fleet.db`
*   **Backup:** To backup your data, simply copy the `fleet.db` file found in that folder.

---

## 📄 License

ISC