<template>
    <div class="container d-flex flex-column align-items-center justify-content-center text-center flex-grow-1">
        <h1 class="fw-bold">Manage Your Time Effectively</h1>
        <p class="text-muted lead">Set alarms easily and stay organized with our intuitive interface.</p>
        <img src="@/assets/alarm.png" class="img-fluid mt-4" alt="Alarm clock" style="max-width: 320px;" />
        <router-link to="/about" class="btn btn-primary btn-lg mt-3 shadow-sm">Learn More</router-link>
    </div>
</template>

<script>
export default {
    name: 'Home',
};
</script>

<style scoped>
@import '../assets/style.css';

.btn-primary {
    background-color: #007bff;
    border: none;
    border-radius: 0.25rem;
    transition: background-color 0.3s;
}
.btn-primary:hover {
    background-color: #0056b3;
}
</style>