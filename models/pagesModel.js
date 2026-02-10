const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema(
  {
    pageId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    pageName: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    pageType: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'fa:FaRegFileCode',
    },
    path: {
      type: String,
      required: true,
    },
    children: [
      {
        pageName: { type: String, required: true },
        pageType: { type: String, required: true },       
        path: { type: String, required: true },
      }
    ],
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", PageSchema);
