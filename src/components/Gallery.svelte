<script>
  import Gallery from "svelte-brick-gallery";
  import { viewedImg } from "../lib/viewedImg";

  export let images;
  export let itemHeight;
  export let gap;
</script>

<div style="padding:16px">
  <Gallery {images} justify="left" {itemHeight} itemWidth={500} {gap}>
    <div
      slot="image"
      let:index
      let:style
      style="height:100%; position:relative;"
    >
      <img
        src={images[index].src}
        style={style + "  border-radius: 12px;"}
        alt={images[index].src}
        on:click={() =>
          ($viewedImg = `https://picsum.photos/id/${images[index].id}/${images[index].width}/${images[index].height}`)}
      />
    </div>
  </Gallery>
</div>
