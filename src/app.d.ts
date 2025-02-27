/// <reference types="@sveltejs/kit" />
declare namespace App {
  interface Locals {
    getSession(): Promise<import('@auth/core').Session | null>;
  }
  
  interface PageData {
    session: import('@auth/core').Session | null;
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
  }
}

declare module '$env/static/private' {
  export const GITHUB_ID: string;
  export const GITHUB_SECRET: string;
  export const GOOGLE_ID: string;
  export const GOOGLE_SECRET: string;
  export const AUTH_SECRET: string;
}