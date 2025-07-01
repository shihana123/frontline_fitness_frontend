<template>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
        <b-row>
            <b-col xl="3" md="6">
                <stats-card title="Active Clients"
                      type="gradient-red"
                      :sub-title='count_active_clients'
                      icon="ni ni-satisfied"
                      class="mb-4">

                    <template slot="footer">
                    
                    <span class="text-nowrap mr-2"></span>
                    <span class="text-success">{{currentMonth}},{{currentYear}}</span>
                    </template>
                </stats-card>
            </b-col>

            <b-col xl="3" md="6">
                <stats-card title="Upcoming Consultations"
                      type="gradient-orange"
                      :sub-title='count_upcoming_consultation'
                      icon="ni ni-calendar-grid-58"
                      class="mb-4">

                    <template slot="footer">
                    
                    <span class="text-nowrap mr-2"></span>
                    <span class="text-success">{{currentMonth}},{{currentYear}}</span>
                    </template>
                </stats-card>
            </b-col>

            <b-col xl="3" md="6">
                <stats-card title="Missed Consultation"
                      type="gradient-green"
                      :sub-title='count_missed_consultation'
                      icon="ni ni-time-alarm"
                      class="mb-4">

                    <template slot="footer">
                    
                    <span class="text-nowrap mr-2"></span>
                    <span class="text-success">{{currentMonth}},{{currentYear}}</span>
                    </template>
                </stats-card>
            </b-col>
        </b-row>

    </base-header>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                count_active_clients : 0,
                count_upcoming_consultation: 0,
                count_missed_consultation: 0,
            };
        },
        methods:{
            async active_clients()
            {
                const token = localStorage.getItem('token');
                await axios.get(`http://127.0.0.1:8000/api/user/fetchActiveClientsDietitian/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data.active_client_count);
                    this.count_active_clients = response.data.active_client_count;
                    
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            async consultation_details()
            {
                const token = localStorage.getItem('token');
                await axios.get(`http://127.0.0.1:8000/api/user/fetchConsultationDietitian/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.count_upcoming_consultation = response.data.upcoming_consultations;
                    this.count_missed_consultation = response.data.due_consultations;
                    
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            }
        },
        mounted(){
            this.active_clients();
            this.consultation_details();
        }
    }
</script>