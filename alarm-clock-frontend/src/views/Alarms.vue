<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-6 bg-white p-4 rounded shadow">
                <h2 class="text-center fw-bold mb-4">Add Alarm</h2>
                <form @submit.prevent="addAlarm">
                    <div class="mb-3">
                        <label for="alarmTime" class="form-label">Set Alarm Time</label>
                        <input v-model="newAlarm.time" type="time" class="form-control" id="alarmTime" required />
                    </div>
                    <div class="mb-3">
                        <label for="alarmDate" class="form-label">Set Alarm Date</label>
                        <input v-model="newAlarm.date" type="date" class="form-control" id="alarmDate" required />
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Add Alarm</button>
                </form>

                <h3 class="text-center fw-bold mt-4">Active Alarms</h3>
                <ul class="list-group">
                    <li v-for="(alarm, index) in alarms" :key="alarm.id" class="list-group-item d-flex justify-content-between align-items-center">
                        {{ alarm.triggered ? '🔕' : '🔔' }} {{ alarm.time }} - {{ alarm.date }}
                        <button @click="deleteAlarm(alarm.id, index)" class="btn btn-danger btn-sm">Delete</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'Alarms',
    data() {
        return {
            newAlarm: {
                time: '',
                date: '',
            },
            alarms: [],
        };
    },
    created() {
        this.fetchAlarms();
        this.checkAlarms();
    },
    methods: {
        async fetchAlarms() {
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please log in to view alarms',
                });
                this.$router.push('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:3000/api/alarms', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.alarms = response.data;
                console.log('Fetched alarms:', JSON.stringify(this.alarms, null, 2));
            } catch (error) {
                console.error('Fetch alarms error:', error.response || error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Failed to fetch alarms',
                });
            }
        },
        async addAlarm() {
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please log in to add alarms',
                });
                this.$router.push('/login');
                return;
            }
            try {
                await axios.post('http://localhost:3000/api/alarms', this.newAlarm, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.newAlarm.time = '';
                this.newAlarm.date = '';
                await this.fetchAlarms();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Alarm added successfully',
                });
            } catch (error) {
                console.error('Add alarm error:', error.response || error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Failed to add alarm',
                });
            }
        },
        async deleteAlarm(id, index) {
            if (!confirm('Are you sure you want to delete this alarm?')) return;
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please log in to delete alarms',
                });
                this.$router.push('/login');
                return;
            }
            try {
                await axios.delete(`http://localhost:3000/api/alarms/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.alarms.splice(index, 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Alarm deleted successfully',
                });
            } catch (error) {
                console.error('Delete alarm error:', error.response || error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Failed to delete alarm',
                });
            }
        },
        async checkAlarms() {
            const token = localStorage.getItem('token');
            setInterval(async () => {
                const now = new Date();
                const alarmsToUpdate = [];
                this.alarms.forEach((alarm) => {
                    const alarmDateTime = new Date(`${alarm.date}T${alarm.time}:00`);
                    const timeDiff = Math.abs(now - alarmDateTime);
                    if (timeDiff < 5000 && !alarm.triggered) {
                        console.log(`Alarm triggered: id=${alarm.id}, time=${alarm.time}, date=${alarm.date}`);
                        Swal.fire({
                            icon: 'info',
                            title: 'Alarm',
                            text: `Alarm: ${alarm.time} on ${alarm.date}`,
                        });
                        alarm.triggered = 1;
                        alarmsToUpdate.push(alarm.id);
                    }
                });
                for (const alarmId of alarmsToUpdate) {
                    try {
                        await axios.patch(
                            `http://localhost:3000/api/alarms/${alarmId}/triggered`,
                            { triggered: true },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        console.log(`Updated triggered for alarm id=${alarmId}`);
                    } catch (error) {
                        console.error('Update triggered error:', error.response || error);
                    }
                }
                console.log('Current alarms state:', JSON.stringify(this.alarms, null, 2));
            }, 1000);
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
.btn-danger {
    border-radius: 0.25rem;
}
.bg-white {
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
h2, h3 {
    color: #343a40;
}
</style>