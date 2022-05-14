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

	let itemsCount = images.length;

	/**
	 * @type {HTMLDivElement | undefined}
	 */
	let grid;
	let rows = [new Array(itemsCount).fill(0)];

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
		// @ts-ignore
		const gridWidth = grid.clientWidth;
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

			if (currentWidth > gridWidth) {
				currentWidth = gridWidth;
			}

			if (rowWidth + currentWidth > gridWidth) {
				// if current image doesn't fit in the current row
				end = i;
				// save current row to an array
				let row = new Array(end - start);

				// share remaining space among images in current row
				let portion = (gridWidth - rowWidth) / (end - start);
				for (let j = start, k = 0; j < end; j++, k++) {
					if (images[j].width === undefined) {
						// if image sizes aren't loaded yet, use default width
						row[k] = round(((itemWidth + portion) * 100) / gridWidth) + '%';
					} else {
						// otherwise use scaled width
						row[k] =
							round(
								((scaledWidth(images[j].width, images[j].height) + portion) * 100) / gridWidth
							) + '%';
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
				row[j] = round((itemWidth * 100) / gridWidth) + '%';
			} else {
				row[j] = round((scaledWidth(images[i].width, images[i].height) * 100) / gridWidth) + '%';
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

	/**
	 * @type {number}
	 */
	let containerWidth;

	// process rows when container is resized
	$: if (containerWidth > 0) {
		processRows();
	}

	let style =
		'display:inline-block; height:100%; width:100%; object-fit:cover; object-position:center;';
</script>

<div bind:this={grid} class="grid" style="--brick-gap:{gap}px;" bind:clientWidth={containerWidth}>
	{#each rows as row, i}
		<div class="row">
			{#each row as item, j}
				{@const index = rows.slice(0, i).reduce((prev, cur) => prev + cur.length, 0) + j}
				<div
					class="item"
					style="height:{itemHeight}px; 
              width:{item === 0 ? itemWidth + 'px' : item};"
				>
					<Image
						src={images[index].src}
						on:loaded={() => processLoad()}
						on:loadedmeta={(e) => processDimensions(index, e.detail)}
					>
						<slot name="loading" slot="loading">
							<span>loading</span>
						</slot>
						<slot name="image" slot="image" let:src {style} {index}>
							<img {src} {style} alt={src} />
						</slot>
						<slot name="error" slot="error" let:src let:load let:error {src} {load} {error}>
							<button on:click={()=>load(src)}>reload</button>
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
	}
	.row {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		justify-content: start;
		flex-wrap: wrap;
		/* border: 1px solid green; */
		padding: calc(var(--brick-gap) / 2) 0;
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
		/* border: 1px solid red; */
		box-sizing: border-box;
		overflow: hidden;
		padding: 0 calc(var(--brick-gap) / 2);
	}
	.item:first-child {
		padding-left: 0;
		padding-right: calc(var(--brick-gap) / 2);
	}
	.item:last-child {
		padding-left: calc(var(--brick-gap) / 2);
		padding-right: 0;
	}
	.item:first-child.item:last-child {
		padding: 0;
	}
</style>
