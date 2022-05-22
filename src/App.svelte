<script>
  import { onMount } from "svelte";

  import Gallery from "./components/Gallery.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Viewer from "./components/Viewer.svelte";
  import Spinner from "./components/Spinner.svelte";

  import { theme } from "./lib/theme";
  import { infiniteLoad } from "./lib/props";

  let images = [];
  let itemHeight = 150;
  let gap = 0;
  let justify = "left";

  let pad = 10;

  const scale = (w, h) => {
    return Math.floor((itemHeight * w) / h);
  };

  let page = 1;
  const getImages = async () => {
    let limit = 20;
    if (page === 1) {
      limit = 40;
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

    if (limit === 40) {
      page = 2;
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
      if ($infiniteLoad) {
        getImages();
      }
    }
  }

  let currentTheme = $theme;

  const setTheme = (theme) => {
    if (theme === currentTheme) return;
    document.body.classList.remove(currentTheme);
    currentTheme = theme;
    document.body.classList.add(currentTheme);
  };

  onMount(() => {
    if (window.matchMedia) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        $theme = "dark";
      }
    }
    setTheme($theme);
  });

  $: setTheme($theme);

  $: window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      $theme = event.matches ? "dark" : "light";
    });
</script>

<svelte:window bind:scrollY bind:innerHeight={winHeight} />

<div class="flex overflow-x-clip txt-default" bind:clientHeight={bodyHeight}>
  <div class="w-1/4">
    <Sidebar bind:gap bind:itemHeight bind:justify />
  </div>
  <div class="flex-1 justify-center items-center">
    {#await load}
      <Spinner />
    {:then}
      <Gallery {images} {itemHeight} {gap} {justify} />
    {:catch}
      loading error
    {/await}
  </div>
</div>

<Viewer />

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    transition: background-color 250ms ease-out;
    background-color: var(--color-1);
  }

  :root {
    --color-1: black;
    --color-2: black;
    --color-3: black;
    --color-4: black;
    --color-primary: orange;
    --text-default: black;
    --text-secondary: black;
  }

  .dark {
    --color-1: #1e1e1e;
    --color-2: #272727;
    --color-3: #353535;
    --color-4: #505050;
    --color-primary: #02c9c9;
    --text-default: #a8a8a8;
    --text-secondary: #505050;
  }

  .light {
    --color-1: #fdf6e3;
    --color-2: #dbd5c1;
    --color-3: #c9c3b3;
    --color-4: #beb7a5;
    --color-primary: #02c9c9;
    --text-default: #6e6d6b;
    --text-secondary: #a79e83;
  }

  .bg-color-1 {
    background-color: var(--color-1);
  }
  .bg-color-2 {
    background-color: var(--color-2);
  }
  .bg-color-3 {
    background-color: var(--color-3);
  }
  .bg-color-4 {
    background-color: var(--color-4);
  }
  .bg-primary {
    background-color: var(--color-primary);
  }
  .txt-default {
    color: var(--text-default);
  }
  .txt-primary {
    color: var(--color-primary);
  }
  .txt-secondary {
    color: var(--text-secondary);
  }
</style>
