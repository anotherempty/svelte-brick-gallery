<script>
  import { scale, fade } from "svelte/transition";

  import Image from "svelte-brick-gallery/Image.svelte";
  import Spinner from "./Spinner.svelte";
  import { viewedImg } from "../lib/viewedImg";

  let viewed = false;

  $: viewed = $viewedImg !== "";
</script>

{#if viewed}
  <div
    in:scale={{ duration: 250, start: 0.9 }}
    out:fade={{ duration: 275 }}
    class="fixed h-screen w-full top-0 bg-gray-900/75 z-10 backdrop-blur-md p-10"
    on:click={() => ($viewedImg = "")}
  >
    <Image src={$viewedImg} delay={400}>
      <div
        transition:scale={{ duration: 250, start: 0.8 }}
        slot="loading"
        class="w-full h-full flex justify-center items-center"
      >
        <Spinner />
      </div>
      <div
        transition:scale={{ duration: 350, start: 0.8 }}
        slot="image"
        let:src
        class=" w-full h-full"
      >
        <img {src} alt={src} class="object-contain w-full h-full" />
      </div>
    </Image>
  </div>
{/if}
