<script>
  import OpenAI from "openai";
  import { connect, setKey, chat, vision } from "$lib/OpenAI";

  import { onMount } from "svelte";

  let { customEvt, num } = $props();
  const models = $state(["OpenAI", "Gemeni"]);
  let apiKey = $state(null);

  let curModel = $state(0);
  let checkingKey = $state(false);

  async function checkKey() {
    console.log("checking key", apiKey);
    // connect(apiKey);
    customEvt();
  }

  onMount(() => {
    console.log(num);
    num++;
    console.log(num);
  });
</script>

<div class="flex gap-1 w-full p-2">
  <!-- change popover-1 and --anchor-1 names. Use unique names for each dropdown -->
  <button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1">
    {models[curModel]}
  </button>
  <ul
    class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
    popover
    id="popover-1"
    style="position-anchor:--anchor-1"
  >
    <li><a>Open</a></li>
    <li><a>Item 2</a></li>
  </ul>
  <!--
  <div
    onkeydown={(e) => {
      e.preventDefault();
    }}
    contenteditable
    class="flex-1 overflow-x-scroll bg-white rounded-md p-2 text-nowrap"
  ></div>
>-->
  <input
    bind:value={apiKey}
    type="password"
    class="input flex-1"
    required
    placeholder="Enter an API Key"
  />
  <button class="btn" disabled={!apiKey} onclick={checkKey}>Check</button>
  <!--
  <button
    class="bg-blue-700 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600/70"
    >Nana</button
  >
>-->
</div>
