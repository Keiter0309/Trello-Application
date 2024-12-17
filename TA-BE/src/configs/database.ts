import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration interface
interface DatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

// Get database URI from environment variables
const DATABASE_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/trelloapp';

class Database {
  private uri: string;
  private options: mongoose.ConnectOptions;

  constructor({ uri, options = {} }: DatabaseConfig) {
    this.uri = uri;
    this.options = {
      ...options
    };
  }

  async connect(): Promise<typeof mongoose> {
    try {
      const connection = await mongoose.connect(this.uri, this.options);
      console.log('✅ MongoDB connected successfully');
      return connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log('🔌 MongoDB disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  // Event listeners for connection states
  setupConnectionListeners(): void {
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to database');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🚫 Mongoose disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }
}

// Create database instance
const database = new Database({ 
  uri: DATABASE_URI 
});

// Export connection function
export const connectDatabase = async () => {
  await database.connect();
  database.setupConnectionListeners();
};

// Export additional utilities
export const disconnectDatabase = () => database.disconnect();