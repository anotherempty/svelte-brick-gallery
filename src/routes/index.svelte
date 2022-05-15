<script>
	import Gallery from '$lib/BrickGallery.svelte';

	/**
	 * @type {string | any[]}
	 */
	let images;

	const load = (async () => {
		let res = await fetch(`https://picsum.photos/v2/list?page=2&limit=1`);

		images = (await res.json()).map((img) => ({
			src: img.download_url,
			width: img.width,
			height: img.height,
			author: img.author
		}));

		return images;
	})();

	let page = 1;
	const more = async () => {
		let res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=2`);

		images = images.concat(
			(await res.json()).map((img) => ({
				src: img.download_url,
				width: img.width,
				height: img.height,
				author: img.author
			}))
		);
		page++;

		return images;
	};
</script>

<button on:click={() => more()}> load </button>

{#await load}
	loading...
{:then data}
	<div style="padding:20px;">
		<Gallery {images} justify="center" itemHeight={175} itemWidth={500} gap={0}>
			<div slot="image" let:index let:style style="height:100%; position:relative">
				<img src={images[index].src} {style} alt={index} />
				<div style="position:absolute; top:0;left:0;">
					{index}
				</div>
			</div>
		</Gallery>
	</div>
{:catch}
	loading error
{/await}
