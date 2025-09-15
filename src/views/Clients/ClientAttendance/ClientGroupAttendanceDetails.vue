<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Client Attendance</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <b-card-body>
            <div>
                <b-row>
                    <b-col lg="6">
                        <base-input label="Select Option">   
                                
                            <select class="form-control" v-model="selectedOption" @change="onOptionChange">
                                <option value="ClientWise">Client wise</option>
                                <option value="GroupWise">Group wise</option>
                            </select>
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input label="Select Option" v-if="selectedOption == 'ClientWise'">
                            <select
                                    class="form-control"
                                    v-model="selectedClient"
                                    @change=onDataChange()
                                    >
                                    <option
                                        v-for="option in clients"
                                        :key="option.id"
                                        :value="option.id"
                                    >
                                        {{ option.name }}
                                    </option>
                            </select>
                        </base-input>

                        <base-input label="Select Option" v-if="selectedOption == 'GroupWise'">
                            <select
                                    class="form-control"
                                    v-model="selectedClient"
                                    @change=onDataChange()
                                    >
                                    <option
                                        v-for="option in groups"
                                        :key="option.id"
                                        :value="option.id"
                                    >
                                        {{ option.name }} - {{option.id}}
                                    </option>
                            </select>
                        </base-input>
                        
                    </b-col>
                    
                </b-row>

                <b-row v-if="selectedOption == 'ClientWise'">
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
                
                <b-row v-if="selectedOption == 'GroupWise'">
                   <div class="table-responsive">
                        <table class="table table-flush workout_table el-table__header table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>No.of Clients</th>
                                    <th>Status</th>
                                    <th>Clients</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="groupsession in groupsessions">
                                   <td>{{ groupsession.date }}</td>
                                   <td>{{ groupsession.clients.length }}</td>
                                   <td>
                                    <span class="text-green" v-if="groupsession.clients[0].sessions[0].completed == 1 && groupsession.clients[0].sessions[0].canceled == 0"><b>Completed</b></span>
                                    <span class="text-red" v-if="groupsession.clients[0].sessions[0].completed == 1 && groupsession.clients[0].sessions[0].canceled == 1"><b>Canceled</b></span>
                                    <span v-else><b>-</b></span>
                                    </td>
                                   <td>
                                    <base-button size="sm" type="info" v-b-modal.modal-1  @click="viewClients(groupsession.clients)">
                                        View
                                    </base-button>
                                   </td>
                                </tr>
                            </tbody>
                        </table>
                   </div>
                </b-row>
                

                
            </div>
        </b-card-body>
    </b-card>

        <b-modal id="modal-1" size="lg" title="Client Details" hide-footer v-if="showClientModal" @close="showClientModal = false">
            <b-form @submit.prevent="updateSessionData">
                <h6 class="heading-small text-muted mb-2">Client Details</h6>
                <div class="pl-lg-12">
                    <b-row>
                        <b-col lg="12">
                            <table class="table table-flush workout_table el-table__header">
                                <thead>
                                    <tr>
                                        <th>SL No</th>
                                        <th>Client Name</th>
                                        <th>Session No.</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(client, index) in groupClients" >
                                        <td>{{ index+1 }}</td>
                                        <td>{{ client.client_name }}</td>
                                        <td>{{ client.sessions[0].session_no }}</td>
                                        <td>
                                            <span class="text-green" v-if="client.sessions[0].group_attendance == 'Attended'"><b>{{ client.sessions[0].group_attendance }}</b></span>
                                            <span class="text-red" v-else-if="client.sessions[0].group_attendance == 'Not Attended'"><b>{{ client.sessions[0].group_attendance }}</b></span>
                                            <span class="text-red" v-else-if="client.sessions[0].canceled == 1"><b>Canceled</b></span>
                                            <span v-else><b>-</b></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                        </b-col>

                    </b-row>
                </div>
                
            </b-form>
        </b-modal>
   
</div>
</template>

<script>
import axios from 'axios'
  export default {
    
    data() {
        return {
            selectedClient: '',
            selectedOption: 'ClientWise',
            clients: [],
            sessions: [],
            groupsessions: [],
            groups: [],
            selectedGroup: '',
            groupClients: '',
            showClientModal: false
        };
    },
    methods: {
        onDataChange()
        {
            if (this.selectedOption == 'GroupWise') {
                this.groupsessionList();
            }
            else
            {
                this.sessionList();
            }
            
        },
        onOptionChange()
        {
            if (this.selectedOption == 'GroupWise') {
                this.groupList();
            }
            else
            {
                this.sessionList();
            }
        },
        async groupList()
        {
            const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}trainerGroupList`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.groups = response.data;
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        async clientList()
        {
            const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}trainerGroupClientList`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.clients = response.data;
                console.log(this.selectedClient);
                
                this.sessionList();
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        sessionList()
        {
            
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}trainerClientGroupSessionList/${this.selectedClient}`, {
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
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}trainergroupsessionList/${this.selectedClient}`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.groupsessions = response.data.programs;
                // console.log('programs fetched successfully:', response.data);
            })
            .catch(error => {
                console.error('Error fetching Sessions:', error.response && error.response.data ? error.response.data : error);

            });
        },
        viewClients(clients)
        {
            this.groupClients = clients;
            this.showClientModal = true;
        },
        
    },
    mounted(){
        this.clientList();
        this.groupsessionList();
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
