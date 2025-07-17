<template>
    <base-header class=" pb-8 pt-5 pt-md-8 bg-gradient-success">
        <b-row>
            <b-col xl="3" md="6">
                <router-link :to="{ name: 'clients/clients' }" class="no-underline">
                    <stats-card title="Active Clients"
                      type="gradient-red"
                      :sub-title='String(count_active_clients)'
                      icon="ni ni-satisfied"
                      class="mb-4"
                      @click="viewclients()">

                        <template slot="footer">
                            <span class="text-nowrap mr-2"></span>
                            <span class="text-success">view</span>
                        </template>
                    </stats-card>
                </router-link>
                

            </b-col>

            <b-col xl="3" md="6">
                <router-link :to="{ name: 'clients/upcoming_consultation_schedules' }" class="no-underline">
                    <stats-card title="Upcoming Consultations"
                      type="gradient-orange"
                      :sub-title='String(count_upcoming_consultation)'
                      icon="ni ni-calendar-grid-58"
                      class="mb-4">
                        <template slot="footer">
                            <span class="text-nowrap mr-2"></span>
                            <span class="text-success">view</span>
                        </template>
                    </stats-card>
                </router-link>
                
            </b-col>
            <b-col xl="3" md="6">
                <router-link :to="{ name: 'clients/missed_consultation_schedules' }" class="no-underline">
                    <stats-card title="Missed Consultation"
                      type="gradient-green"
                      :sub-title="String(count_missed_consultation)"
                      icon="ni ni-time-alarm"
                      class="mb-4">
                        <template slot="footer">
                            <span class="text-nowrap mr-2"></span>
                            <span class="text-success">view</span>
                        </template>
                    </stats-card>
                </router-link>
                
            </b-col>

            <b-col xl="3" md="6">
                <router-link :to="{ name: 'clients/missed_consultation_schedules' }" class="no-underline">
                    <stats-card title="Upcoming Bi-Weekly Updations"
                      type="gradient-blue"
                      :sub-title="String(count_biweekly_updations)"
                      icon="ni ni-watch-time"
                      class="mb-4">
                        <template slot="footer">
                            <span class="text-nowrap mr-2"></span>
                            <span class="text-success">view</span>
                        </template>
                    </stats-card>
                </router-link>
                
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
                count_biweekly_updations: 0
            };
        },
        
        methods:{
            async active_clients()
            {
                const token = localStorage.getItem('token');
                await axios.get(`${process.env.VUE_APP_API_BASE_URL}fetchActiveClientsDietitian/`, {
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
                await axios.get(`${process.env.VUE_APP_API_BASE_URL}fetchConsultationDietitian/`, {
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
            },
            async biweekly_updation()
            {
                const token = localStorage.getItem('token');
                await axios.get(`${process.env.VUE_APP_API_BASE_URL}fetchupsomingbiweeklyUpdation/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.count_biweekly_updations = response.data.upcoming_biweekly_count;
                    
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            viewclients()
            {

            }
        },
        mounted(){
            this.active_clients();
            this.consultation_details();
            this.biweekly_updation();
        }
    }
</script>
<style>
    .font_red
    {
        color: red;
    }
</style>