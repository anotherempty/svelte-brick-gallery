<script>
	import Image from './Image.svelte';

	export /**
	 * {
	 *  src: string url required
	 *  width: int optional
	 *  height: int optional
	 * }
	 * @type {string | any[]}
	 */
	let images = [];

	export let itemWidth = 300;
	export let itemHeight = 200;

	export let gap = 20;

	export let justify = 'left';

	let itemsCount = images.length;

	/**
	 * @type {HTMLDivElement | undefined}
	 */
	let grid;
	let rows = [new Array(itemsCount).fill(0)];

	/**
	 * @type {number}
	 */
	let containerWidth = 0;

	const processDimensions = (
		/** @type {number} */ index,
		/** @type {{ natWidth: any; natHeight: any; }} */ size
	) => {
		if (images[index].width === undefined) {
			images[index].width = size.natWidth;
			images[index].height = size.natHeight;
		}
	};

	const scaledWidth = (/** @type {number} */ natWidth, /** @type {number} */ natHeight) => {
		return Math.floor((itemHeight * natWidth) / natHeight);
	};

	const round = (/** @type {number} */ number) => {
		let decimal = 4;
		return Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
	};

	const processRows = async () => {
		let start = 0;
		let end = 0;
		let rowWidth = 0;
		let processedItems = 0;

		rows = [];

		for (let i = 0; i < images.length; i++) {
			let currentWidth;

			if (images[i].width === undefined) {
				// if image sizes aren't loaded yet, use default width
				currentWidth = itemWidth;
			} else {
				// otherwise scale image width
				currentWidth = scaledWidth(images[i].width, images[i].height);
			}

			if (currentWidth > containerWidth) {
				currentWidth = containerWidth;
			}

			if (rowWidth + currentWidth > containerWidth) {
				// if current image doesn't fit in the current row
				end = i;
				// save current row to an array
				let row = new Array(end - start);

				// share remaining space among images in current row
				let portion = (containerWidth - rowWidth) / (end - start);
				for (let j = start, k = 0; j < end; j++, k++) {
					if (images[j].width === undefined) {
						// if image sizes aren't loaded yet, use default width
						row[k] = round(((itemWidth + portion) * 100) / containerWidth);
					} else {
						// otherwise use scaled width
						row[k] = round(
							((scaledWidth(images[j].width, images[j].height) + portion) * 100) / containerWidth
						);
					}
				}
				rows[rows.length] = row;
				rows = rows;
				processedItems += end - start;
				start = end;
				rowWidth = 0;
			}
			rowWidth += currentWidth;
		}

		// add remaining images to last row
		let row = new Array(images.length - processedItems);
		for (let i = processedItems, j = 0; i < images.length; i++, j++) {
			if (images[i].width === undefined) {
				row[j] = round((itemWidth * 100) / containerWidth);
			} else {
				row[j] = round((scaledWidth(images[i].width, images[i].height) * 100) / containerWidth);
			}
		}

		rows[rows.length] = row;
		rows = rows;
	};

	let loaded = 0;

	// useful if image sizes are unknown
	// process rows after every images have been loaded
	const processLoad = () => {
		loaded += 1;
		if (loaded === itemsCount) {
			processRows();
		}
	};

	// if images array changes, reprocess rows
	$: if (images.length > 0 && grid !== undefined) {
		processRows();
	}

	// process rows when container is resized
	$: if (containerWidth > 0) {
		processRows();
	}

	$: itemHeight && processRows();

	let style =
		'display:inline-block; height:100%; width:100%; object-fit:cover; object-position:center;';
</script>

<div bind:this={grid} class="grid" style="--brick-gap:{gap}px;" bind:clientWidth={containerWidth}>
	{#each rows as row, i}
		<div class="row {justify}">
			{#each row as item, j}
				{@const index = rows.slice(0, i).reduce((prev, cur) => prev + cur.length, 0) + j}
				<div
					class="item"
					style="height:{itemHeight}px; 
              width:{item === 0 ? itemWidth + 'px' : item + '%'};"
				>
					<Image
						src={images[index].src}
						on:loaded={() => processLoad()}
						on:loadedmeta={(e) => processDimensions(index, e.detail)}
					>
						<slot name="loading" slot="loading">
							<div class="loader" style="width:100%; height:100%;" />
						</slot>
						<slot
							name="image"
							slot="image"
							let:src
							{src}
							{style}
							{index}
							displayHeight={itemHeight}
							displayWidth={Math.floor((item * containerWidth) / 100)}
						>
							<img {src} {style} alt={src} title={src} />
						</slot>
						<slot name="error" slot="error" let:src let:load let:error {src} {load} {error}>
							<button on:click={() => load(src)}>reload</button>
						</slot>
					</Image>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	:root {
		--brick-gap: 10px;
	}
	.grid {
		display: flex;
		flex-direction: column;
		box-sizing: content-box;
		overflow: visible;
	}
	.row {
		width: 100%;
		box-sizing: border-box;
		overflow: visible;
		display: flex;
		flex-wrap: wrap;
		padding: calc(var(--brick-gap) / 2) 0;
	}
	.row.left {
		flex-direction: row;
		justify-content: start;
	}
	.row.right {
		flex-direction: row-reverse;
		justify-content: end;
	}
	.row.center {
		flex-direction: row;
		justify-content: center;
	}
	.row:first-child {
		padding-top: 0;
		padding-bottom: calc(var(--brick-gap) / 2);
	}
	.row:last-child {
		padding-top: calc(var(--brick-gap) / 2);
		padding-bottom: 0;
	}
	.row:first-child.row:last-child {
		padding: 0;
	}

	.item {
		box-sizing: border-box;
		overflow: visible;
		padding: 0 calc(var(--brick-gap) / 2);
	}
	.row.left > .item:first-child,
	.row.center > .item:first-child {
		padding-left: 0;
		padding-right: calc(var(--brick-gap) / 2);
	}
	.row.left > .item:last-child,
	.row.center > .item:last-child {
		padding-left: calc(var(--brick-gap) / 2);
		padding-right: 0;
	}
	.row.left > .item:first-child.item:last-child,
	.row.center > .item:first-child.item:last-child {
		padding: 0;
	}
	.row.right > .item:first-child {
		padding-left: calc(var(--brick-gap) / 2);
		padding-right: 0;
	}
	.row.right > .item:last-child {
		padding-left: 0;
		padding-right: calc(var(--brick-gap) / 2);
	}
	.row.right > .item:first-child.item:last-child {
		padding: 0;
	}

	.loader {
		background-color: #dddddd;
		animation: loader 3.2s ease-in-out infinite;
	}

	@keyframes loader {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
