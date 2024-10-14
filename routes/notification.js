const express = require('express');
const router = express.Router();
const 
{
    createNotification, 
    getUserNotifications,
    markAsRead
} = require('../controller/notification');

// Create a new notification
router.post('/notifications', createNotification);

// Get all notifications for a specific user
router.get('/notifications/:userId', getUserNotifications);

// Mark a specific notification as read
router.post('/notifications/:id/read', markAsRead);

module.exports = router;
