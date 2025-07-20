const express = require('express');
const { createContact, getContacts, getContact, deleteContact } = require('../controllers/contact');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(createContact)
  .get(protect, authorize('admin'), getContacts);

router.route('/:id')
  .get(protect, authorize('admin'), getContact)
  .delete(protect, authorize('admin'), deleteContact);

module.exports = router; 