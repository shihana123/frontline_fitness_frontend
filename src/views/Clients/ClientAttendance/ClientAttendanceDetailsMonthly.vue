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
                            <base-input label="Select Year">
                                <select class="form-control" v-model="selectedYear">
                                    <option>2025</option>
                                    <option>2024</option>
                                    
                                </select>
                            </base-input>
                        </b-col>
                        <b-col lg="6">
                            <base-input label="Select Month">
                                <select class="form-control" v-model="selectedMonth">
                                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                                </select>
                            </base-input>
                        </b-col>
                        <!-- <b-col lg="6">
                            <b-button type="submit" variant="success" class="submit_btn">Search</b-button>
                        </b-col> -->
                    </b-row>

                </b-form>
                
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
            clients: []
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
