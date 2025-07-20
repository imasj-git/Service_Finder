const mongoose = require('mongoose');
const Category = require('../models/category');
require('dotenv').config({ path: './config/config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localheroes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleCategories = [
  {
    name: 'Plumbing',
    description: 'Professional plumbing services for residential and commercial properties',
    icon: '🔧'
  },
  {
    name: 'Cleaning',
    description: 'Comprehensive cleaning services for homes and offices',
    icon: '🧹'
  },
  {
    name: 'Electrical',
    description: 'Licensed electrical services and installations',
    icon: '⚡'
  },
  {
    name: 'Painting',
    description: 'Interior and exterior painting services',
    icon: '🎨'
  },
  {
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning services',
    icon: '❄️'
  },
  {
    name: 'Landscaping',
    description: 'Garden and landscape maintenance services',
    icon: '🌿'
  }
];

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const insertedCategories = await Category.insertMany(sampleCategories);
    console.log(`Successfully seeded ${insertedCategories.length} categories`);

    // Display the seeded categories
    insertedCategories.forEach(category => {
      console.log(`- ${category.name} ${category.icon}`);
    });

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedCategories(); 