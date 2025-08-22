const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const { connectDB, disconnectDB } = require('../config/database');

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Policy.deleteMany({});
    await Claim.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@atlasinsurance.com',
      password: adminPassword,
      phone: '+1-555-0100',
      role: 'admin',
      emailVerified: true,
      phoneVerified: true,
      address: {
        street: '123 Insurance Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true
        },
        language: 'en',
        timezone: 'America/New_York'
      }
    });
    
    console.log('👑 Created admin user:', adminUser.email);
    
    // Create default agent user
    const agentPassword = await bcrypt.hash('agent123', 12);
    const agentUser = await User.create({
      firstName: 'John',
      lastName: 'Smith',
      email: 'agent@atlasinsurance.com',
      password: agentPassword,
      phone: '+1-555-0101',
      role: 'agent',
      emailVerified: true,
      phoneVerified: true,
      address: {
        street: '456 Agent Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'United States'
      },
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        language: 'en',
        timezone: 'America/Los_Angeles'
      }
    });
    
    console.log('👨‍💼 Created agent user:', agentUser.email);
    
    // Create default customer user
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customerUser = await User.create({
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'customer@atlasinsurance.com',
      password: customerPassword,
      phone: '+1-555-0102',
      role: 'customer',
      emailVerified: true,
      phoneVerified: true,
      dateOfBirth: new Date('1990-05-15'),
      address: {
        street: '789 Customer St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States'
      },
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: false
        },
        language: 'en',
        timezone: 'America/Chicago'
      }
    });
    
    console.log('👤 Created customer user:', customerUser.email);
    
    // Create sample policies
    const autoPolicy = await Policy.create({
      policyType: 'auto',
      status: 'active',
      customer: customerUser._id,
      agent: agentUser._id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      premium: {
        amount: 1200,
        frequency: 'monthly',
        nextDueDate: new Date('2024-12-01')
      },
      coverage: {
        limits: {
          liability: 50000,
          property: 25000,
          medical: 10000,
          uninsured: 25000
        },
        deductibles: {
          collision: 500,
          comprehensive: 250
        },
        features: [
          {
            name: 'Roadside Assistance',
            description: '24/7 roadside assistance coverage',
            additionalCost: 50
          },
          {
            name: 'Rental Car Coverage',
            description: 'Rental car reimbursement up to $30/day',
            additionalCost: 75
          }
        ]
      },
      insuredItems: [
        {
          type: 'vehicle',
          details: {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            vin: '1HGBH41JXMN109186',
            color: 'Silver'
          },
          value: 25000
        }
      ]
    });
    
    console.log('🚗 Created auto policy:', autoPolicy.policyNumber);
    
    const homePolicy = await Policy.create({
      policyType: 'home',
      status: 'active',
      customer: customerUser._id,
      agent: agentUser._id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      premium: {
        amount: 1800,
        frequency: 'annually',
        nextDueDate: new Date('2025-01-01')
      },
      coverage: {
        limits: {
          property: 300000,
          liability: 100000,
          medical: 5000
        },
        deductibles: {
          property: 1000
        },
        features: [
          {
            name: 'Identity Theft Protection',
            description: 'Identity theft coverage up to $25,000',
            additionalCost: 100
          }
        ]
      },
      insuredItems: [
        {
          type: 'property',
          details: {
            address: '789 Customer St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            yearBuilt: 1995,
            squareFootage: 2500
          },
          value: 350000
        }
      ]
    });
    
    console.log('🏠 Created home policy:', homePolicy.policyNumber);
    
    // Create sample claims
    const autoClaim = await Claim.create({
      policy: autoPolicy._id,
      customer: customerUser._id,
      agent: agentUser._id,
      type: 'auto',
      status: 'approved',
      priority: 'medium',
      incidentDate: new Date('2024-06-15'),
      description: 'Minor fender bender in parking lot. No injuries reported.',
      estimatedAmount: 2500,
      approvedAmount: 2300,
      paidAmount: 2300,
      deductible: 500,
      location: {
        address: '123 Main St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      },
      parties: [
        {
          name: 'Sarah Johnson',
          type: 'insured',
          contact: {
            phone: '+1-555-0102',
            email: 'customer@atlasinsurance.com'
          },
          statement: 'I was backing out of a parking spot when I hit another car.'
        }
      ]
    });
    
    console.log('📋 Created auto claim:', autoClaim.claimNumber);
    
    const homeClaim = await Claim.create({
      policy: homePolicy._id,
      customer: customerUser._id,
      agent: agentUser._id,
      type: 'home',
      status: 'investigating',
      priority: 'high',
      incidentDate: new Date('2024-07-20'),
      description: 'Water damage from burst pipe in basement.',
      estimatedAmount: 15000,
      deductible: 1000,
      location: {
        address: '789 Customer St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      },
      parties: [
        {
          name: 'Sarah Johnson',
          type: 'insured',
          contact: {
            phone: '+1-555-0102',
            email: 'customer@atlasinsurance.com'
          },
          statement: 'I discovered water damage in my basement after returning from vacation.'
        }
      ]
    });
    
    console.log('📋 Created home claim:', homeClaim.claimNumber);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Default Accounts:');
    console.log('👑 Admin: admin@atlasinsurance.com / admin123');
    console.log('👨‍💼 Agent: agent@atlasinsurance.com / agent123');
    console.log('👤 Customer: customer@atlasinsurance.com / customer123');
    console.log('\n📊 Sample Data Created:');
    console.log('- 3 Users (Admin, Agent, Customer)');
    console.log('- 2 Policies (Auto, Home)');
    console.log('- 2 Claims (Auto - Approved, Home - Investigating)');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await disconnectDB();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
