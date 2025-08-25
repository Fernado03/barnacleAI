# 🚢 Barnacle-AI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.1.1-61dafb.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Development Status](https://img.shields.io/badge/status-Phase%201%20Complete-success)](https://github.com/)

**Barnacle-AI** is an advanced maritime analytics platform that leverages artificial intelligence and machine learning to address critical challenges in the shipping industry. Currently in active development with Phase 1 (Fleet Management) complete and additional features planned for future releases.

## 📚 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🧪 Test Users](#-test-users)
- [📋 Current Status](#-current-status)
- [🛠️ Technology Stack](#️-technology-stack)
- [📦 Key Features](#-key-features)
- [📖 API Documentation](#-api-documentation)
- [🏗️ Architecture](#️-architecture)
- [📄 License](#-license)

## 🚀 Quick Start

### ⚠️ **IMPORTANT: Train ML Model First**

**Before running the application, you MUST train the ML model first!** The biofouling prediction model (`.pkl` file) is not included in the repository due to its large size (443MB) and is excluded by `.gitignore`.

```bash
# 1. FIRST: Train the ML model (REQUIRED)
cd ml-models/models/biofouling
python train_advanced_biofouling_model.py
# This will generate the required best_biofouling_model.pkl file

# 2. Clone repository
git clone <repository>
cd barnacle-ai

# 3. Backend setup
cd barn-backend && npm install && npm start

# 4. Frontend setup (new terminal)
cd barn-frontend && npm install && npm run dev

# 5. Install Python ML dependencies
pip install numpy pandas scikit-learn
```

Access the application at `http://localhost:5173` and use any of the [test accounts](#-test-users) to login.

## 🧪 Test Users

Use these pre-configured test accounts to explore different user roles and features:

### 👑 **Administrator Account**

- **Email**: `admin@barnacle.com`
- **Password**: `admin123`
- **Name**: John Doe
- **Role**: Administrator
- **Access**: Full system access, user management, system configuration

### 🚢 **Ship Captain Account**

- **Email**: `captain@barnacle.com`
- **Password**: `captain123`
- **Name**: Sarah Wilson
- **Role**: Ship Captain
- **Access**: Individual vessel insights, captain dashboard

### ⚓ **Fleet Operator Account**

- **Email**: `operator@barnacle.com`
- **Password**: `operator123`
- **Name**: Mike Johnson
- **Role**: Fleet Operator
- **Access**: Fleet management, analytics dashboard

### 🎯 **Demo User Account**

- **Email**: `demo@barnacle.com`
- **Password**: `demo123`
- **Name**: Demo User
- **Role**: Demo User
- **Access**: Limited demo features, read-only access

### 🔄 **Quick Test Steps**

1. Start development server: `npm run dev`
2. Navigate to Login page
3. Use any test account credentials above
4. Explore role-based features and dashboards

## 📋 Current Status

### ✅ **Phase 2 - COMPLETE**

- **Fleet Operator Dashboard**: Fully functional comprehensive fleet analytics
- **User Authentication System**: Role-based access control with JWT
- **Real-time Data Integration**: Maritime API framework and data processing
- **Backend Infrastructure**: Complete REST API with MongoDB integration
- **ML Foundation**: Trained biofouling prediction model (Extra Trees algorithm)

### 🔄 **Phase 3 - IN DEVELOPMENT**

- **Captain Dashboard**: Individual vessel insights (UI complete, backend integration pending)
- **Marine Analytics Dashboard**: Environmental data visualization (UI complete, data integration pending)
- **ESG Dashboard**: Sustainability metrics tracking (UI complete, data pipeline pending)
- **Biofouling Predictor**: Advanced ML interface (functional with trained model)

### 📋 **Phase 4 - PLANNED**

- **Maintenance Scheduler**: Predictive maintenance planning
- **Route Optimizer**: AI-powered route planning
- **Real-time Data Dashboard**: Live maritime data feeds
- **Mobile Applications**: iOS and Android support

## 🛠️ Technology Stack

#### Frontend

- **React 19.1.1**: Modern UI library with server components
- **Vite 7.1.2**: Fast build tool and development server
- **Redux Toolkit**: State management with RTK Query
- **React Router 7.8.1**: Client-side routing
- **Tailwind CSS 4.1.12**: Utility-first CSS framework
- **TanStack Query**: Server state management
- **React Icons**: Comprehensive icon library
- **date-fns**: Modern date utility library

#### Backend

- **Node.js**: JavaScript runtime environment
- **Express 5.1.0**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **Bcrypt.js**: Password hashing library
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

#### Machine Learning (✅ Production Ready)

> **⚠️ CRITICAL**: You must run `python train_advanced_biofouling_model.py` first to generate the required `.pkl` model file before starting the application!

- **Python 3.x**: ML model development and execution
- **Scikit-learn**: Extra Trees regressor (primary model)
- **NumPy & Pandas**: Data processing and feature engineering
- **XGBoost & LightGBM**: Alternative models (trained and benchmarked)
- **Model Pipeline**: Node.js ↔ Python subprocess integration
- **Training Framework**: Automated model training with performance comparison
- **Feature Engineering**: 13 derived features from maritime environmental data
- **Production Deployment**: Trained model with 85%+ R² accuracy

#### **Data Sources Currently Active**

| Data Type              | Source             | Update Frequency | Implementation Status  |
| ---------------------- | ------------------ | ---------------- | ---------------------- |
| Fleet Data             | MongoDB + CSV      | 5 minutes        | ✅ **Complete**        |
| Vessel Tracking        | Dynamic Simulation | 30 seconds       | ✅ **Complete**        |
| Marine Weather         | Mock + Framework   | 3 minutes        | 🔄 **Framework Ready** |
| Ocean Currents         | Mock + Framework   | 10 minutes       | 🔄 **Framework Ready** |
| Environmental          | SEA Dataset        | 15 minutes       | ✅ **Complete**        |
| Biofouling Predictions | ML Model           | Real-time        | ✅ **Complete**        |

## 📦 Key Features

### 🏢 Fleet Management (✅ Complete)

- **Comprehensive Fleet Dashboard**: Real-time fleet overview with performance metrics
- **Vessel Tracking**: Individual vessel monitoring with status updates
- **Performance Analytics**: Fuel consumption, biofouling levels, maintenance alerts
- **Data Integration**: MongoDB integration with CSV data synchronization
- **Export Capabilities**: Data export in multiple formats (CSV, Excel, PDF)
- **Advanced Filtering**: Multi-criteria filtering by status, fouling levels, and more
- **ML Integration**: Live biofouling predictions with confidence scoring

### 🔐 Authentication System (✅ Complete)

- **Multi-role Access**: Administrator, Ship Captain, Fleet Operator, Demo User
- **JWT Security**: Secure token-based authentication with 7-day expiration
- **Protected Routes**: Frontend and backend route protection
- **User Management**: Registration, login, profile management, role promotion
- **Password Security**: Bcrypt hashing with validation

### 🤖 Machine Learning (✅ Core Complete)

- **Trained ML Model**: Extra Trees regression model for biofouling prediction
- **Python Integration**: Node.js to Python ML pipeline via subprocess
- **Feature Engineering**: 13 engineered features including environmental and operational factors
- **Real Predictions**: 95%+ confidence predictions using trained model
- **Fallback System**: Mock predictions when ML model unavailable
- **Model Performance**: R² score of 0.85+ on test data

### 🎯 Dashboard UIs (✅ Built, 🔄 Integration Pending)

- **Fleet Dashboard**: ✅ Fully functional with live data
- **Captain Dashboard**: ✅ UI complete, 🔄 backend integration needed
- **Marine Analytics**: ✅ UI complete with charts, 🔄 real data integration needed
- **ESG Dashboard**: ✅ UI complete with metrics, 🔄 data pipeline needed
- **Biofouling Analyzer**: ✅ Functional with trained ML model

## 📖 API Documentation

The Barnacle-AI API provides comprehensive endpoints for maritime data management, fleet operations, and ML predictions.

### 🔐 **Authentication** (`/api/auth`)

- User registration, login, logout, and profile management
- JWT-based authentication with 7-day token expiration
- Role-based access control (Administrator, Captain, Fleet Operator, Demo User)

### 🚢 **Fleet Management** (`/api/fleet`)

- Fleet data retrieval and vessel information
- Vessel status updates and maintenance scheduling
- Data evolution and synchronization endpoints
- Public endpoints for testing: `/evolve` and `/sync`

### 🤖 **Predictions & ML** (`/api/predictions`)

- Biofouling, fuel consumption, and maintenance predictions
- Real-time ML model predictions using trained models
- Route optimization and prediction history
- Model management and training endpoints

### 🌊 **Marine Data** (`/api/marine-data`)

- AIS data, weather information, and ocean currents
- Dynamic vessel tracking (start/stop tracking)
- Environmental data and tracking statistics
- Real-time maritime data integration

### 🌱 **ESG Metrics** (`/api/esg`)

- Environmental, social, and governance data
- Sustainability metrics and benchmarks
- ESG target management and report generation

### 📋 **Usage Notes**

- Most endpoints require JWT authentication via `Authorization: Bearer TOKEN`
- All responses follow standard JSON format with success/error indicators
- Test with provided [test accounts](#-test-users) for different access levels
- Base URL: `http://localhost:3000/api`

## 🏗️ Architecture

### **System Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 5173    │    │   Port: 3000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   ML Models     │
                       │   (Python)      │
                       │   Scikit-learn  │
                       └─────────────────┘
```

### **Data Flow**

1. **Frontend** (React + Vite) handles user interface and interactions
2. **Backend** (Node.js + Express) processes API requests and business logic
3. **Database** (MongoDB) stores fleet data, user information, and predictions
4. **ML Models** (Python) generate real-time biofouling and route predictions
5. **External APIs** provide real-time maritime data (weather, AIS, ocean currents)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Built with ❤️ for the maritime industry**

_Reducing biofouling, optimizing operations, and promoting sustainable shipping practices through AI and data analytics._
