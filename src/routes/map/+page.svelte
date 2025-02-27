<script>
  import { onMount } from 'svelte';
  import { Loader } from '@googlemaps/js-api-loader';

  let mapElement;
  let map;
  let currentCity = 'Austin, TX'; // Default city, will be made dynamic

  // Sample data - this will come from your API
  const topTaquerias = [
    {
      name: "Taco Joint",
      rating: 9,
      lat: 30.2849,
      lng: -97.7341,
    },
    {
      name: "Veracruz All Natural",
      rating: 9.5,
      lat: 30.2672,
      lng: -97.7431,
    }
  ];

  onMount(async () => {
    // Note: You'll need to replace with your actual Google Maps API key
    const loader = new Loader({
      apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
      version: "weekly",
    });

    const google = await loader.load();
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: currentCity }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        
        map = new google.maps.Map(mapElement, {
          center: { lat: lat(), lng: lng() },
          zoom: 12,
        });

        // Add markers for top-rated taquerias
        topTaquerias.forEach(taqueria => {
          if (taqueria.rating >= 5) {
            const marker = new google.maps.Marker({
              position: { lat: taqueria.lat, lng: taqueria.lng },
              map: map,
              title: `${taqueria.name} - Rating: ${taqueria.rating}🌮`,
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
              }
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div>
                  <h3>${taqueria.name}</h3>
                  <p>Rating: ${taqueria.rating} ${'🌮'.repeat(Math.floor(taqueria.rating))}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          }
        });
      }
    });
  });
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Top Rated Taquerias in {currentCity}</h1>
  
  <div bind:this={mapElement} class="w-full h-[600px] rounded-lg shadow-lg"></div>
  
  <div class="mt-6">
    <h2 class="text-2xl font-bold mb-4">Legend</h2>
    <div class="flex items-center space-x-2">
      <div class="w-6 h-6 bg-red-500 rounded-full"></div>
      <span>Taqueria rated 5+ 🌮</span>
    </div>
  </div>
</div>
