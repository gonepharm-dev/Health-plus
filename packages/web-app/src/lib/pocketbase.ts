import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

let pb: PocketBase;

if (browser) {
  pb = new PocketBase('https://gonep-app.pockethost.io/');
  
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const pbAuthCookie = cookies.find(cookie => cookie.startsWith('pb_auth='));
  
  if (pbAuthCookie) {
    try {
      const authValue = decodeURIComponent(pbAuthCookie.split('=')[1]);
      const authData = JSON.parse(authValue);
      
      if (authData?.token && authData?.model) {
        pb.authStore.save(authData.token, authData.model);
      }
    } catch (err) {
      console.error('Error loading auth from cookie:', err);
    }
  }
} else {
  // On server side
  pb = new PocketBase('https://gonep-app.pockethost.io/');
}

export default pb;
export {pb} 