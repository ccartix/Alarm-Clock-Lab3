<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-6 bg-white p-4 rounded shadow">
                <h2 class="text-center fw-bold mb-4">Your Profile</h2>
                <table class="table table-bordered table-hover">
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <td>{{ user.name || 'Loading...' }}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{{ user.email || 'Loading...' }}</td>
                        </tr>
                        <tr>
                            <th>Date of Birth</th>
                            <td>{{ user.dob || 'Loading...' }}</td>
                        </tr>
                        <tr>
                            <th>Gender</th>
                            <td>{{ user.gender || 'Loading...' }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="text-center mt-4">
                    <button @click="logout" class="btn btn-secondary">Logout</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'Profile',
    data() {
        return {
            user: {},
        };
    },
    created() {
        this.fetchProfile();
    },
    methods: {
        async fetchProfile() {
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please log in to view your profile',
                });
                this.$router.push('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:3000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.user = response.data;
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                console.error('Profile error:', error.response || error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Failed to load profile',
                });
                this.$router.push('/login');
            }
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Викликати подію logout
            window.dispatchEvent(new Event('auth:logout'));
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Logged out successfully',
            });
            this.$router.push('/login');
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
.btn-secondary {
    background-color: #6c757d;
    border: none;
    border-radius: 0.25rem;
    transition: background-color 0.3s;
}
.btn-secondary:hover {
    background-color: #5a6268;
}
.bg-white {
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
h2 {
    color: #343a40;
}
</style>