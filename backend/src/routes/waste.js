const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Waste = require('../models/Waste');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Configure multer for image uploads (memory storage for simplicity)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Validation for creating waste listing
const createWasteValidation = [
  body('type').notEmpty().withMessage('Waste type is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location').notEmpty().withMessage('Location is required'),
  body('description').optional()
];

// Create waste listing (Farmer only)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('farmer'),
  upload.single('image'),
  createWasteValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, quantity, price, location, description } = req.body;
      const image = req.file ? req.file.originalname : null; // In production, upload to cloud storage

      const waste = await Waste.create({
        farmer_id: req.user.id,
        type,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        location,
        image,
        description
      });

      res.status(201).json({
        message: 'Waste listing created successfully',
        listing: waste
      });
    } catch (error) {
      console.error('Create waste error:', error);
      res.status(500).json({ error: 'Failed to create waste listing' });
    }
  }
);

// Get all waste listings (with optional filters)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, type } = req.query;
    const filters = {};

    // Companies only see approved listings
    if (req.user.role === 'company') {
      filters.status = 'approved';
    } else if (status) {
      filters.status = status;
    }

    if (type) {
      filters.type = type;
    }

    const listings = await Waste.findAll(filters);
    res.json({ listings });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get farmer's own listings (must come before /:id route)
router.get('/my/listings', authMiddleware, roleMiddleware('farmer'), async (req, res) => {
  try {
    const listings = await Waste.findByFarmerId(req.user.id);
    res.json({ listings });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ error: 'Failed to fetch your listings' });
  }
});

// Get specific waste listing
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await Waste.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Companies can only view approved listings
    if (req.user.role === 'company' && listing.status !== 'approved') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// Update waste listing (Farmer can update own listing)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('farmer'),
  upload.single('image'),
  [
    body('type').optional().notEmpty().withMessage('Waste type cannot be empty'),
    body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('description').optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const listing = await Waste.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      // Check if the farmer owns this listing
      if (listing.farmer_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied: You can only update your own listings' });
      }

      const { type, quantity, price, location, description } = req.body;
      const updateData = {};

      if (type) updateData.type = type;
      if (quantity) updateData.quantity = parseFloat(quantity);
      if (price) updateData.price = parseFloat(price);
      if (location) updateData.location = location;
      if (description !== undefined) updateData.description = description;
      if (req.file) updateData.image = req.file.originalname;

      const updatedListing = await Waste.update(req.params.id, updateData);

      res.json({
        message: 'Listing updated successfully',
        listing: updatedListing
      });
    } catch (error) {
      console.error('Update listing error:', error);
      res.status(500).json({ error: 'Failed to update listing' });
    }
  }
);

// Update waste listing status (Admin only)
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin'),
  body('status').isIn(['approved', 'rejected', 'pending']).withMessage('Invalid status'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status } = req.body;
      const listing = await Waste.updateStatus(req.params.id, status, req.user.id);

      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      res.json({
        message: `Listing ${status} successfully`,
        listing
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ error: 'Failed to update listing status' });
    }
  }
);

// Delete waste listing (Farmer can delete own, Admin can delete any)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await Waste.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && listing.farmer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Waste.delete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;
