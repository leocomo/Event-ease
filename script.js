// Firebase Configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBw45ea4a68yQemCHtec-cm4bOWGKiGl9Y",
  authDomain: "event-ease-47871.firebaseapp.com",
  projectId: "event-ease-47871",
  storageBucket: "event-ease-47871.appspot.com",
  messagingSenderId: "909413185641",
  appId: "1:909413185641:web:bbb62c48cca0e1202b0af8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const messaging = firebase.messaging();

// Global Variables
let currentUser = null;
let currentRole = 'user';
let events = [];
let userRSVPs = [];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close');
const roleBtns = document.querySelectorAll('.role-btn');
const getStartedBtn = document.getElementById('getStartedBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const adminDashboard = document.getElementById('adminDashboard');
const userDashboard = document.getElementById('userDashboard');
const createEventForm = document.getElementById('createEventForm');
const adminEventsList = document.getElementById('adminEventsList');
const userEventsList = document.getElementById('userEventsList');
const userRSVPsList = document.getElementById('userRSVPsList');
const notificationToast = document.getElementById('notificationToast');
const toastMessage = document.getElementById('toastMessage');
// Auth forms
const showLoginBtn = document.getElementById('showLogin');
const showRegisterBtn = document.getElementById('showRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

showLoginBtn.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  showLoginBtn.classList.add('btn-primary');
  showRegisterBtn.classList.remove('btn-primary');
});

showRegisterBtn.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  showRegisterBtn.classList.add('btn-primary');
  showLoginBtn.classList.remove('btn-primary');
});

// Register handler
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    currentUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: currentRole
    };
    hideModal();
    showDashboard();
    loadEvents();
    showNotification('Account created and logged in!', 'success');
  } catch (error) {
    showNotification('Signup failed: ' + error.message, 'error');
  }
});

// Login handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
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
});

// Event Listeners
loginBtn.addEventListener('click', () => showModal());
closeModal.addEventListener('click', () => hideModal());
getStartedBtn.addEventListener('click', () => showModal());

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        hideModal();
    }
});

roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRole = btn.dataset.role;
    });
});

// Modal Functions
function showModal() {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Authentication Functions
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showWelcomeScreen();
    showNotification('Logged out successfully', 'success');
}

// Dashboard Functions
function showDashboard() {
    welcomeScreen.classList.add('hidden');
    
    if (currentUser.role === 'admin') {
        adminDashboard.classList.remove('hidden');
        userDashboard.classList.add('hidden');
    } else {
        userDashboard.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
    }
    
    // Update navigation
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
}

function showWelcomeScreen() {
    welcomeScreen.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    userDashboard.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
}

// Event Management Functions
async function handleCreateEvent(e) { 
    console.log("currentUser:", currentUser);
    e.preventDefault();

    const eventData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        rsvps: []
    };

    try {
        await db.collection("events").add(eventData);
        createEventForm.reset();
        loadEvents();
        showNotification('Event created successfully!', 'success');
    } catch (error) {
        showNotification('Failed to create event: ' + error.message, 'error');
        console.error("Firestore error:", error);
    }
}

async function loadEvents() {
    try {
        const snapshot = await db.collection("events").get();
        events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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

function displayAdminEvents() {
    adminEventsList.innerHTML = '';
    
    if (events.length === 0) {
        adminEventsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No events created yet.</p>';
        return;
    }
    
    events.forEach(event => {
        const eventElement = createEventElement(event, true);
        adminEventsList.appendChild(eventElement);
    });
}

function displayUserEvents() {
    userEventsList.innerHTML = '';
    
    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > new Date();
    });
    
    if (upcomingEvents.length === 0) {
        userEventsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No upcoming events.</p>';
        return;
    }
    
    upcomingEvents.forEach(event => {
        const eventElement = createEventElement(event, false);
        userEventsList.appendChild(eventElement);
    });
}

function createEventElement(event, isAdmin) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-item';
    
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString() + ' ' + eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    eventDiv.innerHTML = `
        <div class="event-header">
            <div class="event-title">${event.title}</div>
            <div class="event-date">${formattedDate}</div>
        </div>
        <div class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            ${event.location}
        </div>
        ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
        <div class="event-actions">
            ${isAdmin ? `
                <button class="btn-danger" onclick="deleteEvent('${event.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button class="btn-secondary" onclick="viewRSVPs('${event.id}')">
                    <i class="fas fa-users"></i> View RSVPs (${event.rsvps.length})
                </button>
            ` : `
                ${isUserRSVPed(event.id) ? `
                    <button class="btn-danger" onclick="cancelRSVP('${event.id}')">
                        <i class="fas fa-times"></i> Cancel RSVP
                    </button>
                ` : `
                    <button class="btn-success" onclick="rsvpToEvent('${event.id}')">
                        <i class="fas fa-check"></i> RSVP
                    </button>
                `}
            `}
        </div>
    `;
    
    return eventDiv;
}

