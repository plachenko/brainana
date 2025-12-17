<script>
  import OpenAI from "openai";
  import { onMount } from "svelte";

  onMount(() => {});
</script>

<div class="flex gap-1 bg-blue-300 w-full p-2">
  <div
    onkeydown={(e) => {
      e.preventDefault();
    }}
    contenteditable
    class="flex-1 overflow-x-scroll bg-white rounded-md p-2 text-nowrap"
  ></div>
  <button
    class="bg-blue-700 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600/70"
    >Nana</button
  >
</div>
