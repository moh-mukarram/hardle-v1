<script lang="ts">
    import { Eye, EyeOff } from "lucide-svelte";
    import { fly } from "svelte/transition";

    let {
        id,
        name,
        type = "text",
        label,
        placeholder,
        value = $bindable(),
        error = "",
        required = false,
        class: className = ""
    } = $props();

    let showPassword = $state(false);
    let isFocused = $state(false);

    let isPassword = $derived(type === "password");
    let inputType = $derived(isPassword ? (showPassword ? "text" : "password") : type);
</script>

<div class="group flex flex-col gap-1.5 w-full relative">
    {#if label}
        <label
            for={id}
            class="text-xs font-semibold tracking-wide uppercase transition-colors duration-200 ml-1 {isFocused ? 'text-cyan-400' : 'text-slate-500'}"
        >
            {label}
        </label>
    {/if}

    <div class="relative w-full">
        <!-- Input container for styling -->
        <div
            class="relative w-full rounded-lg transition-all duration-200 ease-out bg-slate-900/40 border shadow-sm 
            {isFocused ? 'border-cyan-500/50 shadow-[0_0_0_4px_rgba(6,182,212,0.1)] bg-slate-900/80' : 'border-slate-800/60 group-hover:border-slate-700/80 group-hover:bg-slate-900/60'} 
            {error ? 'border-red-500/50 focus-within:border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : ''}"
        >
            <input
                {id}
                {name}
                type={inputType}
                {placeholder}
                bind:value={value}
                {required}
                onfocus={() => (isFocused = true)}
                onblur={() => (isFocused = false)}
                class="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 font-medium tracking-wide outline-none border-none ring-0 caret-cyan-400 transition-opacity duration-200 {className}"
            />

            <!-- Password Toggle Button -->
            {#if isPassword}
                <button
                    type="button"
                    onclick={() => (showPassword = !showPassword)}
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-slate-800/50"
                    tabindex="-1"
                >
                    {#if showPassword}
                        <EyeOff class="h-4 w-4" />
                    {:else}
                        <Eye class="h-4 w-4" />
                    {/if}
                </button>
            {/if}
        </div>

        <!-- Subtle bottom highlight line on focus -->
        <div
            class="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none transition-all duration-250 ease-out origin-center"
            style="transform: scaleX({isFocused ? 1 : 0}); opacity: {isFocused ? 1 : 0};"
        ></div>
    </div>

    {#if error}
        <span
            in:fly={{ y: -4, duration: 200 }}
            class="text-xs text-red-400 font-medium ml-1 flex items-center gap-1"
        >
            <span class="w-1 h-1 rounded-full bg-red-400 inline-block"></span>
            {error}
        </span>
    {/if}
</div>
