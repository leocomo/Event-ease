# 🚀 EventEase Firebase Deployment Guide

This guide will walk you through deploying EventEase to Firebase Hosting with full Firebase integration.

## 📋 Prerequisites

- [Firebase Account](https://console.firebase.google.com/)
- [Node.js](https://nodejs.org/) (for Firebase CLI)
- Firebase CLI installed (`npm install -g firebase-tools`)

## 🔧 Step-by-Step Deployment

### Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name:** `eventease-app` (or your preferred name)
4. **Enable Google Analytics** (optional)
5. **Click "Create project"**

### Step 2: Enable Firebase Services

#### Authentication
1. **Go to Authentication → Sign-in method**
2. **Enable Email/Password**
3. **Save**

#### Firestore Database
1. **Go to Firestore Database**
2. **Click "Create database"**
3. **Start in test mode** (for development)
4. **Choose location** (closest to your users)
5. **Click "Done"**

#### Cloud Messaging (Optional)
1. **Go to Project Settings**
2. **Cloud Messaging tab**
3. **Generate Server Key** (for notifications)

### Step 3: Get Firebase Configuration

1. **Go to Project Settings** (gear icon)
2. **Scroll to "Your apps"**
3. **Click "Add app" → Web**
4. **Register app** with name "EventEase"
5. **Copy the config object**

### Step 4: Update Configuration

Replace the Firebase config in `script.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### Step 5: Initialize Firebase CLI

```bash
# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Select your project
# Public directory: .
# Single-page app: Yes
# Overwrite index.html: No
```

### Step 6: Update Authentication Logic

Replace the demo authentication in `script.js` with real Firebase Auth:

```javascript
// Replace handleLogin function
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentUser = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            role: currentRole
        };
        
        hideModal();
        showDashboard();
        loadEvents();
        showNotification('Login successful!', 'success');
    } catch (error) {
        showNotification('Login failed: ' + error.message, 'error');
    }
}

// Add signup function
async function handleSignup(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}
```

### Step 7: Update Event Management

Replace localStorage with Firestore:

```javascript
// Create event
async function handleCreateEvent(e) {
    e.preventDefault();
    
    const eventData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        createdBy: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        rsvps: []
    };
    
    try {
        const docRef = await db.collection('events').add(eventData);
        createEventForm.reset();
        loadEvents();
        showNotification('Event created successfully!', 'success');
    } catch (error) {
        showNotification('Failed to create event: ' + error.message, 'error');
    }
}

// Load events
async function loadEvents() {
    try {
        const snapshot = await db.collection('events').orderBy('date').get();
        events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        if (currentUser.role === 'admin') {
            displayAdminEvents();
        } else {
            displayUserEvents();
            loadUserRSVPs();
        }
    } catch (error) {
        showNotification('Failed to load events: ' + error.message, 'error');
    }
}
```

### Step 8: Deploy to Firebase

```bash
# Deploy to Firebase Hosting
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

## 🌐 Your Live Website

After deployment, your website will be available at:
```
https://your-project-id.web.app
```

## 🔧 Environment Setup

### Development
```bash
# Serve locally with Firebase
firebase serve

# Or use the Python server
python -m http.server 8000
```

### Production
```bash
# Deploy to production
firebase deploy
```

## 📱 Custom Domain (Optional)

1. **Go to Firebase Console → Hosting**
2. **Click "Add custom domain"**
3. **Enter your domain**
4. **Follow DNS setup instructions**

## 🔒 Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📊 Analytics (Optional)

1. **Go to Firebase Console → Analytics**
2. **Enable Google Analytics**
3. **Add tracking code to index.html**

## 🚀 Advanced Features

### Cloud Functions (Optional)
```bash
firebase init functions
```

### Real-time Database (Alternative)
```bash
firebase init database
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**
   - Check Firebase config in script.js
   - Ensure Firebase SDK is loaded

2. **"Permission denied"**
   - Check Firestore security rules
   - Verify authentication

3. **"Deploy failed"**
   - Check firebase.json configuration
   - Verify project selection

## 📞 Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

**Your EventEase app is now ready for production! 🎉** 