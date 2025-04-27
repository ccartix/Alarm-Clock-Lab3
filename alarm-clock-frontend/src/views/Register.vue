<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-6 bg-white p-4 rounded shadow">
                <h2 class="text-center fw-bold mb-4">Register</h2>
                <form @submit.prevent="register">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input v-model="form.name" type="text" class="form-control" id="name" required />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="form.email" type="email" class="form-control" id="email" required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input v-model="form.password" type="password" class="form-control" id="password" required />
                    </div>
                    <div class="mb-3">
                        <label for="gender" class="form-label">Gender</label>
                        <select v-model="form.gender" class="form-control" id="gender" required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="dob" class="form-label">Date of Birth</label>
                        <input v-model="form.dob" type="date" class="form-control" id="dob" required />
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Register</button>
                </form>
                <p class="text-center mt-3">
                    Already have an account? <router-link to="/login">Log In here</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'Register',
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                gender: '',
                dob: '',
            },
        };
    },
    methods: {
        async register() {
            try {
                console.log('Registering user:', this.form.email);
                await axios.post('http://localhost:3000/api/register', this.form);
                console.log('Registration successful, attempting login');
                const loginResponse = await axios.post('http://localhost:3000/api/login', {
                    email: this.form.email,
                    password: this.form.password,
                });
                console.log('Login response:', JSON.stringify(loginResponse.data, null, 2));
                localStorage.setItem('token', loginResponse.data.token);
                localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
                console.log('Token saved:', localStorage.getItem('token'));
                // Викликати подію login
                window.dispatchEvent(new Event('auth:login'));
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Registration and login successful!',
                });
                this.$router.push('/profile');
            } catch (error) {
                console.error('Register error:', error.response?.data || error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Registration failed',
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