<script>
  export let value = 0;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let classes = "";
</script>

<div class="slider flex items-center flex-1 {classes}">
  <input
    type="range"
    class="flex-1"
    style="--value:{((value - min) * 100) / (max - min)}%;"
    bind:value
    {min}
    {max}
    {step}
  />
</div>

<style>
  .slider {
    --primary: var(--color-primary);
    --bg-1: var(--color-3);
    --bg-2: var(--color-4);
  }

  input[type="range"] {
    --value: 0%;
    --track-height: 3px;
    --thumb-width: 22px;
    --thumb-height: 22px;
    --lower-color: var(--primary);
    --upper-color: var(--bg-2);
    --thumb-color: var(--primary);
    --track-round: 0px;
    --thumb-round: 24px;
    -webkit-appearance: none;
    margin: 4px 2px;
    height: var(--thumb-height);
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: var(--track-height);
    background-color: var(--upper-color);
    background-image: linear-gradient(var(--lower-color), var(--lower-color));
    background-size: var(--value) 100%;
    background-repeat: no-repeat;
    border-radius: var(--track-round);
  }
  input[type="range"]::-webkit-slider-thumb {
    height: var(--thumb-height);
    width: var(--thumb-width);
    border-radius: var(--thumb-round);
    background-color: var(--thumb-color);
    -webkit-appearance: none;
    margin-top: -10px;
    position: relative;
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: var(--track-height);
    background: var(--bg-color);
    border-radius: var(--track-round);
  }
  input[type="range"]::-moz-range-thumb {
    height: var(--thumb-height);
    width: var(--thumb-width);
    border-radius: var(--thumb-round);
    background-color: var(--thumb-color);
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: var(--track-height);
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: #3071a9;
    border-radius: var(--track-round);
  }
  input[type="range"]::-ms-fill-upper {
    background: var(--bg-color);
    border-radius: var(--track-round);
  }
  input[type="range"]::-ms-thumb {
    height: var(--thumb-height);
    width: var(--thumb-width);
    border-radius: var(--thumb-round);
    background-color: var(--thumb-color);
  }
  input[type="range"]:focus::-ms-fill-lower {
    background-color: var(--lower-color);
  }
  input[type="range"]:focus::-ms-fill-upper {
    background-color: var(--upper-color);
  }
</style>
