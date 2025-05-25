const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const Product = require('../models/Product');

// Configurer le stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage });

// Route POST : créer un produit
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, sessionId, price } = req.body;
  const image = req.file ? req.file.path : '';

  try {
    const product = await Product.create({
      title,
      description,
      sessionId,
      price,
      image,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET : récupérer les produits
router.get('/', async (req, res) => {
  const { sessionId } = req.query;
  try {
    const filter = sessionId ? { sessionId } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
