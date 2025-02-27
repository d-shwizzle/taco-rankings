<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { Taqueria } from '$lib/types';

  let taqueriaName = '';
  let address = '';
  let city = '';
  let state = '';
  let rating = 5;
  let comment = '';
  let tacoEmojis = '🌮'.repeat(rating);
  let loading = false;
  let error: string | null = null;
  let existingTaquerias: Taqueria[] = [];
  let selectedTaqueria: Taqueria | null = null;

  onMount(async () => {
    if (!$page.data.session) {
      goto('/');
      return;
    }
    
    try {
      const response = await fetch('/api/taquerias');
      if (!response.ok) throw new Error('Failed to fetch taquerias');
      existingTaquerias = await response.json();
    } catch (e) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = 'An unknown error occurred';
      }
    }
  });
  
  function updateRating(value: number): void {
    rating = value;
    tacoEmojis = '🌮'.repeat(rating);
  }

  interface NewTaqueriaData {
    name: string;
    address: string;
    city: string;
    state: string;
  }

  interface ReviewData {
    taqueriaId: string;
    rating: number;
    comment: string;
  }

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    loading = true;
    error = null;

    try {
      let taqueriaId: string;

      if (!selectedTaqueria) {
        // Create new taqueria
        const taqueriaData: NewTaqueriaData = {
          name: taqueriaName,
          address,
          city,
          state
        };

        const taqueriaResponse = await fetch('/api/taquerias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taqueriaData)
        });

        if (!taqueriaResponse.ok) throw new Error('Failed to create taqueria');
        const taqueria: Taqueria = await taqueriaResponse.json();
        taqueriaId = taqueria.id;
      } else {
        taqueriaId = selectedTaqueria.id;
      }

      // Create review
      const reviewData: ReviewData = {
        taqueriaId,
        rating,
        comment
      };

      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (!reviewResponse.ok) throw new Error('Failed to create review');
      goto('/');
    } catch (e) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = 'An unknown error occurred';
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Rate a Taqueria</h1>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}
  
  <form on:submit={handleSubmit} class="space-y-4">
    {#if existingTaquerias.length > 0}
      <div>
        <label for="existingTaqueria" class="block mb-2">Select Existing Taqueria (Optional)</label>
        <select
          id="existingTaqueria"
          bind:value={selectedTaqueria}
          class="w-full p-2 border rounded"
        >
          <option value={null}>Add New Taqueria</option>
          {#each existingTaquerias as taqueria}
            <option value={taqueria}>{taqueria.name} - {taqueria.address}</option>
          {/each}
        </select>
      </div>
    {/if}

    {#if !selectedTaqueria}
      <div>
        <label for="taqueriaName" class="block mb-2">Taqueria Name</label>
        <input
          type="text"
          id="taqueriaName"
          bind:value={taqueriaName}
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label for="address" class="block mb-2">Address</label>
        <input
          type="text"
          id="address"
          bind:value={address}
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="city" class="block mb-2">City</label>
          <input
            type="text"
            id="city"
            bind:value={city}
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label for="state" class="block mb-2">State</label>
          <input
            type="text"
            id="state"
            bind:value={state}
            class="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
    {/if}

    <div>
      <label for="address" class="block mb-2">Address</label>
      <input
        type="text"
        id="address"
        bind:value={address}
        class="w-full p-2 border rounded"
        required
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="city" class="block mb-2">City</label>
        <input
          type="text"
          id="city"
          bind:value={city}
          class="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label for="state" class="block mb-2">State</label>
        <input
          type="text"
          id="state"
          bind:value={state}
          class="w-full p-2 border rounded"
          required
        />
      </div>
    </div>

    <div>
      <label for="rating" class="block mb-2">Rating</label>
      <div class="flex items-center space-x-4">
        <input
          id="rating"
          type="range"
          min="1"
          max="10"
          bind:value={rating}
          on:input={() => updateRating(rating)}
          class="w-48"
        />
        <span class="text-2xl">{rating}</span>
      </div>
      <div class="text-2xl mt-2">
        {tacoEmojis}
      </div>
    </div>

    <div>
      <label for="comment" class="block mb-2">Comment (Optional)</label>
      <textarea
        id="comment"
        bind:value={comment}
        class="w-full p-2 border rounded"
        rows="3"
      ></textarea>
    </div>

    <button
      type="submit"
      class="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading}
    >
      {loading ? 'Submitting...' : 'Submit Rating'}
    </button>
  </form>
</div>
