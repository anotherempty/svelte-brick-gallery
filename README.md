# Svelte Brick Gallery

A masonry-like image gallery component for svelte

[See the Demo](https://anotherempty.github.io/svelte-brick-gallery/)

![Preview Image](https://i.ibb.co/6yt6sK8/preview.jpg "Preview Image")

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

<Gallery {images}/>
```

### Props

| Props      | Type    | Description                                                                      | Default |
|------------|---------|----------------------------------------------------------------------------------|---------|
| images     | array   | an array of { src } objects containing the path or url of each images to display | []      |
| itemWidth  | number | default display width in pixel of an image                                       | 300     |
| itemHeight | number | display height in pixel of an image                                              | 200     |
| gap        | number | margin in pixel between images                                                 | 10      |
| justify    | string  | alignment, can be : left, center or right                          | left    |
| delay    | number  | duration of an image's loading animation in milliseconds                          | 1000    |

### example 1

If the width and height of the images are known beforehand, include them in the array of objects

```svelte
<script>
  import Gallery from "svelte-brick-gallery";

  // an array of { src, width, height } objects
  let images = [{src, width, height}];

</script>

<Gallery {images}/>
```
[See the REPL](https://svelte.dev/repl/fa9eef6cd0d44334a25d6042b34a1d3c?version=3.48.0)

### example 2

An `image slot` is available if you want to customize the render and interaction of the image. 

```svelte
<script>
  import Gallery from "svelte-brick-gallery";

  // an array of objects with a 'src', 'width' and 'height' properties
  let images = [{src, width, height}];

</script>

<Gallery {images}>
  <div slot="image" let:index let:style let:displayWidth let:displayHeight style="height: 100%;">
    <img src={images[index].src} {style} alt={images[index].width + 'x' + images[index].height}>
  </div>
</Gallery>
```

**`let:index`**: the index of an image inside the array. <br>
**`let:style`**: the default style which sets the image to cover the whole area using `object-fit: cover;` . <br>
**`let:displayWidth`**: the rendered width (content and padding) in pixel of the box containing the image. <br>
**`let:displayHeight`**: the rendered height in pixel of the box containing the image. <br>

[See the REPL](https://svelte.dev/repl/1ebd308fd65f48d385195f18be9543f0?version=3.48.0)

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
  <div slot="error" let:load let:src>
    <button on:click={() => load(src)}>reload</button>
  </div>
</Gallery>
```
The `loading slot` allows to add a custom loading animation for each images.<br>
The `error slot` allows to display an error message when the image has failed to load and provides a *`load`* function that can reload the image. <br>

[See the REPL](https://svelte.dev/repl/32ab548ff35d4002ac2c3ea35f98812b?version=3.48.0)

## License

Distributed under the MIT License


