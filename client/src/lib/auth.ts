/**
 * Authentication integration with grudgewarlords.com
 * Main auth server for all Grudge games
 */

const AUTH_SERVER = 'https://grudgewarlords.com';

export interface User {
  id: string;
  username: string;
  email?: string;
  faction?: 'crusade' | 'fabled' | 'legion';
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private token: string | null = null;

  private constructor() {
    // Check for existing session
    this.token = localStorage.getItem('grudge_auth_token');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Redirect to grudgewarlords.com for login
   */
  public async login(): Promise<void> {
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `${AUTH_SERVER}/login?return=${returnUrl}`;
  }

  /**
   * Logout from grudgewarlords.com
   */
  public async logout(): Promise<void> {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('grudge_auth_token');
    
    const returnUrl = encodeURIComponent(window.location.origin);
    window.location.href = `${AUTH_SERVER}/logout?return=${returnUrl}`;
  }

  /**
   * Verify session with grudgewarlords.com
   */
  public async verifySession(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${AUTH_SERVER}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        this.currentUser = await response.json();
        return this.currentUser;
      } else {
        // Token invalid, clear it
        this.token = null;
        localStorage.removeItem('grudge_auth_token');
        return null;
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      return null;
    }
  }

  /**
   * Handle OAuth callback from grudgewarlords.com
   */
  public handleCallback(token: string): void {
    this.token = token;
    localStorage.setItem('grudge_auth_token', token);
  }

  /**
   * Get current authenticated user
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get auth token for API calls
   */
  public getToken(): string | null {
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.token !== null && this.currentUser !== null;
  }
}

// Export singleton instance
export const auth = AuthService.getInstance();
