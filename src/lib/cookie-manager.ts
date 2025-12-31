/**
 * Cookie management utilities that work with SSR
 * Handles reading and writing cookies safely on both client and server
 */

export interface CookieOptions {
  maxAge?: number; // seconds
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

class CookieManager {
  /**
   * Get a cookie value by name
   * Works on both client and server (via request headers)
   */
  static getCookie(name: string): string | null {
    if (typeof window === 'undefined') {
      // Server-side: would need request object
      return null;
    }

    // Client-side: parse document.cookie
    try {
      const nameEQ = name + '=';
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }
    } catch (error) {
      console.error('Error reading cookie:', error);
    }
    return null;
  }

  /**
   * Set a cookie
   * Only works on client-side
   */
  static setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    if (typeof window === 'undefined') {
      // Server-side: cannot set cookies
      return;
    }

    try {
      const {
        maxAge = 7 * 24 * 60 * 60, // 7 days default
        path = '/',
        secure = true,
        sameSite = 'Lax'
      } = options;

      let cookieString = `${name}=${encodeURIComponent(value)}`;
      cookieString += `; Path=${path}`;
      cookieString += `; Max-Age=${maxAge}`;
      cookieString += `; SameSite=${sameSite}`;

      // Only set Secure flag if not in development
      if (
        secure &&
        (typeof window === 'undefined' || window.location.protocol === 'https:')
      ) {
        cookieString += '; Secure';
      }

      document.cookie = cookieString;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  /**
   * Delete a cookie
   */
  static deleteCookie(name: string): void {
    this.setCookie(name, '', {
      maxAge: -1,
      path: '/'
    });
  }

  /**
   * Clear all cookies
   */
  static clearAllCookies(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const cookies = document.cookie.split(';');
      for (const cookieStr of cookies) {
        const name = cookieStr.split('=')[0].trim();
        this.deleteCookie(name);
      }
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  }

  /**
   * Get all cookies as an object
   */
  static getAllCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};

    if (typeof window === 'undefined') {
      return cookies;
    }

    try {
      const cookieList = document.cookie.split(';');
      for (const cookieStr of cookieList) {
        const [name, value] = cookieStr.split('=').map(c => c.trim());
        if (name) {
          cookies[name] = decodeURIComponent(value || '');
        }
      }
    } catch (error) {
      console.error('Error getting all cookies:', error);
    }

    return cookies;
  }
}

export default CookieManager;
