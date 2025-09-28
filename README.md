# Shopping Cart Frontend

A modern, responsive shopping cart frontend built with **Astro**, **React**, **TypeScript**, and **Tailwind CSS**. This application provides a comprehensive product management interface with real-time updates, form validation, and a beautiful user experience.

## 🚀 Features

- **Product Management**: Complete CRUD operations for products
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Form Validation**: Comprehensive client-side validation with Zod
- **State Management**: Zustand for efficient state management
- **Type Safety**: Full TypeScript support with strict typing
- **Real-time Updates**: Instant UI updates with optimistic updates
- **Error Handling**: User-friendly error messages and loading states
- **Testing**: Comprehensive test suite with Jest and React Testing Library
- **Accessibility**: WCAG compliant components with proper ARIA labels

## 🏗️ Architecture

### Frontend Stack
- **Astro**: Static site generator with React islands
- **React**: Component library for interactive UI elements
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Axios**: HTTP client for API communication

### Project Structure
```
src/
├── components/           # React components
│   ├── forms/           # Form components
│   ├── ui/              # Reusable UI components
│   └── ProductManagementApp.tsx
├── lib/                 # Utilities and configurations
│   ├── api.ts          # API client
│   ├── validations.ts  # Zod schemas
│   └── error-handler.ts
├── stores/             # Zustand stores
│   └── productStore.ts
├── types/              # TypeScript type definitions
│   └── api.ts
├── pages/              # Astro pages
│   └── index.astro
└── test/               # Test setup
    └── setup.ts
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Backend API** (NestJS backend running on port 3000)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FE-AstroJS
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PUBLIC_API_URL=http://localhost:3000/api/v1
   PUBLIC_APP_NAME=Shopping Cart
   PUBLIC_APP_VERSION=1.0.0
   ```

4. **Start the backend API**
   Make sure the NestJS backend is running on port 3000:
   ```bash
   # In the backend directory
   pnpm start:dev
   ```

## 🚀 Running the Application

### Development Mode
```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:4321`

### Production Build
```bash
pnpm build
# or
npm run build
```

### Preview Production Build
```bash
pnpm preview
# or
npm run preview
```

### Docker Development
```bash
# Build and run with Docker
docker build -f Dockerfile.dev -t shopping-cart-frontend .
docker run -p 4321:4321 shopping-cart-frontend
```

## 🧪 Testing

### Run All Tests
```bash
pnpm test
# or
npm test
```

### Run Tests with Coverage
```bash
pnpm test:coverage
# or
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
# or
npm run test:watch
```

### Test Coverage
The test suite provides comprehensive coverage for:
- **UI Components**: Input, Select, Modal, Textarea, Button
- **Form Validation**: Zod schema validation
- **Error Handling**: API error scenarios
- **State Management**: Zustand store operations

## 🎨 UI Components

### Form Components
- **ProductForm**: Complete product creation/editing form
- **Input**: Text input with validation
- **Select**: Dropdown selection with search
- **Textarea**: Multi-line text input
- **Button**: Styled button with loading states

### UI Components
- **Modal**: Accessible modal dialog
- **Alert**: Error and success message display
- **Loading**: Loading state indicators

### Features
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for theming
- **Accessibility**: WCAG 2.1 AA compliant
- **Form Validation**: Real-time validation feedback
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PUBLIC_API_URL` | Backend API URL | `http://localhost:3000/api/v1` |
| `PUBLIC_APP_NAME` | Application name | `Shopping Cart` |
| `PUBLIC_APP_VERSION` | Application version | `1.0.0` |

### API Integration

The frontend communicates with the NestJS backend through a custom API client:

```typescript
// API client configuration
const apiClient = new ApiClient({
  baseURL: import.meta.env.PUBLIC_API_URL,
  timeout: 10000,
});
```

## 📱 User Interface

### Product Management
- **Product List**: Display all products with search and filtering
- **Add Product**: Form to create new products
- **Edit Product**: In-place editing with validation
- **Delete Product**: Confirmation dialog with soft delete
- **Product Details**: Detailed view with all product information

### Form Features
- **Real-time Validation**: Instant feedback on form inputs
- **Required Field Indicators**: Asterisks (*) for mandatory fields
- **Error Messages**: Clear, actionable error messages
- **Loading States**: Visual feedback during API calls
- **Success Notifications**: Confirmation of successful operations

## 🛡️ Error Handling

### Client-side Validation
- **Zod Schemas**: Comprehensive validation rules
- **Form Validation**: Real-time input validation
- **Custom Messages**: User-friendly error messages

### API Error Handling
- **Network Errors**: Connection and timeout handling
- **Validation Errors**: Server-side validation feedback
- **Server Errors**: Graceful error message display
- **Loading States**: Visual feedback during operations

## 🚀 Deployment

### Static Site Deployment
```bash
pnpm build
# Deploy the ./dist folder to your hosting provider
```

### Docker Production Build
```bash
docker build -t shopping-cart-frontend .
docker run -p 4321:4321 shopping-cart-frontend
```

### Environment Setup for Production
1. Set `PUBLIC_API_URL` to your production backend URL
2. Configure your hosting provider
3. Set up CDN for static assets
4. Configure HTTPS and security headers

## 📝 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for components
- Follow React best practices and hooks

### Component Guidelines
- Use functional components with hooks
- Implement proper prop types
- Add accessibility attributes
- Write descriptive component names

### Testing Guidelines
- Write unit tests for components
- Test user interactions and form validation
- Mock API calls in tests
- Maintain high test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the component documentation
- Review the test files for usage examples

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete product management interface
- Comprehensive test suite
- Responsive design
- Form validation
- Error handling
- Docker support
