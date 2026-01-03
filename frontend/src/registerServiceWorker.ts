import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Show update available prompt
    if (confirm('New version available! Click OK to update.')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
    // You can show a notification to the user
    showOfflineReadyNotification();
  },
  onRegistered(registration) {
    console.log('Service Worker registered:', registration);
  },
  onRegisterError(error) {
    console.error('Service Worker registration error:', error);
  },
});

function showOfflineReadyNotification() {
  // This could trigger a toast notification
  const event = new CustomEvent('pwa:offline-ready', {
    detail: { message: 'App is ready to work offline' },
  });
  window.dispatchEvent(event);
}

export { updateSW };
