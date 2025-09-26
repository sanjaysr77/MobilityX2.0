# MobilityX Backend

Backend API for the MobilityX hackathon project - a smart mobility and transportation recommendation system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TypeScript knowledge

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd mobility-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   PORT=3001
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run dev:all` - Run both frontend and backend concurrently
- `npm run clean` - Remove build directory

## 📁 Project Structure

```
mobility-backend/
├── controllers/          # Route handlers and business logic
│   ├── queryController.ts
│   ├── recommendController.ts
│   └── locationsController.ts
├── routes/              # Express route definitions
│   ├── query.ts
│   ├── recommend.ts
│   └── locations.ts
├── utils/               # Utility functions and clients
│   └── openaiClient.ts
├── types/               # TypeScript type definitions
│   └── index.d.ts
├── data/                # Mock data and static files
│   └── mockRoutes.json
├── dist/                # Compiled JavaScript (generated)
├── server.ts            # Main server file
├── package.json
├── tsconfig.json
└── .env.example
```

## 🛠 API Endpoints

### Health Check
- `GET /` - Basic server status
- `GET /health` - Detailed health information

### Query Processing
- `POST /query` - Parse natural language queries
- `GET /query/test` - Test endpoint

### Recommendations
- `POST /recommend` - Get route recommendations
- `GET /recommend/test` - Test endpoint

### Locations
- `GET /locations/search?q=query` - Search locations
- `GET /locations/:id` - Get location details
- `GET /locations/test` - Test endpoint

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for query processing | Optional* |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key for locations | Optional* |
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |

*Required for full functionality, but server will run with mock data if not provided.

## 🚧 Development Status

This is a hackathon scaffold with the following implementation status:

### ✅ Completed
- [x] Express server setup with TypeScript
- [x] Route structure and middleware
- [x] Mock data for Coimbatore routes
- [x] Basic error handling
- [x] OpenAI client wrapper
- [x] Type definitions

### 🚧 TODO (Implementation needed)
- [ ] OpenAI integration for query parsing
- [ ] Google Maps API integration
- [ ] Intelligent recommendation algorithm
- [ ] Real-time data integration
- [ ] User authentication
- [ ] Database integration
- [ ] Caching layer
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests

## 🤝 Contributing

This is a hackathon project. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

---

**Happy Hacking! 🚀**