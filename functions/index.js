// Firebase Cloud Function - Deploy with: firebase deploy --only functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gamesmanplay12@gmail.com',
        pass: 'your-app-password' // Generate from Google Account settings
    }
});

exports.sendCourseReminders = functions.pubsub
    .schedule('0 10 * * *')
    .timeZone('Asia/Kolkata')
    .onRun(async (context) => {
        const db = admin.firestore();
        const usersSnapshot = await db.collection('users').get();
        
        usersSnapshot.forEach(async (doc) => {
            const userData = doc.data();
            const completedLessons = ['completed_starting', 'completed_first', 'completed_second', 'completed_third', 'completed_fourth', 'completed_five']
                .filter(key => localStorage.getItem(key) === 'true').length;
            
            if (completedLessons > 0 && completedLessons < 6) {
                await transporter.sendMail({
                    from: 'MANMOON Learning <gamesmanplay12@gmail.com>',
                    to: userData.email,
                    subject: '🎓 Complete Your MANMOON Course!',
                    html: `<h2>Hi ${userData.name}!</h2><p>You've completed ${completedLessons}/6 lessons. Continue learning!</p><a href="https://your-domain.com/dashboard.html">Continue Learning</a>`
                });
            }
        });
        return null;
    });
