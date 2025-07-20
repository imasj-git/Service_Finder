const asyncHandler = require('../middleware/async');
const Contact = require('../models/contact');

// @desc    Create new contact
// @route   POST /api/v1/contacts
// @access  Public
exports.createContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({
    success: true,
    data: contact,
  });
});

// @desc    Get all contacts
// @route   GET /api/v1/contacts
// @access  Private (Admin)
exports.getContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find();
  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

// @desc    Get single contact
// @route   GET /api/v1/contacts/:id
// @access  Private (Admin)
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: `Contact not found with id of ${req.params.id}` });
  }
  res.status(200).json({
    success: true,
    data: contact,
  });
});

// @desc    Delete contact
// @route   DELETE /api/v1/contacts/:id
// @access  Private (Admin)
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: `Contact not found with id of ${req.params.id}` });
  }
  res.status(200).json({
    success: true,
    message: 'Contact deleted successfully',
  });
}); 