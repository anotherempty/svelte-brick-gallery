<svelte:options immutable />

<script>
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let src = '';
	export let classes = '';
	export let style = '';
	export let alt = '#';
	export let delay = 1000;

	/**
	 * @type {Promise<any> | PromiseLike<undefined> | undefined}
	 */
	let loading;

	let loaded = new Map();

	const loader = (/** @type {string} */ imgSrc) => {
		const res = new Promise((resolve, reject) => {
			if (loaded.has(imgSrc)) {
				dispatch('reloaded');
				resolve(imgSrc);
			} else {
				setTimeout(() => {
					const img = new Image();
					img.src = imgSrc;
					const getMetadata = setInterval(() => {
						if (img.naturalWidth) {
							clearInterval(getMetadata);
							dispatch('loadedmeta', {
								natWidth: img.naturalWidth,
								natHeight: img.naturalHeight
							});
						}
					}, 10);
					img.onload = () => {
						dispatch('loaded');
						loaded.set(imgSrc, img);
						resolve(imgSrc);
					};
					img.onerror = (e) => {
						dispatch('failed', { error: e });
						reject(e);
					};
				}, delay);
			}
		});

		return res;
	};

	const load = (/** @type {string} */ src) => {
		loading = loader(src);
	};

	let mounted = false;
	
	onMount(() => {
		mounted = true;
		load(src);
	});

	$: load(src);
</script>

{#if mounted}
	{#await loading}
		<slot name="loading">
			<span>...loading</span>
		</slot>
	{:then src}
		<slot name="image" {src}>
			<img {src} {alt} class={classes} {style} />
		</slot>
	{:catch error}
		<slot name="error" {error} {src} {load}>
			<p>error <button on:click={() => load(src)}>reload</button></p>
		</slot>
	{/await}
{/if}
