<script lang="ts">
  import { enhance } from '$app/forms';
  import { fade } from 'svelte/transition';
  import { signIn } from '@auth/sveltekit/client';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';

  let isSignIn = true;
  let isLoading = false;
  let error = '';
  let password = '';
  let confirmPassword = '';
  let passwordsMatch = true;
  let emailValid = true;
  let email = '';
  
  let formTimeout: ReturnType<typeof setTimeout> | null = null;

  onDestroy(() => {
    if (formTimeout) clearTimeout(formTimeout);
  });

  function toggleForm() {
    isSignIn = !isSignIn;
    error = '';
    passwordsMatch = true;
    emailValid = true;
  }

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePasswords(): boolean {
    if (!isSignIn) {
      passwordsMatch = password === confirmPassword;
      return passwordsMatch;
    }
    return true;
  }

  function handleEmailInput(e: Event) {
    const target = e.target as HTMLInputElement;
    email = target.value;
    emailValid = validateEmail(email);
  }

  function handlePasswordInput(e: Event) {
    const target = e.target as HTMLInputElement;
    password = target.value;
    validatePasswords();
  }

  function handleConfirmPasswordInput(e: Event) {
    const target = e.target as HTMLInputElement;
    confirmPassword = target.value;
    validatePasswords();
  }

  function handleSubmit() {
    return async ({ result, update }) => {
      // Basic validation before submitting
      if (!isSignIn && !validatePasswords()) {
        error = "Passwords don't match";
        return;
      }

      if (!validateEmail(email)) {
        error = "Please enter a valid email address";
        return;
      }
      
      isLoading = true;
      
      // Prevent multiple submissions
      const form = document.activeElement as HTMLElement;
      if (form) form.blur();
      
      if (result.type === 'failure') {
        let errorMessage = 'An error occurred';
        
        // Handle specific error types
        if (result.data?.code === 'auth/invalid-credentials') {
          errorMessage = 'Invalid email or password';
        } else if (result.data?.code === 'auth/network-error') {
          errorMessage = 'Network error. Please check your connection';
        } else if (result.data?.message) {
          errorMessage = result.data.message;
        }
        
        error = errorMessage;
        await update();
      }
      
      if (result.type === 'redirect') {
        const redirectTo = $page.url.searchParams.get('redirectTo');
        
        // Add a small delay for better UX
        formTimeout = setTimeout(async () => {
          await goto(redirectTo || '/');
        }, 300);
      } else {
        isLoading = false;
      }
    };
  }
</script>

<div class="max-w-md mx-auto">
  <div class="card">
    <div class="flex justify-center gap-4 mb-8">
      <button
        class="btn {isSignIn ? 'btn-primary' : 'btn-secondary'}"
        on:click={toggleForm}
        disabled={isLoading}
        aria-pressed={isSignIn}
        type="button">
        Sign In
      </button>
      <button
        class="btn {!isSignIn ? 'btn-primary' : 'btn-secondary'}"
        on:click={toggleForm}
        disabled={isLoading}
        aria-pressed={!isSignIn}
        type="button">
        Sign Up
      </button>
    </div>

    {#if error}
      <div 
        class="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-6" 
        transition:fade
        role="alert"
        aria-live="assertive">
        {error}
      </div>
    {/if}

    {#if isSignIn}
      <form method="POST" action="?/login" use:enhance={handleSubmit} class="space-y-6" novalidate>
        <h1>Welcome Back! 🌮</h1>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            class="input {!emailValid && email ? 'border-red-500' : ''}"
            placeholder="your@email.com"
            required
            disabled={isLoading}
            bind:value={email}
            on:input={handleEmailInput}
            aria-invalid={!emailValid && email ? 'true' : 'false'}
          />
          {#if !emailValid && email}
            <p class="text-red-400 text-sm mt-1">Please enter a valid email address</p>
          {/if}
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="input"
            placeholder="••••••••"
            required
            minlength="8"
            disabled={isLoading}
            bind:value={password}
            aria-invalid={password.length === 0 ? 'true' : 'false'}
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-700 bg-gray-900 text-pink-500 focus:ring-pink-500 focus:ring-offset-black"
              disabled={isLoading}
            />
            <label for="remember" class="ml-2 block text-sm text-gray-300">Remember me</label>
          </div>

          <div class="text-sm">
            <a href="/auth/reset-password" class="text-pink-500 hover:text-pink-400" class:pointer-events-none={isLoading}>
              Forgot your password?
            </a>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-full relative" 
          disabled={isLoading || !emailValid}
          aria-busy={isLoading}>
          {#if isLoading}
            <span class="absolute inset-0 flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span class="sr-only">Loading</span>
            <span class="opacity-0">Sign In</span>
          {:else}
            Sign In
          {/if}
        </button>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button 
              type="button" 
              class="btn btn-secondary flex items-center justify-center" 
              disabled={isLoading} 
              on:click|preventDefault={() => signIn('google')}
              aria-label="Sign in with Google">
              <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span class="ml-2">Google</span>
            </button>

            <button 
              type="button" 
              class="btn btn-secondary flex items-center justify-center" 
              disabled={isLoading} 
              on:click|preventDefault={() => signIn('github')}
              aria-label="Sign in with GitHub">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span class="ml-2">GitHub</span>
            </button>
          </div>
        </div>
      </form>
    {:else}
      <form method="POST" action="?/register" use:enhance={handleSubmit} class="space-y-6" novalidate>
        <h1>Create Account 🌮</h1>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            class="input"
            placeholder="John Doe"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label for="signup-email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            id="signup-email"
            name="email"
            class="input {!emailValid && email ? 'border-red-500' : ''}"
            placeholder="your@email.com"
            required
            disabled={isLoading}
            bind:value={email}
            on:input={handleEmailInput}
            aria-invalid={!emailValid && email ? 'true' : 'false'}
          />
          {#if !emailValid && email}
            <p class="text-red-400 text-sm mt-1">Please enter a valid email address</p>
          {/if}
        </div>

        <div>
          <label for="signup-password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input
            type="password"
            id="signup-password"
            name="password"
            class="input"
            placeholder="••••••••"
            required
            minlength="8"
            disabled={isLoading}
            bind:value={password}
            on:input={handlePasswordInput}
            aria-describedby="password-requirements"
          />
          <p id="password-requirements" class="text-gray-400 text-sm mt-1">
            Password must be at least 8 characters
          </p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            class="input {!passwordsMatch && confirmPassword ? 'border-red-500' : ''}"
            placeholder="••••••••"
            required
            disabled={isLoading}
            bind:value={confirmPassword}
            on:input={handleConfirmPasswordInput}
            aria-invalid={!passwordsMatch && confirmPassword ? 'true' : 'false'}
          />
          {#if !passwordsMatch && confirmPassword}
            <p class="text-red-400 text-sm mt-1">Passwords don't match</p>
          {/if}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-full relative" 
          disabled={isLoading || !passwordsMatch || !emailValid || password.length < 8}
          aria-busy={isLoading}>
          {#if isLoading}
            <span class="absolute inset-0 flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span class="sr-only">Loading</span>
            <span class="opacity-0">Create Account</span>
          {:else}
            Create Account
          {/if}
        </button>
      </form>
    {/if}
  </div>
</div>

<style>
  input[type="checkbox"] {
    @apply rounded border-gray-700 bg-gray-900 text-pink-500 focus:ring-pink-500 focus:ring-offset-black;
  }
</style>