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
                        type="primary"
                        size="small"
                        class="table_button" @click="clientView(scope.row.id)">
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
   
    <b-modal id="modal-1" title="Pause Client" hide-footer v-if="modal_1">
        <b-form @submit.prevent="updatePause">
            <h6 class="heading-small text-muted mb-2">Pause the client</h6>
            <div class="pl-lg-12">
                <b-row >{{ no_of_days_available }}
                    <b-col lg="12">
                        <base-input
                        type="number"
                        label="No of Days"
                        placeholder="No of Days"
                        v-model="pausedata.days"
                        :min="1"
                        :max="no_of_days_available"
                        requied
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
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
                        
                    </b-col>
                    <div>
                        <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                        <b-button type="submit" variant="primary">Save</b-button>
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
        clients: [],
        currentPage: 1,
        pausedata:{
            pausedate : '',
            days: 1,
            notes:''
        },
       
        selectedClientID: '',
        pauseDetails: [],
        no_of_days_available: 0,
      };
    },
    methods:{
        async clientList(){
            const token = localStorage.getItem('token');
            axios.get('${process.env.VUE_APP_API_BASE_URL}dietitianpausesclientList', {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.clients = response.data;
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        clientDetails(client_id)
        {
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}clientpauseDetail/${client_id}/`, {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.pauseDetails = response.data;
                this.no_of_days_available = response.data.pause_summary.days_remaining;
                console.log(this.pauseDetails);
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        updatePause()
        {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('pause_days', this.pausedata.days);
            formData.append('pause_from', this.pausedata.pausedate);
            formData.append('notes', this.pausedata.notes);
            formData.append('client_id', this.selectedClientID);
           
            
            axios.post('${process.env.VUE_APP_API_BASE_URL}pauseClient', formData,{
                headers: { Authorization: `Token ${token}`}
            })
            .then(response => {
                console.log('Consultation scheduled successfully:', response.data);
                this.modal_1 = false;
                this.clientList();
                this.resetForm();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        },
        resetForm() {
            this.pausedata = {
                days: 1,
                pausedate: '',
                notes: '',
            };
        },
        
        handleNewClient(client)
        {
            this.selectedClientID = client;
            console.log(this.selectedClientID);
        },
        pauseClient(client)
        {
            this.selectedClientID = client;
            this.clientDetails(this.selectedClientID);
            this.modal_1 = true;
        },
        clientView(client)
        {
            this.$router.push({ name: 'clients/view', params: { id: client } });
        }
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
