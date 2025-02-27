<script lang="ts">
  import { enhance } from '$app/forms';
  import { fade } from 'svelte/transition';

  let isLoading = false;
  let error = '';
  let success = '';

  function handleSubmit() {
    return async ({ result, update }) => {
      isLoading = true;
      
      if (result.type === 'failure') {
        error = result.data?.message || 'An error occurred';
        success = '';
        await update();
      }
      
      if (result.type === 'success') {
        success = 'Password reset instructions have been sent to your email.';
        error = '';
        await update();
      }
      
      isLoading = false;
    };
  }
</script>

<div class="max-w-md mx-auto">
  <div class="card">
    <h1>Reset Password 🔑</h1>
    <p class="text-gray-400 mb-8">Enter your email address and we'll send you instructions to reset your password.</p>

    {#if error}
      <div class="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-6" transition:fade>
        {error}
      </div>
    {/if}

    {#if success}
      <div class="bg-green-900/50 border border-green-500/50 text-green-200 px-4 py-3 rounded mb-6" transition:fade>
        {success}
      </div>
    {/if}

    <form method="POST" action="?/reset" use:enhance={handleSubmit} class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          class="input"
          placeholder="your@email.com"
          required
          disabled={isLoading}
        />
      </div>

      <div class="flex gap-4">
        <a href="/auth" class="btn btn-secondary flex-1" class:pointer-events-none={isLoading}>
          Back to Sign In
        </a>
        <button type="submit" class="btn btn-primary flex-1 relative" disabled={isLoading}>
          {#if isLoading}
            <span class="absolute inset-0 flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span class="opacity-0">Reset Password</span>
          {:else}
            Reset Password
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
