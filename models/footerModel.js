// models/Footer.js
const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // For ordering
  text: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true }
});

const columnSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  links: { type: [linkSchema], default: [] }
});

const socialLinkSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  platform: { type: String, required: true, trim: true }, // e.g., "facebook"
  url: { type: String, required: true, trim: true }
});

const footerSchema = new mongoose.Schema({
  logo: { type: String, default: null }, // URL or path
  public_id: { type: String, default: null }, // URL or path
  description: { type: String, default: '' },
  copyright: { type: String, default: '' },
  columns: { type: [columnSchema], default: [] },
  socialLinks: { type: [socialLinkSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Footer', footerSchema);
