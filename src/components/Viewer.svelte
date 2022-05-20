<script>
  import Image from "svelte-brick-gallery/Image.svelte";
  import Spinner from "./Spinner.svelte";
  import { viewedImg } from "../lib/viewedImg";

  let viewed = false;

  $: viewed = $viewedImg !== "";
</script>

{#if viewed}
  <div
    class="fixed h-screen w-full top-0 bg-gray-900/75 z-10 backdrop-blur-md p-10"
    on:click={() => ($viewedImg = "")}
  >
    <Image src={$viewedImg}>
      <div slot="loading" class="w-full h-full flex justify-center items-center">
        <Spinner></Spinner>
      </div>
      <div slot="image" let:src class=" w-full h-full">
        <img {src} alt={src} class="object-contain w-full h-full">
      </div>
    </Image>
  </div>
{/if}
