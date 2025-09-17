const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const mentorProfileRoutes = require('./routes/mentorProfileRoutes');
const menteeProfileRoutes = require('./routes/menteeProfileRoutes');
const matchRoutes = require('./routes/matchRoutes');
const menteeNotificationRoutes = require('./routes/menteeNotificationRoutes');
const notificationRoutes = require('./routes/mentorNotificationRoutes');
const connectedMentorsRoutes = require('./routes/connectedMentorsRoutes');
const connectedStudentsRoutes = require('./routes/connectedStudentsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const upcomingClassesRoutes = require('./routes/upComingClassRoutes');
const menteeScheduledClassesRoutes = require('./routes/menteeScheduledClassesRoutes');

// ... other middleware and configurations

// Use routes

const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to our routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Routes


// Add this line where you're setting up your routes
app.use('/api/mentee', menteeScheduledClassesRoutes);
app.use('/api/upcoming-classes', upcomingClassesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mentor/profile', mentorProfileRoutes);
app.use('/api/mentee/profile', menteeProfileRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/connected-students', connectedStudentsRoutes);
app.use('/api/mentee-notifications', menteeNotificationRoutes);
app.use('/api/connected-mentors', connectedMentorsRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on('join-chat-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined chat room: ${roomId}`);
  });

  socket.on('leave-chat-room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left chat room: ${roomId}`);
  });

  // Video call related events (unchanged)
  socket.on('create-room', (roomId) => {
    socket.join(roomId);
    console.log(`Video call room created: ${roomId}`);
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected');
    console.log(`User joined video call room: ${roomId}`);
  });

  socket.on('offer', ({ offer, roomId }) => {
    socket.to(roomId).emit('offer', { offer });
  });

  socket.on('answer', ({ answer, roomId }) => {
    socket.to(roomId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('ice-candidate', { candidate });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('end-call', ({ roomId }) => {
    io.to(roomId).emit('call-ended');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


