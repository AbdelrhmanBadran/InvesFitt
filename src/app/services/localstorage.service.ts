import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  getItem(key: string): string | null {
    if (typeof window === 'undefined') {
      return null; // Handle server-side execution
    } else {
      return localStorage.getItem(key);
    }
  }

  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined' && localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  }

}
