<script lang="ts">
  import { onMount } from "svelte";
    import InputText from "./InputText.svelte";
    let keyValid = $state(false);
    let countNum = $state(0);
    let waitInterval = $state(null);

    function loadKey(){
        keyValid = true;
    }

    function startWaitCount(){
        waitInterval = setInterval(() => {
            countNum++;
        }, 1000);
    }

    function waitCount(){
        countNum++;
    }

    function stopCount(){
        countNum = 0;
        clearInterval(waitInterval);
        waitInterval = null;
    }

    onMount(() => {
        console.log("LLMs component mounted");
        startWaitCount();
    });

</script>
<div class="flex flex-1 h-full flex-col">
    <div class="bg-red-400 rounded-md"></div>
    <InputText customEvt={loadKey} />
    {#if !keyValid}
        <div class="bg-yellow-700 p-3 flex flex-1 h-full justify-center items-center">
            {#if countNum > 0}
                <span class="bg-white/40 p-2 rounded">Waiting for response:&nbsp;</span>
                <span class="countdown">
                    <span style={`--value:${countNum};`} aria-live="polite" aria-label={`${countNum}`}>{countNum}</span>
                </span>
            {/if}
            <span>no connection</span>
        
        </div>
    {/if}
</div>