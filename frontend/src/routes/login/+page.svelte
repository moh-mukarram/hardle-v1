<script lang="ts">
    import AuthForm from "$lib/components/AuthForm.svelte";
    import { getMe } from "$lib/utils/api";
    import { getAuthStore } from "$lib/state/auth.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { fly } from "svelte/transition";

    const auth = getAuthStore();
    let mounted = $state(false);

    onMount(async () => {
        mounted = true;
        try {
            const user = await getMe();
            auth.setUser(user);
            if (auth.isAuthenticated) {
                // TODO: goto("/select-mode") — route not yet created
            }
        } catch {
            auth.setUser(null);
        }
    });

    let subtitle = "AUTHENTICATION PROTOCOL";
</script>

<div
    class="min-h-screen w-full bg-[#050810] text-slate-200 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-200"
>
    <!-- 1. Background System -->
    <div class="absolute inset-0 z-0">
        <!-- Deep radial gradient for depth -->
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-[#050810] to-[#050810]"
        ></div>

        <!-- Subtle cyan ambient glow (top center) -->
        <div
            class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full opacity-50"
        ></div>

        <!-- Noise Texture -->
        <div
            class="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
            style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNTYnIGhlaWdodD0nMjU2Jz48ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuOScgbnVtT2N0YXZlcz0nMycgc3RpdGNoVGlsZXM9J3N0aXRjaCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNub2lzZSknIG9wYWNpdHk9JzAuNScvPjwvc3ZnPg==')"
        ></div>
    </div>

    <!-- Main Content Container -->
    {#if mounted}
        <div
            in:fly={{ y: 12, duration: 400, opacity: 0 }}
            class="w-full max-w-[400px] flex flex-col relative z-10"
        >
            <!-- Logo Section -->
            <div class="flex flex-col items-center mb-10">
                <div
                    in:fly={{ y: 5, duration: 500, delay: 100, opacity: 0 }}
                    class="relative"
                >
                    <!-- Soft ambient glow behind logo -->
                    <div
                        class="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full scale-150 opacity-20 animate-[pulse_3s_ease-in-out_infinite]"
                    ></div>

                    <h1
                        class="font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-br from-cyan-100 to-cyan-600 drop-shadow-lg select-none text-[64px] font-mono"
                    >
                        HARDLE
                    </h1>
                </div>

                <p
                    in:fly={{ duration: 400, delay: 300, opacity: 0 }}
                    class="mt-3 text-xs font-mono text-cyan-500/50 tracking-[0.3em] uppercase"
                >
                    {subtitle}
                </p>
            </div>

            <!-- Card/Form Area -->
            <div class="w-full flex flex-col">
                <AuthForm />
            </div>
        </div>

        <!-- Footer / Copyright / Version -->
        <div
            in:fly={{ duration: 1000, delay: 800, opacity: 0 }}
            class="absolute bottom-6 text-[10px] font-mono text-slate-700 tracking-wider mix-blend-plus-lighter"
        >
            SECURE TERMINAL ACCESS v2.0
        </div>
    {/if}
</div>
