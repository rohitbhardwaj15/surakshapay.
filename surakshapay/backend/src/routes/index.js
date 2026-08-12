// ═══════════════════════════════════════════════
// routes/auth.js
// ═══════════════════════════════════════════════
const express      = require('express');
const { body }     = require('express-validator');
const rateLimit    = require('express-rate-limit');
const { validate } = require('../middleware/errorHandler');
const authCtrl     = require('../controllers/authController');

const authRouter = express.Router();

// Stricter limiter just for login — protects against credential brute-forcing
// separately from the general /api/ limiter.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('platform').trim().notEmpty().withMessage('Platform is required'),
    body('weeklyIncome').isFloat({ min: 100 }).withMessage('Weekly income must be at least ₹100'),
    body('upiId').trim().notEmpty().withMessage('UPI ID is required'),
    body('hoursPerDay').optional().isFloat({ min: 1, max: 20 }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  authCtrl.register
);

authRouter.post('/login',
  loginLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('policyNumber').trim().notEmpty().withMessage('Policy number is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authCtrl.login
);

authRouter.post('/logout', authCtrl.logout);

// ═══════════════════════════════════════════════
// routes/users.js
// ═══════════════════════════════════════════════
const userRouter   = express.Router();
const { authenticate } = require('../middleware/auth');
const userCtrl     = require('../controllers/userController');

userRouter.get('/me',            authenticate, userCtrl.getMe);
userRouter.get('/me/dashboard',  authenticate, userCtrl.getDashboard);

// ═══════════════════════════════════════════════
// routes/policy.js
// ═══════════════════════════════════════════════
const policyRouter = express.Router();
const policyCtrl   = require('../controllers/policyController');

policyRouter.get('/',           authenticate, policyCtrl.getPolicy);
policyRouter.post('/activate',  authenticate, policyCtrl.activatePolicy);
policyRouter.post('/deactivate',authenticate, policyCtrl.deactivatePolicy);

// ═══════════════════════════════════════════════
// routes/triggers.js
// ═══════════════════════════════════════════════
const triggerRouter = express.Router();
const triggerCtrl   = require('../controllers/triggerController');

const VALID_TRIGGERS = ['Rain','AQI','Heatwave','Curfew','Flood','Cyclone','Dense Fog','Bandh'];

triggerRouter.get('/types', triggerCtrl.getTriggerTypes);

triggerRouter.post('/fire',
  authenticate,
  [
    body('triggerType')
      .trim().notEmpty().withMessage('Trigger type is required')
      .isIn(VALID_TRIGGERS).withMessage(`Must be one of: ${VALID_TRIGGERS.join(', ')}`),
  ],
  validate,
  triggerCtrl.fireTrigger
);

// ═══════════════════════════════════════════════
// routes/claims.js
// ═══════════════════════════════════════════════
const claimsRouter = express.Router();
const claimsCtrl   = require('../controllers/claimsController');

claimsRouter.get('/',     authenticate, claimsCtrl.getClaims);
claimsRouter.get('/:id',  authenticate, claimsCtrl.getClaimById);

// ═══════════════════════════════════════════════
// routes/admin.js
// ═══════════════════════════════════════════════
const adminRouter = express.Router();
const adminCtrl   = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// All admin routes now require a logged-in user with role === 'admin'.
// Previously these had NO auth at all — anyone could read business/fraud data.
adminRouter.get('/stats',         authenticate, requireAdmin, adminCtrl.getStats);
adminRouter.get('/fraud-alerts',  authenticate, requireAdmin, adminCtrl.getFraudAlerts);
adminRouter.get('/zone-risk',     authenticate, requireAdmin, adminCtrl.getZoneRisk);

// ═══════════════════════════════════════════════
// Export all routers
// ═══════════════════════════════════════════════
module.exports = {
  authRouter,
  userRouter,
  policyRouter,
  triggerRouter,
  claimsRouter,
  adminRouter,
};
