<template>
    <div class="container my-5">
        <h2 class="fw-bold text-center">What is Alarm Clock?</h2>
        <p class="lead text-center">Our application helps you set and manage multiple alarms effortlessly</p>
        <div class="row mt-4">
            <div class="col-md-6 text-center">
                <img src="@/assets/alarm2.png" class="img-fluid rounded shadow" style="max-width: 300px;" alt="Alarm Clock" />
            </div>
            <div class="col-md-6">
                <h3 class="fw-bold mt-4">Key Features:</h3>
                <ul class="list-group list-group-flush mt-4">
                    <li class="list-group-item">Set unlimited alarms</li>
                    <li class="list-group-item">Manage and delete alarms easily</li>
                    <li class="list-group-item">Notifications for active alarms</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'About',
};
</script>

<style scoped>
@import '../assets/style.css';

.list-group-item {
    border: none;
    padding: 0.5rem 0;
}
img {
    border-radius: 0.5rem;
}
h2, h3 {
    color: #343a40;
}
</style>
