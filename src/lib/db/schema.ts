/**
 * Drizzle-Schema (Postgres) — Phase 2 Fundament.
 *
 * Enthält die von Better Auth erwarteten Kern-Tabellen (user/session/account/
 * verification) sowie die App-Tabellen für Fortschritt und Kompass-Profil.
 *
 * Wichtig: Die JS-Property-Keys (camelCase, z.B. `emailVerified`, `createdAt`)
 * sind das, worauf der Better-Auth-Drizzle-Adapter mappt — die SQL-Spalten
 * dürfen snake_case heißen. Die Tabellennamen (singular) müssen zu Better
 * Auths Default passen.
 */
import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// ── Better-Auth-Kern-Tabellen ────────────────────────────────
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  // ── Better-Auth Admin-Plugin (Rollen/Rechte, Sperren) ──
  // Rollen: 'platform-admin' | 'org-admin' | 'dozent' | 'lerner' (Default).
  // Nur 'platform-admin' hat Admin-API-Zugriff (adminRoles in auth.ts).
  role: text('role').notNull().default('lerner'),
  banned: boolean('banned').notNull().default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  // Admin-Plugin: gesetzt, wenn ein Admin sich als dieser Nutzer ausgibt.
  impersonatedBy: text('impersonated_by'),
  // Organization-Plugin: aktuell gewählte Organisation dieser Session.
  activeOrganizationId: text('active_organization_id'),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── App-Tabellen ─────────────────────────────────────────────
// Fortschritt & Kompass werden als JSONB-Blob gespeichert (1:1-Spiegel der
// localStorage-Keys norive-progress-v2 / norive-kompass-v1). Normalisierung
// (pro Thema/Phase) erst wenn das Dozenten-Cockpit aggregierte Queries braucht.
export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull().default({}),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const kompassProfile = pgTable('kompass_profile', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull().default({}),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Better-Auth Organization-Plugin (B2B-Struktur) ───────────
// Bildungsträger = Organisation; `member` verbindet Nutzer ↔ Organisation.
// Die globale `user.role` bleibt maßgeblich fürs Gating (Admin/Cockpit); diese
// Tabellen liefern NUR die Zugehörigkeit (welcher Lerner/Dozent zu welchem
// Träger). Spaltenform folgt dem vom Plugin erwarteten Schema.
export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  // Better Auth legt metadata als JSON-String ab (kein jsonb).
  metadata: text('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const invitation = pgTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').notNull().default('pending'),
  teamId: text('team_id'),
  inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
