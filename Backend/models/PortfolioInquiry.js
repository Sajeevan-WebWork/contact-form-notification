const mongoose = require('mongoose');

const portfolioInquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  submittedAt: { type: Date, default: Date.now }
});

const PortfolioInquiry = mongoose.model('PortfolioInquiry', portfolioInquirySchema);
module.exports = PortfolioInquiry;
