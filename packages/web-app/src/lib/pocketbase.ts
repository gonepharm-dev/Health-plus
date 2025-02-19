// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';

// Create PocketBase instance
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'https://gonep-app.pockethost.io/');

// Export as default and named export for flexibility
export default pb;
export { pb };