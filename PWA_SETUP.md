# PWA and Notifications Setup

Your Hourly app is now a Progressive Web App (PWA) with notification support! Here's everything you need to know.

## Features Added

### 1. Progressive Web App (PWA)
- **Install to Home Screen**: Users can install the app on their mobile devices and desktops
- **Offline Capability**: Basic caching for improved offline experience
- **App-like Experience**: Runs in standalone mode without browser UI

### 2. Push Notifications
- **Daily Reminders**: Get notified at 5 PM every day to log your hours
- **Browser Notifications**: Uses the Notifications API
- **Action Buttons**: Quick actions to add hours or dismiss

## How to Use

### Installing the App

#### On Mobile (iOS/Android)
1. Open the app in Safari (iOS) or Chrome (Android)
2. Look for the "Add to Home Screen" prompt or:
   - **iOS**: Tap the Share button → "Add to Home Screen"
   - **Android**: Tap the menu (⋮) → "Add to Home Screen"
3. The app will appear on your home screen like a native app

#### On Desktop (Chrome/Edge)
1. Look for the install prompt in the address bar (+ icon)
2. Or click the menu → "Install Hourly"
3. The app will open in its own window

### Enabling Notifications

1. Open the app and go to the Dashboard
2. Find the "Notifications" section
3. Click "Enable Notifications"
4. Allow notifications when your browser asks
5. You'll receive a test notification to confirm it works

### Notification Schedule

- **Daily Reminder**: 5 PM every day
- **Content**: "Time to log your hours!"
- **Actions**:
  - "Add Hours" - Opens the add hours page
  - "Dismiss" - Closes the notification

## Files Created

### Core PWA Files
- `/public/manifest.json` - App manifest with metadata
- `/public/sw.js` - Service worker for offline support and notifications
- `/public/icon.svg` - App icon (clock design)

### Components
- `/app/components/PWAInstaller.tsx` - Install prompt banner
- `/app/components/NotificationSettings.tsx` - Notification management UI

### Styles
- Updated `/app/globals.css` with PWA and notification styles

## Customization

### Change Notification Time

Edit `/app/components/NotificationSettings.tsx` line 48:

```typescript
targetTime.setHours(17, 0, 0, 0) // 5 PM
// Change to your preferred time, e.g., 9 AM:
targetTime.setHours(9, 0, 0, 0)
```

### Update App Icon

#### Using SVG (Current)
- Edit `/public/icon.svg` with your design
- Pros: Scales to any size, smaller file
- Cons: Some older devices prefer PNG

#### Generate PNG Icons
1. Install sharp: `npm install --save-dev sharp`
2. Edit and run: `node scripts/generate-icons.js`
3. Update `/public/manifest.json` to reference PNG files

Or use an online tool:
- Visit: https://realfavicongenerator.net/
- Upload your SVG/image
- Download and replace icon files

### Modify App Colors

Edit `/public/manifest.json`:

```json
{
  "background_color": "#f8fafc", // Background when launching
  "theme_color": "#3b82f6"       // Address bar color
}
```

## Testing

### Test PWA Installation
1. Run the app: `npm run dev`
2. Open in Chrome
3. Check DevTools → Application → Manifest
4. Verify all fields are correct

### Test Notifications
1. Enable notifications in the app
2. Click "Send Test Notification"
3. You should see a notification appear
4. Click the notification to test navigation

### Test Service Worker
1. Open DevTools → Application → Service Workers
2. Verify the service worker is registered and active
3. Test offline mode by checking "Offline" in Network tab

## Browser Compatibility

### Full Support
- Chrome (Android/Desktop)
- Edge (Desktop)
- Samsung Internet

### Partial Support
- Safari (iOS 16.4+) - PWA support is limited
- Firefox - No install prompt, but notifications work

### Limitations
- iOS Safari has limited service worker support
- iOS requires user interaction for notifications
- Some browsers block notifications by default

## Deployment Notes

When deploying to production:

1. **HTTPS Required**: PWAs and notifications only work on HTTPS
2. **Service Worker Scope**: Served from root domain
3. **Icons**: Consider generating PNG icons for better compatibility
4. **Notification Permissions**: Users must explicitly grant permission

## Troubleshooting

### Install Prompt Not Showing
- Ensure you're on HTTPS (or localhost)
- Check if already installed
- Try a different browser
- Clear cache and reload

### Notifications Not Working
- Check browser permissions (Settings → Site Settings → Notifications)
- Ensure HTTPS is enabled
- Verify service worker is registered
- Check browser console for errors

### Service Worker Not Updating
- Increment cache version in `/public/sw.js`
- Hard refresh (Ctrl+Shift+R)
- Unregister in DevTools and reload

## Next Steps

Consider adding:
- **Push Notifications**: Use a service like Firebase Cloud Messaging
- **Background Sync**: Sync data when connection returns
- **More Caching**: Cache API responses for full offline support
- **Custom Notification Times**: Let users set their preferred reminder time
- **Multiple Reminders**: Daily, weekly, or custom schedules

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
