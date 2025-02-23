// src/app.d.ts
import type PocketBase from 'pocketbase';
import type { AuthModel } from 'pocketbase';

declare global {
  namespace App {
    interface Locals {
      pb: PocketBase;
      user: AuthModel | null;
    }
    // interface Error {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};