const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./server/authRoutes');
const imageToUrlRouter = require('./api/tools/image-to-url');
const downloaderHandler = require('./api/tools/downloader');
const transcribeRouter = require('./api/tools/transcribe');
const qrCodeHandler = require('./api/tools/qr-code');
const textTranslatorHandler = require('./api/tools/text-translator');
const textCounterHandler = require('./api/tools/text-counter');
const colorConverterHandler = require('./api/tools/color-converter');

const app = express();

// CORS configuration for frontend domains
const allowedOrigins = [
  'https://amertak-tools.vercel.app',
  'https://tools-amertak.vercel.app',
  'https://www.amertak-tools.vercel.app',
  'https://www.tools-amertak.vercel.app',
  'https://amertak.tools',
  'https://www.amertak.tools',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cookieParser());

// Helper: wrap a plain async handler function into an Express Router
function wrapHandler(handlerFn) {
  const router = express.Router();
  router.all('/', (req, res) => handlerFn(req, res));
  return router;
}

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/tools/image-to-url', imageToUrlRouter);
app.use('/api/tools/downloader', wrapHandler(downloaderHandler));
app.use('/api/tools/transcribe', transcribeRouter);
app.use('/api/tools/qr-code', wrapHandler(qrCodeHandler));
app.use('/api/tools/text-translator', wrapHandler(textTranslatorHandler));
app.use('/api/tools/text-counter', wrapHandler(textCounterHandler));
app.use('/api/tools/color-converter', wrapHandler(colorConverterHandler));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Amertak Tools API Server listening on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
