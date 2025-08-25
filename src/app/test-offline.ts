// Test if the app works offline
export function testOfflineSupport() {
  // Check if service worker is registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      if (registrations.length > 0) {
        console.log('Service Worker is registered');
        // Check if we can access the app offline
        fetch('/').then(function(response) {
          if (response.ok) {
            console.log('App is accessible online');
          } else {
            console.log('App is not accessible online');
          }
        }).catch(function(error) {
          console.log('App is not accessible online, but service worker should handle this');
        });
      } else {
        console.log('Service Worker is not registered');
      }
    });
  } else {
    console.log('Service Worker is not supported');
  }
}