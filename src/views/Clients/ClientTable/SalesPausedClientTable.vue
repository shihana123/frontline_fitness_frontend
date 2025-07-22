<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Client List</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="clients">

            <el-table-column label="ID"
                             
                             prop="client_id">
            </el-table-column>
            <el-table-column label="Name"
                             
                             prop="name">
            </el-table-column>

            <el-table-column label="Phone"
                             
                             prop="phone">
            </el-table-column>

            <el-table-column label="Program Type"
                            
                             prop="programs[0].program_type">
            </el-table-column>

            <el-table-column label="Program"
                            
                             prop="programs[0].program.name">
            </el-table-column>

            <!-- <el-table-column label="Workout Start Date"
                             
                             prop="workout_start_date">
            </el-table-column> -->
           
            <el-table-column label="Action"
                             prop="completion"
                             >
                <template #default="scope">
                    <div class="action_buttons">
                        <base-button
                        v-b-modal.modal-1
                        type="primary"
                        size="small"
                        class="table_button" @click="clientView(scope.row)">
                        View
                        </base-button>
                    </div>

                </template>

            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
   
    <b-modal id="modal-1" title="Client Details" hide-footer v-if="modal_1">
            <!-- <h6 class="heading-small text-muted mb-2">Pause the client</h6> -->
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <h5>Paused From: {{ clientData.latest_pause_record.paused_from }}</h5>
                        <h5>No.of Days: {{ clientData.latest_pause_record.no_of_days }}</h5>
                        <h5>Reactivate on: {{ clientData.latest_pause_record.program_pause_reactivate_on }}</h5>
                        <h5>Notes: {{ clientData.latest_pause_record.notes }}</h5>

                        <hr>

                        <h5>Paused Days Till Now: {{ getPausedDays(clientData.latest_pause_record.program_pause_reactivate_on) }}</h5>
                    </b-col>
                    <!-- <b-col lg="12">
                        <base-input
                        type="date"
                        label="Pause Start From"
                        v-model="pausedata.pausedate"
                        
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="pausedata.notes" required></textarea>
                        </base-input>
                        
                    </b-col> -->
                    <div>
                        <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                        <b-button v-b-modal.modal-2 variant="primary" @click="ActivateclientView(clientData)">Activate</b-button>
                    </div> 
                </b-row>
            </div>
    </b-modal>

    <b-modal id="modal-2" title="Activate Client" hide-footer v-if="modal_2">
        <b-form @submit.prevent="activateClient">
            <!-- <h6 class="heading-small text-muted mb-2">Pause the client</h6> -->
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <b-alert show variant="default">
                            Are you sure you want to activate this client? They still have {{ getPausedDays(clientData.latest_pause_record.program_pause_reactivate_on) }} pause days remaining. 
                        </b-alert>
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="pausedata.notes" required></textarea>
                        </base-input>
                        
                    </b-col> 
                    <div>
                        <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                        <b-button type="submit" variant="primary">Activate</b-button>
                    </div> 
                </b-row>
            </div>
        </b-form>
    </b-modal>
</div>
</template>

<script>
  import axios from 'axios'
  import projects from '../../Tables/projects'
  import { Table, TableColumn} from 'element-ui'
  import { useRouter } from 'vue-router';
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        modal_1: false,
        modal_2: false,
        clients: [],
        currentPage: 1,
        pausedata:{
            notes:''
        },
       
        selectedClientID: '',
        pauseDetails: [],
        no_of_days_available: 0,
        clientData: []
      };
    },
    methods:{
        async clientList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}salespausesclientList`, {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.clients = response.data;
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        getPausedDays(reactivateOnDate) {
            if (!reactivateOnDate) return 0;

            const toDate = new Date(reactivateOnDate);
            const today = new Date();

            // Clear time part for accurate day comparison
            toDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const diffTime = toDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return diffDays > 0 ? diffDays : 0;
        },
        activateClient()
        {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('notes', this.pausedata.notes);
            formData.append('client_id', this.selectedClientID);
           
            
            axios.post(`${process.env.VUE_APP_API_BASE_URL}activatePauseClient`, formData,{
                headers: { Authorization: `Token ${token}`}
            })
            .then(response => {
                console.log('Client Activated successfully:', response.data);
                this.modal_2 = false;
                this.clientList();
                this.resetForm();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        },
        resetForm() {
            this.pausedata = {
                notes: '',
            };
        },
        clientView(client)
        {
            this.clientData = client;
            this.selectedClientID = client.id
            this.modal_1 = true;
        },
        ActivateclientView(client)
        {
            this.clientData = client;
            this.modal_1 = false;
            this.modal_2 = true;
        },
    },
    mounted()
    {
        this.clientList();
    }

  }
</script>
<style>
    .table-icons
    {
        margin: 6px;
        font-size: 15px !important;
    }
    .header-sec
    {
        display: block ruby;
    }
    .create_btn
    {
        float: inline-end;
    }
    .table_button
    {
        font-size: 10px !important;
        padding: 9px !important;
    }
    .action_buttons
    {
        display: flex;
    }
</style>
