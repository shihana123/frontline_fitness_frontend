<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Client Attendance</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <b-card-body>
            <div>
                <b-form @submit.prevent="createUser">
                    <b-row>
                        <b-col lg="6">
                            <base-input
                            type="date"
                            label="Choose Date"
                            :max="today"
                            v-model="selectedDate"
                            @input="onDateChange"
                            >
                            </base-input>
                        </b-col>
                        <!-- <b-col lg="6">
                            <b-button type="submit" variant="success" class="submit_btn">Search</b-button>
                        </b-col> -->
                    </b-row>

                </b-form>
                <b-tabs pills>
                    <b-tab active>
                    <template v-slot:title>
                        <i class="ni ni-single-02 mr-2"></i> Personal Training
                    </template><br>
                    <template>
                        <div p-2 class="el-table table-responsive table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                            <table class="table table-flush workout_table el-table__header">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Slno</th>
                                        <th>Client</th>
                                        <th>Program</th>
                                        <th>Program Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(client, index) in clients" :key="index" v-if="client.program_type == 'Personal Training'">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ client.client_name }}</td>
                                        <td>{{ client.program_name }}</td>
                                        <td>{{ client.preferred_time }}</td>
                                        <td v-if="client.has_attendance">
                                            <b-button disabled class="btn btn-sm btn-success mr-4">Completed</b-button>
                                        </td>
                                        <td v-else>
                                            <b-button class="btn btn-sm btn-warning mr-4" @click="markAttendance(client)">Mark Attendance</b-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    </b-tab>

                    <b-tab>
                    <template v-slot:title>
                        <i class="ni ni-ungroup mr-2"></i> Group Session
                    </template><br>
                    <template>
                        <div p-2 class="el-table table-responsive table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                            <table class="table table-flush workout_table el-table__header">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Slno</th>
                                        <th>Client</th>
                                        <th>Program</th>
                                        <th>Program Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(client, index) in clients" :key="index" v-if="client.program_type == 'Group'">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ client.client_name }}</td>
                                        <td>{{ client.program_name }}</td>
                                        <td>{{ client.preferred_time }}</td>
                                        <td v-if="client.has_attendance">
                                            <b-button disabled class="btn btn-sm btn-success mr-4">Completed</b-button>
                                        </td>
                                        <td v-else>
                                            <b-button class="btn btn-sm btn-warning mr-4" @click="markAttendance(client)">Mark Attendance</b-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    </b-tab>

                    <b-tab>
                    <template v-slot:title>
                        <i class="ni ni-calendar-grid-58 mr-2"></i> Recorded Session
                    </template><br>
                    <template>
                        <div p-2 class="el-table table-responsive table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                            <table class="table table-flush workout_table el-table__header">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Slno</th>
                                        <th>Client</th>
                                        <th>Program</th>
                                        <th>Program Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(client, index) in clients" :key="index" v-if="client.program_type == 'Recorded Sessions'">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ client.client_name }}</td>
                                        <td>{{ client.program_name }}</td>
                                        <td>{{ client.preferred_time }}</td>
                                        <td v-if="client.has_attendance">
                                            <b-button disabled class="btn btn-sm btn-success mr-4">Completed</b-button>
                                        </td>
                                        <td v-else>
                                            <b-button class="btn btn-sm btn-warning mr-4" @click="markAttendance(client)">Mark Attendance</b-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    </b-tab>
                </b-tabs>
            </div>
        </b-card-body>
    </b-card>
   
</div>
</template>

<script>
import axios from 'axios'
  export default {
    data() {
        return {
            selectedDate: this.getTodayDate(), // default to today
            clients: []
        };
    },
    computed: {
        today() {
        return this.getTodayDate();
        }
    },
    methods: {
        getTodayDate() {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        },
        clientList(attendance_date)
        {
            // console.log(today_date);
            const token = localStorage.getItem('token');
            axios.get(`http://127.0.0.1:8000/api/user/clientListbyDate/${attendance_date}/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.clients = response.data;
                console.log(response);
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        onDateChange()
        {
            // console.log(this.selectedDate);
            this.clientList(this.selectedDate);
        },
        async markAttendance(client)
        {
            const token = localStorage.getItem('token');
            try {
            await axios.post('http://localhost:8000/api/user/markClientAttendance/', {
                client_id: client.id,
                workout_date: this.selectedDate
            }, {
                headers: {
                Authorization: `Token ${token}`
                }
            });

            // Refresh attendance data
            // this.clientList('2025-06-10');
            this.clientList(this.selectedDate); // or however you're fetching the table

            } catch (error) {
            console.error(error);
            alert("Failed to mark attendance");
            }
        }
    },
    mounted(){
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const today_date = `${yyyy}-${mm}-${dd}`;
        // const today_date = `2025-06-10`;
        
        this.clientList(today_date);
    }
  };
</script>
<style>
   
</style>
