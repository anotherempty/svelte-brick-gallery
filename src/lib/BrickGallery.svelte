<script lang="ts">
	import { round, scaleWidth } from './helpers';
	import Image from './Image.svelte';
	import type { ImageSrc, Justify } from './types';

	/**
	 * @param {object} images An array of images { src: string; width?: number; height?: number; }
	 */
	export let images: Array<ImageSrc> = [];

	/**
	 * @param {number} itemWidth Default width in pixel of an image. Default value is 300.
	 */
	export let itemWidth = 300;

	/**
	 * @param {number} itemHeight Default height in pixel of an image. Default value is 200.
	 */
	export let itemHeight = 200;

	/**
	 * @param {number} gap Gutters or space in pixel between images. Default value is 20.
	 */
	export let gap = 20;

	/**
	 * @param {string} justify Justify images 'left', 'center' or 'right'. Default value is 'left'.
	 */
	export let justify: Justify = 'left';

	/**
	 * @param {number} delay The loading delay to emphasize the loading animation. Default is 1000ms.
	 */
	export let delay: number = 1000;

	let itemsCount = images.length;

	let grid: HTMLDivElement;
	let rows = [new Array(itemsCount).fill(0)];

	let containerWidth: number = 0;

	const processDimensions = (index: number, size: { natWidth: number; natHeight: number }) => {
		if (images[index].width === undefined) {
			images[index].width = size.natWidth;
			images[index].height = size.natHeight;
		}
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
				currentWidth = scaleWidth(images[i].width || 0, images[i].height || 0, itemHeight);
			}

			if (currentWidth > containerWidth) {
				currentWidth = containerWidth;
			}

			if (rowWidth + currentWidth > containerWidth) {
				// if current image doesn't fit in the current row
				end = i;
				// save current row to an array
				const row = new Array(end - start);

				// share remaining space among images in current row
				const portion = (containerWidth - rowWidth) / (end - start);
				for (let j = start, k = 0; j < end; j++, k++) {
					if (images[j].width === undefined) {
						// if image sizes aren't loaded yet, use default width
						row[k] = round(((itemWidth + portion) * 100) / containerWidth);
					} else {
						// otherwise use scaled width
						row[k] = round(
							((scaleWidth(images[j].width || 0, images[j].height || 0, itemHeight) + portion) *
								100) /
								containerWidth
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
		const row = new Array(images.length - processedItems);
		for (let i = processedItems, j = 0; i < images.length; i++, j++) {
			if (images[i].width === undefined) {
				row[j] = round((itemWidth * 100) / containerWidth);
			} else {
				row[j] = round(
					(scaleWidth(images[i].width || 0, images[i].height || 0, itemHeight) * 100) /
						containerWidth
				);
			}
		}

		rows[rows.length] = row;
		rows = rows;
	};

	let loaded = 0;

	// useful if image sizes are unknown
	// process rows after every images have been loaded
	function processLoad() {
		loaded += 1;
		if (loaded === itemsCount) {
			processRows();
		}
	}

	// if images array changes, reprocess rows
	$: if (images.length > 0 && grid !== undefined) {
		processRows();
	}

	// process rows when container is resized
	$: if (containerWidth > 0) {
		processRows();
	}

	$: itemHeight && processRows();

	let imgStyle =
		'display:inline-block; height:100%; width:100%; object-fit:cover; object-position:center;';

	let classPrefix = 'brick-';
</script>

<!--
	@component
	Brick Gallery component

	Usage:
  ```tsx
  <BrickGallery {images}>
		<div slot="loading">
			...loading
		</div>
		<div slot="image" let:src let:index let:style let:displayWidth let:displayHeight style="height: 100%;">
			<img src={src} {style}>
		</div>
		<div slot="error" let:load let:src>
			<button on:click={() => load(src)}>reload</button>
		</div>
	</BrickGallery>
  ```
	
-->

<div
	bind:this={grid}
	class="{classPrefix}grid"
	style="--brick-gap:{gap}px;"
	bind:clientWidth={containerWidth}
>
	{#each rows as row, i}
		<div class="{classPrefix}row {justify}">
			{#each row as item, j}
				{@const index = rows.slice(0, i).reduce((prev, cur) => prev + cur.length, 0) + j}
				<div
					class="{classPrefix}item"
					style:height={itemHeight + 'px'}
					style:width={item === 0 ? itemWidth + 'px' : item + '%'}
				>
					<Image
						src={images[index].src}
						on:loaded={() => processLoad()}
						on:loadedmeta={(e) => processDimensions(index, e.detail)}
						{delay}
					>
						<slot name="loading" slot="loading">
							<div class="{classPrefix}loader" style="width:100%; height:100%;" />
						</slot>
						<slot
							name="image"
							slot="image"
							let:src
							{src}
							style={imgStyle}
							{index}
							displayHeight={itemHeight}
							displayWidth={Math.floor((item * containerWidth) / 100)}
						>
							<img {src} style={imgStyle} alt={src} title={src} />
						</slot>
						<slot name="error" slot="error" let:src let:load {src} {load}>
							<button on:click={() => load(src)}>reload</button>
						</slot>
					</Image>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	$prefix: brick-;
	$grid: $prefix + grid;
	$row: $prefix + row;
	$item: $prefix + item;
	$loader: $prefix + loader;

	.#{$grid} {
		--brick-gap: 10px;
		display: flex;
		flex-direction: column;
		box-sizing: content-box;
		overflow: visible;
	}
	.#{$row} {
		width: 100%;
		box-sizing: border-box;
		overflow: visible;
		display: flex;
		flex-wrap: wrap;
		padding: calc(var(--brick-gap) / 2) 0;
		&.left {
			flex-direction: row;
			justify-content: start;
		}
		&.center {
			flex-direction: row;
			justify-content: center;
		}
		&.right {
			flex-direction: row-reverse;
			justify-content: end;
		}
		&:first-child {
			padding-top: 0;
			padding-bottom: calc(var(--brick-gap) / 2);
		}
		&:last-child {
			padding-top: calc(var(--brick-gap) / 2);
			padding-bottom: 0;
		}
		&:first-child.#{$row}:last-child {
			padding: 0;
		}
	}

	.#{$item} {
		box-sizing: border-box;
		overflow: visible;
		padding: 0 calc(var(--brick-gap) / 2);
	}
	.#{$row}.left > .#{$item}:first-child,
	.#{$row}.center > .#{$item}:first-child {
		padding-left: 0;
		padding-right: calc(var(--brick-gap) / 2);
	}
	.#{$row}.left > .#{$item}:last-child,
	.#{$row}.center > .#{$item}:last-child {
		padding-left: calc(var(--brick-gap) / 2);
		padding-right: 0;
	}
	.#{$row}.left > .#{$item}:first-child.#{$item}:last-child,
	.#{$row}.center > .#{$item}:first-child.#{$item}:last-child {
		padding: 0;
	}
	.#{$row}.right > .#{$item}:first-child {
		padding-left: calc(var(--brick-gap) / 2);
		padding-right: 0;
	}
	.#{$row}.right > .#{$item}:last-child {
		padding-left: 0;
		padding-right: calc(var(--brick-gap) / 2);
	}
	.#{$row}.right > .#{$item}:first-child.#{$item}:last-child {
		padding: 0;
	}

	.#{$loader} {
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
