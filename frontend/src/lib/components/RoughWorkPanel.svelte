<script lang="ts">
    import { ChevronDown, ChevronUp } from "lucide-svelte";

    let notes = $state("");
    let greensInput = $state("");
    let yellowsInput = $state("");
    let isCollapsed = $state(true);

    function handleInput(e: Event, setter: (val: string) => void) {
        const input = e.target as HTMLInputElement;
        // Only allow letters, uppercase
        const filtered = input.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
        setter(filtered);
        input.value = filtered; // Force update input display if needed
    }
</script>

<div
    class="w-full lg:max-w-[240px] bg-[#1e1e1e] border-l border-[#333333] rounded-lg lg:rounded-l-none lg:rounded-r-lg flex flex-col h-fit transition-all"
>
    <!-- Header (Clickable on Mobile) -->
    <button
        class="w-full text-center py-4 lg:py-6 border-b border-[#333333] flex items-center justify-center gap-2 cursor-pointer lg:cursor-default"
        onclick={() => (isCollapsed = !isCollapsed)}
        aria-expanded={!isCollapsed}
    >
        <h2 class="text-[#aaaaaa] text-xs font-bold tracking-[1px] uppercase">
            Rough Work
        </h2>
        <!-- Mobile Toggle Icon -->
        <div class="lg:hidden text-[#aaaaaa]">
            {#if isCollapsed}
                <ChevronDown size={14} />
            {:else}
                <ChevronUp size={14} />
            {/if}
        </div>
    </button>

    <!-- Content Area (Hidden on mobile if collapsed, always shown on desktop) -->
    <div class="p-6 relative {isCollapsed ? 'hidden lg:block' : 'block'}">
        <!-- Pre-filled prompts - VISUAL FIX: Removed border-b and flex-1 to prevent line bleeding -->
        <div class="font-mono text-sm space-y-3 mb-8">
            <div class="flex items-center gap-2">
                <span class="text-[#6aaa64] font-bold whitespace-nowrap"
                    >Greens =</span
                >
                <input
                    type="text"
                    bind:value={greensInput}
                    oninput={(e) => handleInput(e, (v) => (greensInput = v))}
                    class="w-24 bg-transparent text-[#6aaa64] font-bold outline-none px-1 uppercase"
                    placeholder="---"
                />
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[#c9b458] font-bold whitespace-nowrap"
                    >Yellows =</span
                >
                <input
                    type="text"
                    bind:value={yellowsInput}
                    oninput={(e) => handleInput(e, (v) => (yellowsInput = v))}
                    class="w-24 bg-transparent text-[#c9b458] font-bold outline-none px-1 uppercase"
                    placeholder="---"
                />
            </div>
        </div>

        <!-- Free-form writing area -->
        <div class="mt-4">
            <textarea
                bind:value={notes}
                placeholder="Type your deductions here..."
                class="w-full h-[320px] bg-transparent text-[#d4d4d4] font-mono text-sm resize-none outline-none placeholder:text-gray-600"
                style="caret-color: #6aaa64;"
            ></textarea>
        </div>
    </div>
</div>
