# ChowHub 🍽️

A comprehensive restaurant management system built with Next.js, designed to streamline restaurant operations from order management to analytics.

## 🌟 Features

### 📊 Dashboard & Analytics

- **Real-time Dashboard**: Live overview of restaurant performance with key metrics
- **Sales Analytics**: Comprehensive sales performance tracking by staff, peak hours, and menu items
- **AI-Powered Insights**: Claude AI integration for business intelligence and recommendations
- **Order Completion Time Analysis**: Track kitchen efficiency and service speed
- **Peak Hour Analysis**: Understand customer flow patterns and optimize staffing
- **Menu Performance Analytics**: Analyze item popularity, profitability, and trends
- **Inventory Performance**: Monitor stock levels and threshold alerts

### 👥 User Management

- **Role-based Access Control**: Manager and staff roles with different permissions
- **Employee Management**: Create, edit, and manage staff accounts
- **User Authentication**: Secure login system with email verification
- **Profile Management**: Update user information and settings

### 🍔 Menu Management

- **Menu Item Creation**: Add new dishes with variations and pricing
- **Category Management**: Organize menu items by categories
- **Ingredient Integration**: Link menu items to inventory ingredients
- **Spoonacular API Integration**: Search and import recipes from external database
- **Menu Performance Tracking**: Monitor best-selling items

### 📦 Inventory Management

- **Ingredient Tracking**: Monitor stock levels and quantities
- **Low Stock Alerts**: Automatic notifications when items fall below threshold
- **Supplier Management**: Maintain supplier contacts and relationships
- **Unit Management**: Support for various measurement units (kg, litre, piece, etc.)
- **Stock Level Analytics**: Track inventory performance over time

### 🛒 Order Management

- **Order Creation**: Staff can create orders for customers
- **Active Order Tracking**: Real-time view of pending orders with visual indicators
- **Order History**: Complete order tracking and history
- **Order Status Management**: Mark orders as fulfilled or cancelled
- **Order Analytics**: Track completion times and performance

### 🏪 Supplier Management

- **Supplier Database**: Maintain comprehensive supplier information
- **Contact Management**: Store supplier contact details and notes
- **Ingredient Mapping**: Link suppliers to specific ingredients they provide
- **Search & Filter**: Find suppliers quickly with advanced search

### 🔔 Notification System

- **Real-time Alerts**: Stock alerts, order notifications
- **Notification History**: View and manage past notifications
- **Email Notifications**: Automated email alerts for important events

### ⚙️ Restaurant Settings

- **Restaurant Profile**: Manage restaurant information and settings
- **Tax Rate Configuration**: Set and manage tax rates
- **Location Management**: Update restaurant address and contact info

## 👥 Team Members

| Name                               | GitHub                              | Role                               |
| ---------------------------------- | ----------------------------------- | ---------------------------------- |
| **Mostafa Hasanalipourshahrabadi** | https://github.com/most4f4          | Team Leader / Full Stack Developer |
| **Saad Ghori**                     | https://github.com/saadghori        | Full Stack Developer               |
| **Furkan Bas**                     | https://github.com/furkanbass       | Full Stack Developer               |
| **Lily Huang**                     | https://github.com/lilyhuang-github | Full Stack Developer               |

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.2** - React framework with server-side rendering
- **React 19.0.0** - Modern React with latest features
- **Bootstrap 5.3.6** - Responsive UI framework
- **React Bootstrap 2.10.10** - Bootstrap components for React
- **Chart.js 4.5.0** - Data visualization and charts
- **React Charts (Recharts)** - Additional charting library
- **React Icons 5.5.0** - Icon library
- **FontAwesome** - Additional icons

### State Management & Data

- **Jotai 2.12.4** - Atomic state management
- **React Toastify 11.0.5** - Toast notifications
- **JWT Decode 4.0.0** - JSON Web Token handling

### Development Tools

- **ESLint 9** - Code linting
- **Prettier 3.5.3** - Code formatting
- **dotenv 16.5.0** - Environment variable management

### External APIs

- **Spoonacular API** - Recipe and ingredient data
- **Claude AI API** - Business insights and analytics

## 🚀 Getting Started

**ChowHub is a web-based application that requires no local installation.**

### Public Access

Simply visit: **https://chowhub.vercel.app/**

The application is fully deployed and accessible through any modern web browser. No downloads, installations, or local setup required.

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled

## 🔐 Test Account Access

### Pre-configured Test Restaurant

