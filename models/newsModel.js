const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: false
  },
  public_id: {
    type: String,
    required: true
  },

});

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
       brief: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    media: {
      type: [mediaSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
  }
);


articleSchema.virtual("formattedDate").get(function () {
  return this.date
    ? this.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : null;
});

articleSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.date) {
      ret.date = new Date(ret.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    return ret;
  }
});

const newsModel = mongoose.model("new", articleSchema);

module.exports = newsModel;
