<script lang="ts">
  import { page } from '$app/stores';
  import { signOut } from '@auth/sveltekit/client';
</script>

<div class="min-h-screen bg-gray-900">
  <nav class="bg-gray-800 border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <a href="/" class="flex items-center text-pink-500 font-bold">
            🌮 Taco Rankings
          </a>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-gray-300">
            {$page.data.user?.name || 'User'}
          </span>
          <button
            type="button"
            class="btn btn-secondary"
            on:click={() => signOut()}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <slot />
  </main>
</div>
