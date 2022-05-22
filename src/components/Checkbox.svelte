<script>
  export let checked = false;
</script>

<label class="checkbox flex items-center my-2">
  <input type="checkbox" bind:checked />
  <slot />
</label>

<style>
  .checkbox {
    --primary: var(--color-primary);
    --bg-1: var(--text-default);
    --bg-2: var(--color-3);
    --width: 22px;
    --height: 22px;
    --radius: 50%;
  }
  label:hover{
    color:var(--primary);
  }
  input[type="checkbox"] {
    appearance: none;
    margin: 0;
    margin-right: 8px;
    font: inherit;
    width: var(--width);
    height: var(--height);
    border: 3px solid var(--bg-1);
    border-radius: var(--radius);
    position: relative;
    box-sizing: border-box;
  }

  input[type="checkbox"]::after {
    content: "";
    width: var(--width);
    height: var(--height);
    background-color: var(--primary);
    z-index: -1;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    position: absolute;
    border-radius: 50%;
    outline: 8px solid var(--primary);
    opacity: 0;
    box-sizing: border-box;
  }

  input[type="checkbox"]::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    -webkit-clip-path: polygon(
      14% 44%,
      0 65%,
      50% 100%,
      100% 16%,
      80% 0%,
      43% 62%
    );
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    left: 50%;
    top: 50%;
    transform: scale(0) translate3d(-50%, -50%, 0);
    transform-origin: top left;
    transition: 120ms transform ease-in-out;
    position: absolute;
    background-color: var(--bg-1);
  }

  input[type="checkbox"]:checked::before {
    transform: scale(1) translate3d(-50%, -50%, 0);
  }

  input[type="checkbox"]:focus {
    outline: none;
  }
  input[type="checkbox"]:hover {
    border-color: var(--primary);
  }
  input[type="checkbox"]:focus:checked {
    background-color: var(--primary);
    border-color: var(--primary);
  }
  input[type="checkbox"]:checked {
    background-color: var(--bg-2);
    border-color: var(--bg-2);
  }
  input[type="checkbox"]:checked:hover {
    background-color: var(--primary);
    border-color: var(--primary);
  }

  input[type="checkbox"]:hover:checked::before{
    background-color: var(--bg-2);
  }
  input[type="checkbox"]:focus::before{
    background-color: var(--bg-2);
  }

  input[type="checkbox"]:focus::after {
    opacity: 0.3;
  }

  input[type="checkbox"]:disabled {
    cursor: not-allowed;
  }
</style>
