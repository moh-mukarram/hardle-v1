<script lang="ts">
    import { signup, login } from "$lib/utils/api";
    import { getAuthStore } from "$lib/state/auth.svelte";
    import { goto } from "$app/navigation";
    import { Loader2, User } from "lucide-svelte";
    import AuthInput from "$lib/components/AuthInput.svelte";
    import { fly } from "svelte/transition";

    let isLogin = $state(true); // Toggle between Login and Signup
    let username = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let errorMsg = $state("");
    let passwordError = $state("");
    let loading = $state(false);

    const auth = getAuthStore();

    async function handleSubmit(e: Event) {
        e.preventDefault();
        loading = true;
        errorMsg = "";
        passwordError = "";

        if (!isLogin && password !== confirmPassword) {
            passwordError = "Passwords do not match";
            loading = false;
            return;
        }

        try {
            if (isLogin) {
                const user = await login(email, password);
                auth.setUser(user);
            } else {
                const user = await signup(username, email, password);
                auth.setUser(user);
            }
            // TODO: goto("/select-mode") — route not yet created
        } catch (err: any) {
            errorMsg = err.message || "An error occurred";
        } finally {
            loading = false;
        }
    }
</script>

<div class="mb-6 text-center">
    <h2 class="text-sm font-medium text-slate-400 tracking-wide uppercase">
        {isLogin ? "Log in to your account" : "CREATE NEW CLEARANCE"}
    </h2>
</div>

<form onsubmit={handleSubmit} class="w-full flex flex-col gap-5">
    {#if isLogin}
        <div in:fly={{ y: 10, duration: 300, delay: 0, opacity: 0 }}>
            <AuthInput
                id="email"
                name="email"
                type="text"
                label="Username or Email"
                placeholder="Enter your credentials"
                bind:value={email}
                required
            />
        </div>

        <div
            in:fly={{ y: 10, duration: 300, delay: 50, opacity: 0 }}
            class="flex flex-col gap-1.5"
        >
            <AuthInput
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter password"
                bind:value={password}
                required
            />
            <div class="flex justify-between items-center text-xs px-1 mt-1">
                <a
                    href="#/"
                    class="text-slate-500 hover:text-cyan-400 transition-colors font-medium tracking-wide cursor-pointer"
                >
                    Forgot Password?
                </a>
                <button
                    type="button"
                    onclick={() => {
                        isLogin = false;
                        errorMsg = "";
                        passwordError = "";
                    }}
                    class="text-slate-500 hover:text-cyan-400 transition-colors font-medium tracking-wide"
                >
                    Create Account
                </button>
            </div>
        </div>

        {#if errorMsg}
            <span
                in:fly={{ y: -4, duration: 200 }}
                class="text-xs text-red-500 font-medium text-center"
            >
                {errorMsg}
            </span>
        {/if}

        <button
            type="submit"
            disabled={loading}
            class="mt-4 w-full h-12 relative overflow-hidden rounded-md group bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 font-bold tracking-widest uppercase text-sm shadow-[0_0_20px_-5px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {#if loading}
                <Loader2 class="w-5 h-5 animate-spin text-cyan-400" />
            {:else}
                <span class="relative z-10 block">Log in</span>
                <div
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"
                ></div>
            {/if}
        </button>

        <div
            in:fly={{ y: 10, duration: 300, delay: 150, opacity: 0 }}
            class="flex flex-col gap-3 mt-4 pt-6 border-t border-slate-800/60 relative"
        >
            <div
                class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050810] px-2 text-[10px] text-slate-600 font-mono tracking-widest"
            >
                OR CONTINUE WITH
            </div>

            <button
                type="button"
                class="w-full h-10 bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-3 rounded-md group"
            >
                <div
                    class="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors"
                >
                    <span class="text-[10px] font-bold text-slate-300">G</span>
                </div>
                Google Account
            </button>

            <button
                type="button"
                onclick={() => {
                    /* TODO: goto("/game") — route not yet created */
                }}
                class="w-full h-10 bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-3 rounded-md active:scale-[0.99]"
            >
                <User class="w-4 h-4 text-slate-500" />
                Guest Access
            </button>
        </div>

        <p
            in:fly={{ y: 10, duration: 300, delay: 200, opacity: 0 }}
            class="text-center text-slate-600 font-mono mt-2 text-[12px]"
        >
            Guest sessions are temporary and will not be saved.
        </p>
    {:else}
        <div in:fly={{ y: 10, duration: 300, delay: 0, opacity: 0 }}>
            <AuthInput
                id="username"
                name="username"
                type="text"
                label="Agent ID (Username)"
                placeholder="Choose a username"
                bind:value={username}
                required
            />
        </div>

        <div in:fly={{ y: 10, duration: 300, delay: 50, opacity: 0 }}>
            <AuthInput
                id="email"
                name="email"
                type="text"
                label="Secure Channel (Email)"
                placeholder="user@example.com"
                bind:value={email}
                required
            />
        </div>

        <div
            in:fly={{ y: 10, duration: 300, delay: 100, opacity: 0 }}
            class="grid grid-cols-2 gap-4"
        >
            <AuthInput
                id="password"
                name="password"
                type="password"
                label="Access Key"
                placeholder="Create password"
                bind:value={password}
                required
            />
            <AuthInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Verify Key"
                placeholder="Confirm password"
                bind:value={confirmPassword}
                error={passwordError}
                required
            />
        </div>

        {#if errorMsg}
            <span
                in:fly={{ y: -4, duration: 200 }}
                class="text-xs text-red-500 font-medium text-center"
            >
                {errorMsg}
            </span>
        {/if}

        <div
            in:fly={{ y: 10, duration: 300, delay: 150, opacity: 0 }}
            class="pt-4"
        >
            <button
                type="submit"
                disabled={loading ||
                    (password !== "" &&
                        confirmPassword !== "" &&
                        password !== confirmPassword)}
                class="w-full h-12 relative overflow-hidden rounded-md group bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 font-bold tracking-widest uppercase text-sm shadow-[0_0_20px_-5px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {#if loading}
                    <Loader2 class="w-5 h-5 animate-spin text-cyan-400" />
                {:else}
                    <span class="relative z-10 block">Create Access</span>
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"
                    ></div>
                {/if}
            </button>
        </div>

        <div
            in:fly={{ y: 10, duration: 300, delay: 200, opacity: 0 }}
            class="flex justify-center mt-6"
        >
            <span
                class="text-slate-500 text-xs font-medium tracking-wide flex items-center gap-1"
            >
                Already have clearance?
                <button
                    type="button"
                    onclick={() => {
                        isLogin = true;
                        errorMsg = "";
                        passwordError = "";
                    }}
                    class="text-cyan-500 hover:text-cyan-300 transition-colors font-bold hover:underline decoration-cyan-500/30 underline-offset-4"
                >
                    Log In
                </button>
            </span>
        </div>
    {/if}
</form>
