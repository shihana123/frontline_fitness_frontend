<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Client Attendance</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <b-card-body>
            <div>
               
                <b-row v-if="program_type == 'Personal Training'">
                   <div class="table-responsive">
                        <table class="table table-flush workout_table el-table__header table-bordered">
                            <thead>
                                <tr>
                                    <th v-for="session in sessions">Session no {{ session.session_no }}<br>{{ session.session_date }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td v-for="session in sessions">
                                        <span v-if="session.completed == true && session.canceled == false" class="text-green">
                                            <b>Completed</b>
                                        </span>
                                        <span v-else-if="session.completed == true && session.canceled == true" class="text-red">
                                            <span v-if="session.canceled_by == 'Client'"><b>Canceled By Client</b></span>
                                            <span v-if="session.canceled_by == 'Trainer'"><b>Canceled By Trainer</b></span>
                                        </span>
                                        <span v-else> <b>-</b></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                   </div>
                </b-row>

                <b-row v-else-if="program_type == 'Group'">
                   <div class="table-responsive">
                        <table class="table table-flush workout_table el-table__header table-bordered">
                            <thead>
                                <tr>
                                    <th v-for="session in sessions">Session no {{ session.session_no }}<br>{{ session.session_date }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td v-for="session in sessions">
                                        <span v-if="session.completed == true && session.canceled == false" class="text-green">
                                            <b>Completed</b>
                                        </span>
                                        <span v-else-if="session.completed == true && session.canceled == true" class="text-red">
                                            <span v-if="session.canceled_by == 'Client'"><b>Canceled By Client</b></span>
                                            <span v-if="session.canceled_by == 'Trainer'"><b>Canceled By Trainer</b></span>
                                        </span>
                                        <span v-else> <b>-</b></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                   </div>
                </b-row>

                
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
            program_type: '',
            clients: [],
            sessions: []
        };
    },
    methods: {
       
        sessionList()
        {
            const client_id = this.$route.params.id;
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}trainerClientSessionList/${client_id}`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.sessions = response.data;
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        groupsessionList()
        {
            const client_id = this.$route.params.id;
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}trainerClientGroupSessionList/${client_id}`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.sessions = response.data;
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        
    },
    mounted(){
        const program_type = this.$route.params.type;
        this.program_type = program_type;
        if (program_type == 'Personal Training') {
            this.sessionList();
        }
        else
        {
            this.groupsessionList();
        }
        
    }
  };
</script>
<style>
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* smooth scrolling on mobile */
}

.workout_table th {
  white-space: nowrap; /* prevent breaking session_date */
  min-width: 120px; /* adjust width for readability */
}
</style>
