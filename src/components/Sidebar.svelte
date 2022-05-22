<script>
  import Range from "./Range.svelte";
  import Checkbox from "./Checkbox.svelte";
  import GithubLogo from "../assets/GithubLogo.svg";

  import { theme } from "../lib/theme.js";
  import { rounded, animated, hoverEffect, infiniteLoad } from "../lib/props";

  export let gap = 0;
  export let itemHeight;
  export let justify;

  let justifyIndex = 1;

  $: justify = ["left", "center", "right"][justifyIndex];
</script>

<div
  class="fixed w-1/4 flex flex-col h-screen bg-color-2"
  style="transition: background-color 250ms ease-out;"
>
  <div class="flex-1 p-4">
    <h1 class="text-2xl flex items-center gap-4">
      <span>Svelte Brick Gallery </span>
      <a
        href="https://github.com/anotherempty/svelte-brick-gallery"
        title="See on Github"
        ><GithubLogo
          style="display:inline-block; fill:var(--text-default);"
          height={28}
        /></a
      >
    </h1>
    <h3 class="text-lg mt-4">Props</h3>
    <div class="grid grid-cols-4">
      <div>gap</div>
      <Range classes="col-span-2" min={0} max={48} step={1} bind:value={gap} />
      <input type="number" min={0} max={48} step={1} bind:value={gap} />
      <div>itemHeight</div>
      <Range
        classes="col-span-2"
        min={100}
        max={500}
        bind:value={itemHeight}
        step={10}
      />
      <input
        type="number"
        min={100}
        max={500}
        bind:value={itemHeight}
        step={10}
      />
      <div>justify</div>
      <Range classes="col-span-2" min={0} max={2} bind:value={justifyIndex} />
      <input type="text" readonly value={justify} />
    </div>
    <h3 class="text-lg mt-4">Things you can easily add yourself</h3>
    <div><Checkbox bind:checked={$rounded}>border radius</Checkbox></div>
    <div><Checkbox bind:checked={$animated}>loading animation</Checkbox></div>
    <div><Checkbox bind:checked={$hoverEffect}>hover effect</Checkbox></div>
    <div>
      <Checkbox bind:checked={$infiniteLoad}>infinite loading</Checkbox>
    </div>
    <div>And more ...</div>
  </div>
  <div class="px-4 py-1">
    <button
      class="px-2 appearance-none"
      on:click={() => {
        $theme = $theme === "dark" ? "light" : "dark";
      }}>{$theme === "dark" ? "light" : "dark"}</button
    >
  </div>
</div>

<style>
  input[type="text"] {
    appearance: none;
    background-color: var(--color-3);
    border: none;
    padding: 2px;
    margin: 2px 0;
  }
  input[type="number"] {
    appearance: none;
    background-color: var(--color-3);
    border: none;
    padding: 0 4px;
    margin: 2px 0;
    cursor: pointer;
  }
  input[type="number"]:focus {
    outline: none;
    border: none;
    color: var(--color-primary);
  }
  input[type="text"]:focus {
    outline: none;
    border: none;
    color: var(--color-primary);
  }
</style>
