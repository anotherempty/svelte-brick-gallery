import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, data }) {
	const res = await fetch(`https://picsum.photos/v2/list?page=2&limit=5`);

	if (res.ok) {
		const imgs = (await res.json()).map((img) => ({
			src: img.download_url,
			width: img.width,
			height: img.height
		}));
		console.log(imgs);
		return {
			images: imgs,
			test: 'test'
		};
	}

	throw error(404, 'Not found');
}
