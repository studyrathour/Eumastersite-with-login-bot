// Content Security Utilities for Base64 encoding/decoding
export class ContentSecurity {
  /**
   * Encode content title to Base64 for security
   */
  static encodeTitle(title: string): string {
    try {
      // Add a random prefix to make it harder to detect patterns
      const randomPrefix = Math.random().toString(36).substring(2, 8);
      const titleWithPrefix = `${randomPrefix}:${title}`;
      return btoa(encodeURIComponent(titleWithPrefix));
    } catch (error) {
      console.warn('Failed to encode title:', error);
      return title; // Fallback to original title
    }
  }

  /**
   * Decode Base64 encoded title back to readable format
   */
  static decodeTitle(encodedTitle: string): string {
    try {
      if (!encodedTitle || encodedTitle.trim() === '') {
        return 'Untitled Content';
      }

      // Check if it's already decoded (fallback for non-encoded titles)
      if (!this.isBase64(encodedTitle)) {
        return encodedTitle;
      }

      const decoded = decodeURIComponent(atob(encodedTitle));
      
      // Remove the random prefix if it exists
      const colonIndex = decoded.indexOf(':');
      if (colonIndex !== -1 && colonIndex < 10) {
        return decoded.substring(colonIndex + 1);
      }
      
      return decoded;
    } catch (error) {
      console.warn('Failed to decode title:', error);
      return 'Content'; // Fallback title
    }
  }

  /**
   * Encode content URL to Base64 for security
   */
  static encodeUrl(url: string): string {
    try {
      if (!url || url.trim() === '') return '';
      
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const urlWithSuffix = `${url}#${randomSuffix}`;
      return btoa(encodeURIComponent(urlWithSuffix));
    } catch (error) {
      console.warn('Failed to encode URL:', error);
      return url;
    }
  }

  /**
   * Decode Base64 encoded URL back to usable format
   */
  static decodeUrl(encodedUrl: string): string {
    try {
      if (!encodedUrl || encodedUrl.trim() === '') return '';

      if (!this.isBase64(encodedUrl)) {
        return encodedUrl;
      }

      const decoded = decodeURIComponent(atob(encodedUrl));
      
      // Remove the random suffix if it exists
      const hashIndex = decoded.lastIndexOf('#');
      if (hashIndex !== -1 && decoded.length - hashIndex < 10) {
        return decoded.substring(0, hashIndex);
      }
      
      return decoded;
    } catch (error) {
      console.warn('Failed to decode URL:', error);
      return encodedUrl;
    }
  }

  /**
   * Check if a string is valid Base64
   */
  private static isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  /**
   * Batch encode content array
   */
  static encodeContentArray(contents: any[]): any[] {
    return contents.map(content => ({
      ...content,
      title: this.encodeTitle(content.title || ''),
      url: this.encodeUrl(content.url || '')
    }));
  }

  /**
   * Batch decode content array
   */
  static decodeContentArray(contents: any[]): any[] {
    return contents.map(content => ({
      ...content,
      title: this.decodeTitle(content.title || ''),
      url: this.decodeUrl(content.url || '')
    }));
  }

  /**
   * Secure content for storage (encode sensitive data)
   */
  static secureForStorage(content: any): any {
    return {
      ...content,
      title: this.encodeTitle(content.title || ''),
      url: this.encodeUrl(content.url || '')
    };
  }

  /**
   * Prepare content for display (decode sensitive data)
   */
  static prepareForDisplay(content: any): any {
    return {
      ...content,
      title: this.decodeTitle(content.title || ''),
      url: this.decodeUrl(content.url || '')
    };
  }
}

// Export utility functions for backward compatibility
export const encodeContentTitle = ContentSecurity.encodeTitle;
export const decodeContentTitle = ContentSecurity.decodeTitle;
export const encodeContentUrl = ContentSecurity.encodeUrl;
export const decodeContentUrl = ContentSecurity.decodeUrl;