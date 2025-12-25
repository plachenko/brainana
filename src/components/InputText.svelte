<script>
  import OpenAI from "openai";
  import { onMount } from "svelte";

  const models = $state(["OpenAI"]);

  let curModel = $state(null);

  onMount(() => {
    curModel = models.length > 1 ? null : 0;
  });
</script>

<div class="flex gap-1 w-full p-2">
  <!-- change popover-1 and --anchor-1 names. Use unique names for each dropdown -->
  <button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1">
    Button
  </button>
  <ul
    class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
    popover
    id="popover-1"
    style="position-anchor:--anchor-1"
  >
    <li><a>Item 1</a></li>
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
    type="password"
    class="input"
    required
    placeholder="Enter an API Key"
  />
  <input type="submit" class="btn" value="Check" />
  <!--
  <button
    class="bg-blue-700 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600/70"
    >Nana</button
  >
>-->
</div>
