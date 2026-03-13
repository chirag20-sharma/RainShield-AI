require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/db');
// const { startTriggerJob } = require('./src/jobs/triggerJob');

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Start scheduled jobs
    // startTriggerJob();
    // console.log('✅ Scheduled jobs started');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 RainShield API listening on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

startServer();
