<template>
    <div class="d-flex flex-column min-vh-100">
        <header class="bg-light p-3 shadow">
            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="container">
                    <router-link class="navbar-brand" to="/">ALARM CLOCK</router-link>
                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item" v-if="!isProfilePage">
                                <router-link class="nav-link" to="/login">Log In</router-link>
                            </li>
                            <li class="nav-item" v-if="!isProfilePage">
                                <router-link class="nav-link" to="/register">Register</router-link>
                            </li>
                            <li class="nav-item" v-if="!isProfilePage">
                                <router-link class="nav-link" to="/profile">Profile</router-link>
                            </li>
                            <li class="nav-item" v-if="$route.path === '/' || isProfilePage || !isLoggedIn">
                                <router-link class="nav-link" to="/alarms">Alarms</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

        <router-view class="flex-grow-1 container"></router-view>

        <footer class="text-white text-center py-4 mt-auto">
            <p>Alarm Clock © 2025</p>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            isLoggedIn: !!localStorage.getItem('token'),
        };
    },
    computed: {
        isProfilePage() {
            return this.$route.path === '/profile' && this.isLoggedIn;
        },
    },
    created() {
        // Слухати події login і logout
        window.addEventListener('auth:login', this.handleLogin);
        window.addEventListener('auth:logout', this.handleLogout);
        // Перевірити початковий стан
        this.checkAuth();
    },
    beforeDestroy() {
        window.removeEventListener('auth:login', this.handleLogin);
        window.removeEventListener('auth:logout', this.handleLogout);
    },
    methods: {
        checkAuth() {
            const token = localStorage.getItem('token');
            this.isLoggedIn = !!token;
            console.log('checkAuth: isLoggedIn:', this.isLoggedIn, 'Token:', token, 'Route:', this.$route.path);
        },
        handleLogin() {
            this.checkAuth();
        },
        handleLogout() {
            this.checkAuth();
        },
    },
};
</script>

<style scoped>
@import './assets/style.css';
</style>