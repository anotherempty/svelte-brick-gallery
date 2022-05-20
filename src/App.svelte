<script>
  import Gallery from "./components/Gallery.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	import Viewer from "./components/Viewer.svelte";
	import Spinner from "./components/Spinner.svelte";

  let images = [];
  let itemHeight = 150;
  let gap = 16;

  let pad = 10;

  const scale = (w, h) => {
    return Math.floor((itemHeight * w) / h);
  };

  let page = 1;
  const getImages = async () => {
    let limit = 10;
    if (page === 1) {
      limit = 30;
    }
    let res = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
    );

    images = images.concat(
      (await res.json()).map((img) => ({
        src: `https://picsum.photos/id/${img.id}/${
          scale(img.width, img.height) + pad
        }/${itemHeight + pad}`,
        id: img.id,
        width: img.width,
        height: img.height,
      }))
    );

    if (limit === 30) {
      page = 3;
    }
    page++;

    return images;
  };

  const load = getImages();

  let scrollY = 0;
  let winHeight = 0;
  let bodyHeight = 0;

  $: if (scrollY > 0 && winHeight > 0) {
    if (Math.ceil(scrollY + winHeight) >= bodyHeight) {
      console.log("b");
      getImages();
    }
  }

</script>

<svelte:window bind:scrollY bind:innerHeight={winHeight} />

<div class="flex overflow-x-clip" bind:clientHeight={bodyHeight}>
  <div class="w-1/4">
		<Sidebar></Sidebar>
  </div>
  <div class="flex-1 justify-center items-center">
    {#await load}
      <Spinner></Spinner>
    {:then}
			<Gallery {images} bind:itemHeight bind:gap></Gallery>
    {:catch}
      loading error
    {/await}
  </div>
</div>

<Viewer ></Viewer>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  html,
  body {
    margin: 0;
    padding: 0;
  }
</style>
