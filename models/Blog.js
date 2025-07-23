const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a blog title'],
    trim: true,
    maxlength: [200, 'Blog title cannot exceed 200 characters']
  },
  link: {
    type: String,
    trim: true,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ],
    required: [true, 'Please add a blog link']
  },
  date: {
    type: Date,
    required: [true, 'Please add a blog date']
  },
  image: {
    type: String,
    required: [true, 'Please upload a blog image']
  },
  source_name: {
    type: String,
    required: [true, 'Please add the source name'],
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Please add a blog excerpt'],
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', BlogSchema);
