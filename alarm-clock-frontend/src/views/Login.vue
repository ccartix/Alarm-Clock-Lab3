<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-6 bg-white p-4 rounded shadow">
                <h2 class="text-center fw-bold mb-4">Log In</h2>
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="form.email" type="email" class="form-control" id="email" required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input v-model="form.password" type="password" class="form-control" id="password" required />
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Log In</button>
                </form>
                <p class="text-center mt-3">
                    Don't have an account? <router-link to="/register">Register here</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'Login',
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:3000/api/login', this.form);
                console.log('Login response:', JSON.stringify(response.data, null, 2));
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('Token saved:', localStorage.getItem('token'));
                // Викликати подію login
                window.dispatchEvent(new Event('auth:login'));
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Login successful!',
                });
                this.$router.push('/profile');
            } catch (error) {
                console.error('Login error:', error.response?.data || error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Login failed',
                });
            }
        },
    },
};
</script>

<style scoped>
@import '../assets/style.css';

.form-control {
    border-radius: 0.25rem;
    border: 1px solid #ced4da;
}
.btn-primary {
    background-color: #007bff;
    border: none;
    border-radius: 0.25rem;
    transition: background-color 0.3s;
}
.btn-primary:hover {
    background-color: #0056b3;
}
.bg-white {
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
h2 {
    color: #343a40;
}
</style>