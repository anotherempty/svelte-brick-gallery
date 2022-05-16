<script>
  import Gallery from "svelte-brick-gallery";

  /**
   * @type {string | any[]}
   */
  let images;

  let height = 120;
  let pad = 10;

  const scale = (w, h) => {
    return Math.floor((height * w) / h);
  };

  const load = (async () => {
    let res = await fetch(`https://picsum.photos/v2/list?page=1&limit=30`);

    images = (await res.json()).map((img) => ({
      src: `https://picsum.photos/id/${img.id}/${
        scale(img.width, img.height) + pad
      }/${height + pad}`,
      id: img.id,
      width: img.width,
      height: img.height,
    }));

    return images;
  })();

  let page = 4;
  const more = async () => {
    let res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`);

    images = images.concat(
      (await res.json()).map((img) => ({
        src: `https://picsum.photos/id/${img.id}/${
          scale(img.width, img.height) + pad
        }/${height + pad}`,
        width: img.width,
        height: img.height,
        author: img.author,
      }))
    );
    page++;

    return images;
  };

  let scroll = 0;
  let winHeight = 0;
  let bodyHeight = 0;
  let o = 0;

  $: if (scroll > 0 && winHeight > 0) {
    if (Math.ceil(scroll + winHeight) >= bodyHeight) {
      more();
    }
  };
</script>

<svelte:window
  bind:scrollY={scroll}
  bind:innerHeight={winHeight}
/>

<div class="flex" bind:clientHeight={bodyHeight}>
  <div class="w-1/3">
    <div class="w-1/3 h-screen fixed">
      {scroll}
      <button on:click={() => more()}> load </button>
      {winHeight} <br />
      {bodyHeight}
    </div>
  </div>
  <div class="flex-1 overflow-visible">
    {#await load}
      loading...
    {:then data}
      <div style="">
        <Gallery
          {images}
          justify="left"
          itemHeight={150}
          itemWidth={500}
          gap={16}
        >
          <div
            slot="image"
            let:index
            let:style
            style="height:100%; position:relative;"
          >
            <img
              src={images[index].src}
              style={style + "  border-radius: 12px;"}
              alt={index}
            />
          </div>
        </Gallery>
      </div>
    {:catch}
      loading error
    {/await}
  </div>
</div>

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
