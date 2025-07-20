const mongoose = require('mongoose');
const Provider = require('../models/provider');
const Category = require('../models/category');
require('dotenv').config({ path: './config/config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localheroes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProviders = [
  {
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phoneNumber: '+1-555-0123',
    yearsOfExperience: '15',
    hourlyRate: '75',
    address: '123 Main Street, Downtown',
    bio: 'John has over 15 years of experience in residential and commercial plumbing. He specializes in leak detection, pipe replacement, and fixture installation. John is known for his punctuality and clean workmanship.',
    image: 'IMG-1751296579523.jpg', // Use an existing image from uploads
    rating: 4.9,
    reviews: 127,
    verified: true,
    isTopRated: true,
    certifications: ['Licensed Master Plumber', 'Water Conservation Specialist', 'Backflow Prevention Certified'],
    serviceAreas: ['Downtown', 'North Side', 'West End', 'East Side'],
    availability: 'Available Mon-Fri, 8AM-6PM',
    servicesOffered: [
      'Leak detection and repair',
      'Pipe installation and replacement',
      'Drain cleaning',
      'Water heater services',
      'Bathroom and kitchen fixture installation',
      'Sewer line repair'
    ]
  },
  {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phoneNumber: '+1-555-0124',
    yearsOfExperience: '8',
    hourlyRate: '60',
    address: '456 Oak Avenue, Suburbs',
    bio: 'Sarah leads a team of cleaning professionals with attention to detail and eco-friendly practices. She has worked with both residential and commercial clients for over 8 years.',
    image: 'IMG-1751296637561.jpg',
    rating: 4.8,
    reviews: 94,
    verified: true,
    isTopRated: true,
    certifications: ['Certified Cleaning Professional', 'Green Cleaning Specialist', 'OSHA Workplace Safety Certified'],
    serviceAreas: ['Downtown', 'Suburbs', 'West End', 'Central'],
    availability: 'Available 7 days a week, 8AM-8PM',
    servicesOffered: [
      'Regular maintenance cleaning',
      'Deep cleaning',
      'Move-in/move-out cleaning',
      'Spring cleaning',
      'Carpet cleaning',
      'Window cleaning'
    ]
  },
  {
    fullName: 'Mike Anderson',
    email: 'mike.anderson@example.com',
    phoneNumber: '+1-555-0125',
    yearsOfExperience: '12',
    hourlyRate: '85',
    address: '789 Pine Street, Industrial District',
    bio: 'Mike is a licensed master electrician with experience in residential, commercial, and industrial electrical systems. He specializes in troubleshooting complex electrical problems and home automation.',
    image: 'IMG-1751296670612.jpg',
    rating: 4.7,
    reviews: 78,
    verified: true,
    isTopRated: true,
    certifications: ['Licensed Master Electrician', 'Commercial Electrical Inspector', 'Smart Home Technology Specialist'],
    serviceAreas: ['North Side', 'East Side', 'Central', 'Industrial District'],
    availability: 'Available Mon-Sat, 7AM-7PM',
    servicesOffered: [
      'Panel upgrades',
      'Wiring installation and repair',
      'Lighting installation',
      'Outlet and switch replacement',
      'Home automation installation',
      'Electrical safety inspections'
    ]
  },
  {
    fullName: 'Jessica Lee',
    email: 'jessica.lee@example.com',
    phoneNumber: '+1-555-0126',
    yearsOfExperience: '10',
    hourlyRate: '70',
    address: '321 Elm Street, Arts District',
    bio: 'Jessica is a professional painter with a passion for transforming spaces. She specializes in interior and exterior painting, color consultation, and decorative finishes.',
    image: 'IMG-1751306789938.jpg',
    rating: 4.9,
    reviews: 112,
    verified: true,
    isTopRated: true,
    certifications: ['Certified Professional Painter', 'Color Consultant', 'Lead-Safe Certified'],
    serviceAreas: ['Downtown', 'Arts District', 'West End', 'Central'],
    availability: 'Available Mon-Fri, 7AM-6PM',
    servicesOffered: [
      'Interior painting',
      'Exterior painting',
      'Color consultation',
      'Cabinet refinishing',
      'Wallpaper installation',
      'Decorative finishes'
    ]
  }
];

const seedProviders = async () => {
  try {
    // First, get a category to assign to providers
    let category = await Category.findOne();
    if (!category) {
      console.log('No categories found. Please create categories first.');
      return;
    }

    // Clear existing providers
    await Provider.deleteMany({});
    console.log('Cleared existing providers');

    // Add category to each provider
    const providersWithCategory = sampleProviders.map(provider => ({
      ...provider,
      category: category._id
    }));

    // Insert new providers
    const insertedProviders = await Provider.insertMany(providersWithCategory);
    console.log(`Successfully seeded ${insertedProviders.length} providers`);

    // Display the seeded providers
    insertedProviders.forEach(provider => {
      console.log(`- ${provider.fullName} (${provider.category}) - Rating: ${provider.rating}`);
    });

  } catch (error) {
    console.error('Error seeding providers:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedProviders(); 