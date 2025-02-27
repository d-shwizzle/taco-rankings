Improved Taquerias List Component
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { signIn, signOut } from '@auth/sveltekit/client';
  import type { Taqueria } from '$lib/types';

  let taquerias: Taqueria[] = [];
  let loading = true;
  let error: string | null = null;
  
  onMount(async () => {
    try {
      const response = await fetch('/api/taquerias');
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch taquerias: ${response.status}`);
      }
      taquerias = await response.json();
    } catch (e) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = 'An unknown error occurred';
      }
      console.error('Error fetching taquerias:', e);
    } finally {
      loading = false;
    }
  });

  interface TaqueriaWithAvgRating extends Taqueria {
    avgRating: number;
    reviewCount: number;
  }

  $: sortedTaquerias = [...taquerias].map(t => {
    const reviewCount = t.reviews.length;
    const avgRating = reviewCount ? 
      t.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount : 
      0;
    
    return {
      ...t,
      avgRating,
      reviewCount
    };
  }).sort((a, b) => b.avgRating - a.avgRating) as TaqueriaWithAvgRating[];

  function getTacoEmojis(rating: number): string {
    return '🌮'.repeat(Math.round(rating));
  }
  
  function handleSignIn() {
    signIn('github');
  }
  
  function handleSignOut() {
    signOut();
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
    <h1 class="text-3xl md:text-4xl font-bold">Top Rated Taquerias</h1>
    <div class="flex gap-4">
      {#if $page.data.session}
        <a
          href="/rate"
          class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          aria-label="Rate a taqueria"
        >
          Rate a Taqueria
        </a>
        <button
          on:click={handleSignOut}
          class="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Sign out"
        >
          Sign Out
        </button>
      {:else}
        <button
          on:click={handleSignIn}
          class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          aria-label="Sign in with GitHub"
        >
          Sign In
        </button>
      {/if}
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
      <p>{error}</p>
    </div>
  {:else if sortedTaquerias.length === 0}
    <div class="text-center py-12">
      <p class="text-xl text-gray-600">No taquerias found. Be the first to add one!</p>
    </div>
  {:else}
    <div class="grid gap-6">
      {#each sortedTaquerias as taqueria, i}
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 class="text-2xl font-bold">{i + 1}. {taqueria.name}</h2>
              <p class="text-gray-600">{taqueria.address}</p>
              <p class="text-gray-600">{taqueria.city}, {taqueria.state}</p>
              <div class="mt-2">
                <p class="text-sm text-gray-500">{taqueria.reviewCount} {taqueria.reviewCount === 1 ? 'review' : 'reviews'}</p>
                {#if taqueria.reviewCount > 0}
                  <div class="mt-2 space-y-2">
                    {#each taqueria.reviews.slice(0, 2) as review}
                      <div class="flex items-start gap-2 text-sm">
                        {#if review.user.image}
                          <img 
                            src={review.user.image} 
                            alt={`${review.user.name}'s avatar`} 
                            class="w-6 h-6 rounded-full" 
                            loading="lazy"
                          />
                        {:else}
                          <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            {review.user.name ? review.user.name[0].toUpperCase() : '?'}
                          </div>
                        {/if}
                        <div>
                          <p class="font-medium">{review.user.name}</p>
                          <p class="text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    {/each}
                    {#if taqueria.reviewCount > 2}
                      <a href={`/taqueria/${taqueria.id}`} class="text-orange-500 hover:underline text-sm">
                        View all {taqueria.reviewCount} reviews
                      </a>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-orange-500">{taqueria.avgRating.toFixed(1)}</div>
              <div class="text-2xl" aria-label={`Rating: ${taqueria.avgRating.toFixed(1)} out of 5`}>
                {getTacoEmojis(taqueria.avgRating)}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div class="mt-8 text-center">
    <a
      href="/rate"
      class="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
      aria-label="Rate a taqueria"
    >
      Rate a Taqueria 🌮
    </a>
  </div>
</div>