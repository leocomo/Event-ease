# EventEase - Smart Event Planning Web App

A modern, responsive web application designed for small teams to manage events efficiently. EventEase features role-based dashboards, real-time notifications, and an intuitive user interface with a beautiful curvy design.

## 🎯 Features

### Admin Features
- **Event Creation**: Create events with title, date/time, location, and description
- **Event Management**: View all created events and manage them
- **RSVP Tracking**: Monitor RSVP counts for each event
- **Event Deletion**: Remove events when needed

### User Features
- **Event Discovery**: View all upcoming events
- **RSVP System**: RSVP to events you want to attend
- **My RSVPs**: Track all your RSVPs in one place
- **Smart Notifications**: Get reminders one day before events

### General Features
- **Role-Based Access**: Separate dashboards for Admins and Users
- **Modern UI**: Beautiful curvy design with bright color palette
- **Responsive Design**: Works perfectly on all devices
- **Real-time Notifications**: Toast notifications for user feedback
- **Local Storage**: Data persists across browser sessions

## 🎨 Design Features

- **Modern Curvy Design**: Rounded corners and smooth animations
- **Bright Color Palette**: Purple gradient theme (#667eea to #764ba2)
- **Roboto Font**: Clean, modern typography
- **Glass Morphism**: Translucent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Mobile-first design approach

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Styling** | Custom CSS with modern features |
| **Icons** | Font Awesome 6.0 |
| **Fonts** | Google Fonts (Roboto) |
| **Backend** | Firebase (Auth + Firestore) |
| **Notifications** | Browser Notifications API |
| **Storage** | LocalStorage (demo) / Firestore (production) |

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Start Using** EventEase immediately!

### Demo Usage

1. **Get Started**: Click "Get Started" on the welcome screen
2. **Choose Role**: Select Admin or User role
3. **Login**: Enter any email and password (demo mode)
4. **Admin Mode**: Create events and manage them
5. **User Mode**: Browse events and RSVP to them

## 📱 How to Use

### For Admins

1. **Login as Admin**
   - Click "Get Started" → Select "Admin" → Enter credentials

2. **Create Events**
   - Fill in event details (title, date/time, location, description)
   - Click "Create Event"

3. **Manage Events**
   - View all created events
   - Delete events if needed
   - Check RSVP counts

### For Users

1. **Login as User**
   - Click "Get Started" → Select "User" → Enter credentials

2. **Browse Events**
   - View all upcoming events
   - See event details and location

3. **RSVP to Events**
   - Click "RSVP" on events you want to attend
   - View your RSVPs in the "My RSVPs" section
   - Cancel RSVPs if needed

## 🔧 Firebase Setup (Production)

To use Firebase in production:

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project

2. **Enable Services**
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Messaging (for notifications)

3. **Update Configuration**
   - Replace the Firebase config in `script.js` with your project's config
   - Update the authentication logic to use Firebase Auth

4. **Deploy**
   - Use Firebase Hosting or any static hosting service

## 📁 Project Structure

```
EventEase/
├── index.html          # Main HTML file
├── styles.css          # CSS styles with modern design
├── script.js           # JavaScript functionality
└── README.md          # Project documentation
```

## 🎨 Color Palette

- **Primary Gradient**: `#667eea` to `#764ba2`
- **Success**: `#4CAF50` to `#45a049`
- **Danger**: `#f44336` to `#d32f2f`
- **Background**: Purple gradient
- **Cards**: White with transparency
- **Text**: Dark gray (`#333`)

## 🔔 Notification System

- **Toast Notifications**: Real-time feedback for user actions
- **Event Reminders**: Automatic notifications 24 hours before events
- **Browser Notifications**: Native browser notifications (with permission)

## 📱 Responsive Design

- **Desktop**: Full dashboard with grid layout
- **Tablet**: Adjusted grid and spacing
- **Mobile**: Single column layout with optimized touch targets

## 🚀 Future Enhancements

- [ ] Real Firebase integration
- [ ] Email notifications
- [ ] Event categories and tags
- [ ] Calendar view
- [ ] Event templates
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Mobile app version

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for errors
2. Ensure you're using a modern browser
3. Try clearing browser cache and localStorage
4. Create an issue in the project repository

## 🎉 Demo Credentials

For testing purposes, you can use any email and password combination. The app uses localStorage for demo purposes, so data will persist in your browser.

---

**Built with ❤️ using modern web technologies** 