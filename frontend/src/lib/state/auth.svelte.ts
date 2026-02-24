export interface User {
    username: string;
    email: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

let authState = $state<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
});

export function getAuthStore() {
    return {
        get user() { return authState.user; },
        get isAuthenticated() { return authState.isAuthenticated; },
        get isLoading() { return authState.isLoading; },

        setUser(user: User | null) {
            if (user) {
                authState.user = user;
                authState.isAuthenticated = true;
            } else {
                authState.user = null;
                authState.isAuthenticated = false;
            }
            authState.isLoading = false;
        },

        setLoading(loading: boolean) {
            authState.isLoading = loading;
        }
    };
}
