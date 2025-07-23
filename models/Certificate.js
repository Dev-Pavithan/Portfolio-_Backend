const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a certificate title']
  },
  image: {
    type: String,
    required: [true, 'Please upload the certificate image']
  },
  issuedBy: {
    type: String,
    required: [true, 'Please add who issued the certificate']
  },
  issuedDate: {
    type: Date,
    required: [true, 'Please add the issued date']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