- **Test Restaurant Account:**
  - **Username:** `test`
  - **Password:** `Test1234#`
  - **Role:** Manager (Full access to all features)

### Additional Test Staff Accounts

- **Staff Account 1:**
  - **Username:** `test1`
  - **Password:** `Test1234#`
  - **Role:** Staff (Limited access to ordering and basic functions)

### Creating Your Own Restaurant

1. Visit the registration page
2. Fill out restaurant and manager details
3. Check email for activation link
4. Set password and begin using the system

## 🚀 Local Installation & Run

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Spoonacular API key (for recipe integration)
- Claude AI API key (for AI insights)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/chowhub.git
   cd chowhub
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   Copy the example environment file and configure your variables:

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8080/api"
   NEXT_PUBLIC_SPOONACULARE_API_KEY="your_spoonacular_api_key"
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Backend Setup

This frontend requires a backend API. Make sure your backend server is running on the configured API URL (default: `http://localhost:8080/api`). Backend repository: https://github.com/most4f4/Chowhub_Backend.

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── DashboardLayout.js
│   ├── IngredientTable.js
│   ├── MenuItemTable.js
│   ├── SupplierTable.js
│   └── ...
├── pages/
│   └── [restaurantUsername]/
│       └── dashboard/
│           ├── index.js                    # Main dashboard
│           ├── ingredient-management/      # Inventory management
│           ├── menu-management/           # Menu and categories
│           ├── ordering/                  # Order system
│           ├── sales-analytics/           # Analytics and reports
│           ├── supplier-management/       # Supplier management
│           ├── user-management/           # Staff management
│           ├── restaurant-settings/       # Settings
│           └── notification-history/      # Notifications
├── store/               # Jotai state management
├── lib/                # Utility functions and API helpers
├── services/           # External service integrations
└── styles/             # CSS modules and global styles
```

## 🔐 Authentication & Authorization

The application uses role-based access control:

- **Managers**: Full access to all features including analytics, user management, and settings
- **Staff**: Limited access to ordering, inventory viewing, and basic operations

### Protected Routes

- All dashboard routes require authentication
- Manager-only routes are wrapped with `<ManagerOnly>` component
- User authentication is handled via JWT tokens stored in localStorage

## 📊 Analytics Features

### AI-Powered Insights

ChowHub integrates with Claude AI to provide:

- Sales performance analysis
- Staff efficiency recommendations
- Menu optimization suggestions
- Inventory management insights
- Operational improvements

### Chart Types

- **Line Charts**: Sales trends, completion times
- **Bar Charts**: Staff performance, peak hours
- **Pie/Doughnut Charts**: Revenue distribution, menu performance
- **Radar Charts**: Multi-dimensional performance comparison

## 🎨 UI/UX Design

### Dark Theme

- Modern dark color scheme optimized for restaurant environments
- High contrast for better readability
- Consistent color coding for different data types

### Responsive Design

- Mobile-first approach
- Responsive tables and charts
- Touch-friendly interface for tablet use

### Interactive Elements

- Hover effects and animations
- Real-time data updates
- Toast notifications for user feedback
- Loading states and error handling

## 🔧 Configuration

### Environment Variables

| Variable                           | Description                         | Required |
| ---------------------------------- | ----------------------------------- | -------- |
| `NEXT_PUBLIC_API_URL`              | Backend API endpoint                | Yes      |
| `NEXT_PUBLIC_SPOONACULARE_API_KEY` | Spoonacular API key for recipe data | Yes      |

### API Integration

The application expects a REST API with the following endpoints:

- `/auth/*` - Authentication endpoints
- `/users/*` - User management
- `/ingredients/*` - Inventory management
- `/menu-management/*` - Menu operations
- `/orders/*` - Order management
- `/analytics/*` - Analytics data
- `/suppliers/*` - Supplier management

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deployment Platforms

The application can be deployed on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 📈 Performance Optimizations

- **Next.js App Router**: Latest routing system for better performance
- **Server-Side Rendering**: Faster initial page loads
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Reduced bundle sizes
- **Lazy Loading**: Components loaded on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review existing issues for similar problems

## 🙏 Acknowledgments

- **Spoonacular API** for recipe and ingredient data
- **Anthropic Claude** for AI-powered insights
- **Chart.js** and **Recharts** for data visualization
- **Bootstrap** for responsive design components
- **Next.js** team for the excellent framework

---

**ChowHub** - Streamlining restaurant operations with modern technology 🚀
