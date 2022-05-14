# Svelte Brick Gallery

An image gallery (masonry-like) component for svelte

[See the Demo](https://anotherempty.github.io/svelte-brick-gallery/)

## Installation

```sh
npm install svelte-brick-gallery
```

## Usage

The component has an `images` prop that takes an array of objects with a *src* property, which contains a path or an url of each image

```svelte
<script>
  import Gallery from "svelte-brick-gallery";

  // an array of { src } objects
  let images = [{ src: "1.jpg" }, { src: "2.jpg" }, ...];

</script>

<Gallery {images}>
```

### example 1

If the width and height of the images are known beforehand, include them in the array of objects

```svelte
<script>
  import Gallery from "svelte-brick-gallery";

  // an array of { src, width, height } objects
  let images = [{src, width, height}];

</script>

<Gallery {images}>
```

### example 2

An `image slot` is available if you want to customize the render and interaction of the image. 

```svelte
<script>
  import Gallery from "svelte-brick-gallery";

  // an array of objects with a 'src', 'width' and 'height' properties
  let images = [{src, width, height}];

</script>

<Gallery {images}>
  <div slot="image" let:index let:style style="height: 100%;">
    <img src={images[index].src} {style} alt={images[index].width + 'x' + images[index].height}>
  </div>
</Gallery>
```

By using the **image** slot, the default style of the image is available with the `let:style` directive, which sets the image to cover the whole area using `object-fit: cover;` . <br>
The `let:index` should be self explanatory.

### example 3

Two (2) more slots are available : `loading` and `error`
```svelte
<script>
  import Gallery from "svelte-brick-gallery";

  // an array of objects with a 'src', 'width' and 'height' properties
  let images = [{src, width, height}];

</script>

<Gallery {images}>
  <div slot="loading">
    ...loading
  </div>
  <div slot="image" let:index let:style style="height: 100%;">
    <img src={images[index].src} {style} alt={images[index].width + 'x' + images[index].height}>
  </div>
  <div slot="error" let:load let:src let:error>
    <button on:click={() => load(src)}>reload</button>
  </div>
</Gallery>
```

The `loading slot` allows to add a custom loading animation for the image.<br>
The `error slot` allows to display an error message when the image has failed to load and provides a *load* function that can reload the image. <br>
`let:error` is an *event* error dispatched when the image wasn't loaded properly

## License

MIT