// RSVP Functions
async function rsvpToEvent(eventId) {
    try {
        const eventRef = db.collection("events").doc(eventId);
        await eventRef.update({
            rsvps: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
        });
        loadEvents();
        showNotification('RSVP successful!', 'success');
    } catch (error) {
        showNotification('Failed to RSVP: ' + error.message, 'error');
    }
}

async function cancelRSVP(eventId) {
    try {
        const eventRef = db.collection("events").doc(eventId);
        await eventRef.update({
            rsvps: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
        });
        loadEvents();
        showNotification('RSVP cancelled', 'success');
    } catch (error) {
        showNotification('Failed to cancel RSVP: ' + error.message, 'error');
    }
}

function isUserRSVPed(eventId) {
    const event = events.find(e => e.id === eventId);
    return event && event.rsvps && event.rsvps.includes(currentUser.uid);
}

async function loadUserRSVPs() {
    userRSVPsList.innerHTML = '';
    try {
        const snapshot = await db.collection("events").where("rsvps", "array-contains", currentUser.uid).get();
        const userRSVPEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(event => new Date(event.date) > new Date());
        if (userRSVPEvents.length === 0) {
            userRSVPsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No RSVPs yet.</p>';
            return;
        }
        userRSVPEvents.forEach(event => {
            const rsvpElement = createRSVPElement(event);
            userRSVPsList.appendChild(rsvpElement);
        });
    } catch (error) {
        showNotification('Failed to load RSVPs: ' + error.message, 'error');
    }
}

function createRSVPElement(event) {
    const rsvpDiv = document.createElement('div');
    rsvpDiv.className = 'event-item';
    
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString() + ' ' + eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    rsvpDiv.innerHTML = `
        <div class="event-header">
            <div class="event-title">${event.title}</div>
            <div class="event-date">${formattedDate}</div>
        </div>
        <div class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            ${event.location}
        </div>
        <div class="event-actions">
            <button class="btn-danger" onclick="cancelRSVP('${event.id}')">
                <i class="fas fa-times"></i> Cancel RSVP
            </button>
        </div>
    `;
    
    return rsvpDiv;
}

// Admin Functions
async function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            await db.collection("events").doc(eventId).delete();
            loadEvents();
            showNotification('Event deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete event: ' + error.message, 'error');
        }
    }
}

function viewRSVPs(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        const rsvpCount = event.rsvps.length;
        showNotification(`${rsvpCount} people have RSVPed to this event`, 'info');
    }
}

// Notification Functions
function showNotification(message, type = 'info') {
    toastMessage.textContent = message;
    notificationToast.className = `toast ${type}`;
    notificationToast.classList.remove('hidden');
    
    setTimeout(() => {
        notificationToast.classList.add('hidden');
    }, 3000);
}

function scheduleEventNotification(event) {
    const eventDate = new Date(event.date);
    const notificationDate = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
    
    const now = new Date();
    const timeUntilNotification = notificationDate.getTime() - now.getTime();
    
    if (timeUntilNotification > 0) {
        setTimeout(() => {
            showNotification(`Reminder: "${event.title}" is tomorrow!`, 'reminder');
        }, timeUntilNotification);
    }
}

// Notification Permission
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted');
        }
    } catch (error) {
        console.log('Notification permission denied');
    }
}

// Initialize App
function initApp() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
        loadEvents();
    } else {
        showWelcomeScreen();
    }
    
    // Request notification permission
    requestNotificationPermission();
    
    // Check for scheduled notifications
    checkScheduledNotifications();
}

function checkScheduledNotifications() {
    // No longer using localStorage for events, so this function is no longer needed
    // The scheduleEventNotification function now directly uses the 'events' array
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

document.addEventListener('DOMContentLoaded', function() {
  const createEventForm = document.getElementById('createEventForm');
  if (createEventForm) {
    createEventForm.addEventListener('submit', handleCreateEvent);
  }
});

// Service Worker for notifications (for production)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered');
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
} 

console.log(firebase.apps.length ? "Firebase is connected!" : "Firebase is NOT connected!"); 
console.log("currentUser:", currentUser); 