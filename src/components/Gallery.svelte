<script>
  import { slide } from "svelte/transition";
  import Gallery from "svelte-brick-gallery";
  import { viewedImg } from "../lib/viewedImg";
  import { rounded, animated, hoverEffect } from "../lib/props";

  export let images;
  export let itemHeight;
  export let gap;
  export let justify;

  function animate(node, options) {
    if ($animated) {
      return options.animation(node, options);
    }
  }
</script>

<div style="padding:{gap < 20 ? gap : 20}px">
  <Gallery {images} {justify} {itemHeight} itemWidth={500} {gap}>
    <div
      slot="loading"
      class="loader"
      class:rounded={$rounded}
      style="height:100%;"
    />
    <div
      slot="image"
      let:index
      let:style
      style="height:100%; position:relative;"
    >
      <img
        transition:animate={{ animation: slide, duration: 225 }}
        src={images[index].src}
        class:rounded={$rounded}
        class:hoverable={$hoverEffect}
        style={style + "position:relative;"}
        alt={images[index].src}
        on:click={() =>
          ($viewedImg = `https://picsum.photos/id/${images[index].id}/${images[index].width}/${images[index].height}`)}
      />
    </div>
  </Gallery>
</div>

<style>
  .rounded {
    border-radius: 12px;
  }
  .loader {
    background-color: #dddddd;
    animation: loader 3.2s ease-in-out infinite;
  }
  .hoverable:hover {
    transform: scale3d(1.1, 1.1, 1);
    z-index: 20;
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
