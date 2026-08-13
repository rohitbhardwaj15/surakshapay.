require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');

const { connectDB }  = require('./utils/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const {
  authRouter,
  userRouter,
  policyRouter,
  triggerRouter,
  claimsRouter,
  adminRouter,
} = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Security middleware ─────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedInDev = ['http://localhost:5173', 'http://localhost:3000'];
    if (process.env.NODE_ENV !== 'production' && allowedInDev.includes(origin)) {
      return callback(null, true);
    }

    const allowedProdOrigins = [
      'https://surakshapay.vercel.app',
    ];
    const isSurakshapayVercelPreview = /^https:\/\/surakshapay-frontend(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);

    if (allowedProdOrigins.includes(origin) || isSurakshapayVercelPreview) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Rate limiting ───────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
}));

// ── Body parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status:    'ok',
    service:   'SurakshaPay API',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
    db:        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbName:    mongoose.connection.name || 'unknown',
  });
});

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/auth',     authRouter);
app.use('/api/users',    userRouter);
app.use('/api/policy',   policyRouter);
app.use('/api/triggers', triggerRouter);
app.use('/api/claims',   claimsRouter);
app.use('/api/admin',    adminRouter);

// ── Error handlers ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ────────────────────────────────────────────────
async function start() {
  await connectDB();               // Connect to MongoDB first

  app.listen(PORT, () => {
    console.log(`\n🛡️  SurakshaPay API running on http://localhost:${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV}`);
    // Never log the full connection string — it contains the DB password.
    console.log(`   MongoDB host: ${(process.env.MONGODB_URI || '').replace(/\/\/.*@/, '//<redacted>@')}`);
    console.log(`   Claims email: ${process.env.CLAIMS_EMAIL}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}

start();

module.exports = app;
