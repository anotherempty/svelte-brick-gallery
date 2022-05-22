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
    id="overlay"
    class="fixed h-screen w-full top-0 transparent backdrop-blur-md z-10 p-10"
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

<style>
  #overlay::before {
    content: "";
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    position: absolute;
    background-color: var(--color-1);
    opacity: 0.6;
    z-index: -1;
  }
</style>
