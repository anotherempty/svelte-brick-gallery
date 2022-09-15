<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Gallery from '$lib/BrickGallery.svelte';

	export let data: PageData;

	let mounted = false;

	onMount(() => {
		mounted = true;
	});

</script>

<Gallery images={data.images} justify="right"/>
