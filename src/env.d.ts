/// <reference path="../.astro/types.d.ts" />

import type { auth } from './lib/auth';

type AuthSession = typeof auth.$Infer.Session;

declare namespace App {
  interface Locals {
    user: AuthSession['user'] | null;
    session: AuthSession['session'] | null;
  }
}
