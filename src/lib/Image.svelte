<svelte:options immutable />

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { debounce } from './helpers';

	const dispatch = createEventDispatcher();

	/**
	 * @param {string} src The image source to load.
	 */
	export let src: string = '';

	/**
	 * @param {string} classes CSS classes to add to the image.
	 */
	export let classes: string = '';

	/**
	 * @param {string} style CSS styles to add to the image.
	 */
	export let style: string = '';

	/**
	 * @param {string} alt The image 'alt' attribute. Default is '#'.
	 */
	export let alt: string = '#';

	/**
	 * @param {number} delay The loading delay to emphasize the loading animation. Default is 1000ms.
	 */
	export let delay: number = 1000;

	let loading: Promise<string> | PromiseLike<undefined> | undefined;

	const loadedImgs = new Map();

	const imgLoading = debounce(async (imgSrc: string, resolve, reject) => {
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
			loadedImgs.set(imgSrc, img);
			resolve(imgSrc);
		};
		img.onerror = () => {
			dispatch('failed', { error: 'error when loading' });
			reject(imgSrc);
		};
	}, delay);

	function loader(imgSrc: string) {
		const res: Promise<string> = new Promise((resolve, reject) => {
			if (loadedImgs.has(imgSrc)) {
				dispatch('reloaded');
				resolve(imgSrc);
			} else {
				imgLoading(imgSrc, resolve, reject);
			}
		});

		return res;
	}

	let mounted = false;

	onMount(() => {
		mounted = true;
		load(src);
	});

	function load(src: string) {
		if (mounted) {
			loading = loader(src);
		}
	}

	$: load(src);
</script>

<!--
  @component
  Image component

  Usage:
  ```tsx
    <Image {src} {classes} {style} {alt} {delay}>
      <div slot="loading">loading animation</div>
      <img slot="image" let:src {src}>
      <div slot="error" let:load let:src let:error>
        <button on:click={() => load(src)}>reload</button>
      </div>
    </Image>
  ```
  
-->

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
			<button on:click={() => load(src)}>reload</button>
		</slot>
	{/await}
{/if}
