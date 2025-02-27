<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { signOut } from '@auth/sveltekit/client';
</script>

<div class="min-h-screen flex flex-col">
  <nav class="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-lg">
    <div class="container mx-auto px-6 py-4">
      <div class="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
        <a href="/" class="text-2xl font-bold text-pink-500 flex items-center gap-2 transition-transform hover:scale-105">
          <span class="text-3xl">🌮</span>
          <span class="font-bold tracking-wider uppercase">TacoRater</span>
        </a>
        
        <div class="flex space-x-6 justify-center">
          <a href="/" class="nav-link {$page.url.pathname === '/' ? 'active' : ''}">Home</a>
          <a href="/rate" class="nav-link {$page.url.pathname === '/rate' ? 'active' : ''}">Rate a Taqueria</a>
          <a href="/map" class="nav-link {$page.url.pathname === '/map' ? 'active' : ''}">Taco Map</a>
          {#if $page.data.user}
            <button
              type="button"
              class="nav-link"
              on:click={() => signOut()}>
              Sign Out
            </button>
          {:else}
            <a href="/auth" class="nav-link {$page.url.pathname === '/auth' ? 'active' : ''}">Sign In</a>
          {/if}
        </div>

        <button class="md:hidden text-white hover:text-orange-200 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <main class="flex-grow container mx-auto px-6 py-12 text-center" in:fade={{ duration: 300 }}>
    <slot />
  </main>

  <footer class="bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 text-white py-12 mt-auto">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <h3 class="text-lg font-semibold mb-4 text-pink-500 tracking-wide uppercase">About TacoRater</h3>
          <p class="text-gray-300">Your trusted guide to finding the best tacos in the country. Rate, review, and discover amazing taquerias.</p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4 text-pink-500 tracking-wide uppercase">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="/" class="text-gray-300 hover:text-pink-500 transition-colors">Home</a></li>
            <li><a href="/rate" class="text-gray-300 hover:text-pink-500 transition-colors">Rate a Taqueria</a></li>
            <li><a href="/map" class="text-gray-300 hover:text-pink-500 transition-colors">Taco Map</a></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4 text-pink-500 tracking-wide uppercase">Connect With Us</h3>
          <p class="text-gray-300">Share your taco adventures with us on social media!</p>
          <p class="mt-4 text-sm text-gray-400">© {new Date().getFullYear()} TacoRater 🌮</p>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .nav-link {
    @apply text-gray-300 font-medium transition-all duration-200 relative py-1;
  }

  .nav-link::after {
    content: '';
    @apply absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-200;
  }

  .nav-link:hover::after,
  .nav-link.active::after {
    @apply w-full;
  }

  .nav-link:hover {
    @apply text-pink-500;
  }

  .nav-link.active {
    @apply text-pink-500;
  }
</style>
