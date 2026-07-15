/**
 * Better-Auth-Client (Browser). Same-origin — die baseURL wird aus
 * window.location abgeleitet, daher keine Konfiguration nötig.
 * Bietet u.a. authClient.signUp.email / signIn.email / signOut / getSession.
 */
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient();
