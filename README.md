# Vertex | FinTech Compliance Dashboard

A professional compliance management platform for financial institutions.

---

### 🚀 Overview

**Vertex** is a comprehensive compliance management dashboard designed specifically for financial institutions. It streamlines regulatory compliance workflows, monitors KYC processes, handles AML investigations, and ensures audit readiness with a modern, intuitive interface.

---

### ✨ Key Features

* 📊 **Real-time Dashboard** - Live compliance metrics, KPI tracking, and performance analytics.
* 🔍 **KYC Workflows** - Streamlined Know Your Customer verification processes.
* 🚨 **AML Monitoring** - Anti-Money Laundering investigation tools and reporting.
* 📋 **Process Management** - Create, edit, and execute compliance workflows.
* 📈 **Progress Tracking** - Visual progress indicators and completion tracking.
* 🔐 **User Authentication** - Secure user management with role-based access.
* 📱 **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices.
* ⚡ **Modern Loading States** - Professional skeleton loaders and loading screens.

---

### 🛠️ Tech Stack

#### Frontend

* **React 18** with **TypeScript**
* **Vite** - Next generation frontend tooling
* **Tailwind CSS** - Utility-first CSS framework
* **shadcn/ui** - Modern component library
* **Wouter** - Minimalist routing
* **TanStack Query** - Data fetching and caching
* **Redux Toolkit** - State management
* **Framer Motion** - Smooth animations

#### Backend

* **Node.js** with **Express.js**
* **TypeScript** - End-to-end type safety
* **Drizzle ORM** - Type-safe database toolkit
* **PostgreSQL** - Primary database
* **Zod** - Runtime type validation

#### Development & Deployment

* **Replit** - Development environment
* **ESBuild** - Fast bundling
* **Hot Module Replacement** - Fast development iterations

---

### 🏃‍♂️ Quick Start

#### Prerequisites

* Node.js 18+ and npm
* PostgreSQL database (optional for development)

#### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/vertex-compliance-dashboard.git](https://github.com/yourusername/vertex-compliance-dashboard.git)
    cd vertex-compliance-dashboard
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Set up environment variables**
    ```bash
    # Create .env file in root directory
    DATABASE_URL=your_postgresql_connection_string
    NODE_ENV=development
    ```
4.  **Start the development server**
    ```bash
    npm run dev
    ```
5.  **Open your browser**
    Navigate to `http://localhost:5000`

#### Development Setup

The project runs both frontend and backend on a single port (5000) using Vite's proxy configuration for seamless development.

```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Run database migrations
npm run db:push
```

---

### 📁 Project Structure

```
vertex-compliance-dashboard/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts (Auth, Theme)
│   │   ├── lib/           # Utilities and configurations
│   │   └── assets/        # Static assets (images, icons)
├── server/                # Express.js backend
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage layer
│   └── index.ts           # Server entry point
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schema and types
└── package.json           # Project dependencies
```

---

### 🎯 Core Features

#### Dashboard Overview

* **KPI Metrics:** Total processes, active workflows, completion rates.
* **Real-time Charts:** Weekly task completion trends.
* **Recent Activity:** Live feed of compliance activities.
* **Quick Actions:** Fast access to common operations.

#### Process Management

* **Workflow Creation:** Design custom compliance processes.
* **Step-by-Step Execution:** Interactive workflow completion.
* **Progress Tracking:** Visual progress indicators.
* **Status Management:** Active, paused, completed states.

#### Compliance Workflows

* **KYC Verification:** Customer identity verification processes.
* **AML Investigation:** Anti-money laundering monitoring.
* **Regulatory Reporting:** Automated compliance reporting.
* **Audit Preparation:** Audit-ready documentation.

---

### 🚀 Deployment

#### Render Deployment

1.  **Create PostgreSQL Database**
    * Create a new PostgreSQL service on Render.
    * Note the connection string.
2.  **Deploy Backend**
    * **Build command:** `npm install && npm run build:server`
    * **Start command:** `node dist/server/index.js`
3.  **Deploy Frontend**
    * **Build command:** `npm install && npm run build`
    * **Publish directory:** `dist`
4.  **Environment Variables**
    ```
    DATABASE_URL=your_postgres_connection_string
    NODE_ENV=production
    VITE_API_URL=your_backend_url
    ```

#### Local Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

---

### 🎨 UI/UX Features

* **Modern Design System:** Consistent design language with shadcn/ui components.
* **Dark/Light Mode:** Theme switching capability.
* **Responsive Layout:** Mobile-first responsive design.
* **Loading States:** Professional skeleton loaders and spinners.
* **Accessibility:** WCAG compliant interface elements.
* **Smooth Animations:** Subtle animations for better user experience.

---

### 📊 Business Value

Vertex addresses real RegTech market needs:

* **Cost Reduction:** Automate manual compliance processes.
* **Risk Mitigation:** Ensure regulatory compliance and reduce fines.
* **Efficiency:** Streamline workflows for compliance teams.
* **Audit Readiness:** Maintain audit trails and documentation.
* **Scalability:** Handle growing compliance requirements.

---

### 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

#### Development Guidelines

* Follow TypeScript best practices.
* Use Tailwind CSS for styling.
* Write descriptive commit messages.
* Add tests for new features.
* Ensure responsive design.

---

### 📄 License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.

---

### 🙏 Acknowledgments

* **React Team** - For the amazing frontend framework.
* **Tailwind CSS** - For the utility-first CSS framework.
* **shadcn** - For the beautiful component library.
* **Replit** - For the excellent development platform.

---

### 📞 Support

For support and questions:

* Create an issue on GitHub.
* Contact: `[your-email@example.com]`
* Documentation: `[Link to docs if available]`

Built with ❤️ for the FinTech compliance community.

**Star ⭐ this repository if you found it helpful!**
