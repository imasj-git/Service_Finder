const Service = require('../models/service');
const asyncHandler = require('../middleware/async');

// @desc    Create a new service
exports.createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

// @desc    Get all services
exports.getServices = asyncHandler(async (req, res) => {
  const services = await Service.find();
  res.status(200).json({ success: true, count: services.length, data: services });
});

// @desc    Get single service
exports.getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.status(200).json({ success: true, data: service });
});

// @desc    Update service
exports.updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.status(200).json({ success: true, data: service });
});

// @desc    Delete service
exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.status(200).json({ success: true, message: 'Service deleted' });
}); 