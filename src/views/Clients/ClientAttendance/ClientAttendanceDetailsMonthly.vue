<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Client Attendance</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <b-card-body>
            <div>
                <!-- <b-form @submit.prevent="createUser"> -->
                    <b-row>
                        <b-col lg="6">
                            <base-input label="Select Year">
                                <select class="form-control" v-model="selectedYear" @change="onDataChange">
                                    <option>2025</option>
                                    <!-- <option>2024</option> -->
                                    
                                </select>
                            </base-input>
                        </b-col>
                        <b-col lg="6">
                            <base-input label="Select Month">   
                                <select class="form-control" v-model="selectedMonth"  @change="onDataChange">
                                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                                </select>
                            </base-input>
                        </b-col>
                        <!-- <b-col lg="6">
                            <b-button type="submit" variant="success" class="submit_btn">Search</b-button>
                        </b-col> -->
                    </b-row>

                    <b-row>
                        <b-col lg="12">
                            <template>
                                <div p-2 class="el-table table-responsive table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                                    <table class="table table-flush workout_table el-table__header">
                                        <thead class="thead-light">
                                            <tr>
                                                <th>Slno</th>
                                                <th>Workout Date</th>
                                                <th>Program</th>
                                                <th>Program Time</th>
                                                <th>Program Type</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(workout_date, index) in workout_dates" :key="index">
                                                <td>{{ index+1 }}</td> 
                                                <td>{{ workout_date.date }}</td> 
                                                <td>{{ programs.name }}</td>
                                                <td>{{ programs.preferred_time }}</td> 
                                                <td>{{ programs.type }}</td> 
                                                <td v-if="workout_date.attended">
                                                    <b-button disabled class="btn btn-sm btn-success mr-4">Completed</b-button>
                                                </td>
                                                <td v-else>
                                                    <b-button disabled class="btn btn-sm btn-danger mr-4">Not Completed</b-button>
                                                </td> 
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </template>
                        </b-col>
                    </b-row>

                <!-- </b-form> -->
                
            </div>
        </b-card-body>
    </b-card>
   
</div>
</template>

<script>
import axios from 'axios'
  export default {
    data() {
        const today = new Date();
        const monthNames = [
        'January', 'Februray', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return {
            selectedYear: today.getFullYear().toString(),  // "2025"
            selectedMonth: monthNames[today.getMonth()],   // "June"
            months: monthNames,
            workout_dates: [],
            programs:[]
        };
    },
    
    methods: {
        
        clientList(clientId, month, year)
        {
            const monthNumber = this.months.indexOf(month) + 1;
            
            const token = localStorage.getItem('token');
            axios.get(`http://127.0.0.1:8000/api/user/clientListbyMonth/${clientId}/${year}/${monthNumber}/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.workout_dates = response.data.workout_dates;
                this.programs = response.data.program;
                // console.log(response.data.program);
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        onDataChange()
        {
            const year = this.selectedYear;
            const month = this.selectedMonth;
            const clientId = this.$route.params.id;

            this.clientList(clientId, month, year);
        },
        
    },
    mounted(){
        const today = new Date();
        const year = this.selectedYear;
        const month = this.selectedMonth;
        const clientId = this.$route.params.id;

        this.clientList(clientId, month, year);
    }
  };
</script>
<style>
   
</style>
