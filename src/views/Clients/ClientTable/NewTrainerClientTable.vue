<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">New Client List</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>
       
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="clients">

            <el-table-column label="ID"
                             min-width="90px"
                             prop="client_id">
            </el-table-column>
            <el-table-column label="Name"
                             min-width="90px"
                             prop="name">
            </el-table-column>
           
            <el-table-column label="Email"
                             min-width="110px"
                             prop="email">
            </el-table-column>

            <el-table-column label="Phone"
                             min-width="80px"
                             prop="phone">
            </el-table-column>

            <el-table-column label="Program"
                             min-width="100px"
                             prop="programs[0].program.name">
            </el-table-column>

            <el-table-column label="Consulation Status"
                             min-width="140px"
                             prop="consulationstatus">
                <template #default="scope">
                    <div>
                        <span v-if="!scope.row.trainer_first_consultation" class="text-warning">
                            🏋️ Trainer Consultation Scheduling Pending
                        </span>
                        <span v-else class="text-success">
                            ✅ Trainer Consultation Scheduled
                        </span>
                    </div>

                    <div>
                        <span v-if="!scope.row.diet_first_consultation" class="text-warning">
                            🥗 Diet Consultation Scheduling Pending
                        </span>
                        <span v-else class="text-success">
                            ✅ Diet Consultation Scheduled
                        </span>
                    </div>
                </template>
            </el-table-column>
           
            <el-table-column label="Action"
                             prop="completion"
                             min-width="95px">
                <template #default="scope">

                    <!-- <b-button v-b-modal.modal-1 variant="primary">Launch demo modal</b-button> -->
                    <base-button v-b-modal.modal-1
                    v-if="scope.row.new_client && scope.row.trainer_first_consultation == 0"
                    type="primary"
                    size="small"
                    @click="handleNewClient(scope.row)" class="table_button">
                    Schedule
                    </base-button>


                    <base-button v-b-modal.modal-2
                    v-else-if="scope.row.new_client && scope.row.trainer_first_consultation == 2"
                    type="warning"
                    size="small"
                    @click="handleNewClient(scope.row)" class="table_button">
                        Enter Data
                    </base-button>

                    <base-button
                    v-else-if="scope.row.new_client && scope.row.trainer_first_consultation == 3"
                    type="success"
                    size="small"
                    class="table_button">
                        Completed
                    </base-button>
                </template>
            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
    <b-modal id="modal-1" title="Schedule First Consultation" hide-footer>
        <b-form @submit.prevent="schedule">
            <h6 class="heading-small text-muted mb-2">Schedule First Consulation</h6>
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="datetime-local"
                        label="Schedule Date & Time"
                        placeholder="Schedule Date & Timee"
                        v-model="scheduledata.scheduledate"
                        >
                        </base-input>
                    </b-col>
                </b-row>
            </div>
            <!-- Custom buttons -->
            <div>
                <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                <b-button type="submit" variant="primary">Schedule</b-button>
            </div>
        </b-form>
    </b-modal>

    <b-modal id="modal-2" title="Details of Client" hide-footer>
        <b-form @submit.prevent="enterClientDetails">
            <h6 class="heading-small text-muted mb-2">Enter Details after First Consulation</h6>
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Current Activity Level"
                        placeholder="Current Activity Level"
                        v-model="clientdetails.current_acitivity_level"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Current Workouts"
                        placeholder="Current Workouts"
                        v-model="clientdetails.current_workouts"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Past Workouts/Physical Activities"
                        placeholder="Past Workouts/Physical Activities"
                        v-model="clientdetails.past_workouts"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Physical Limitations/Injuries"
                        placeholder="Physical Limitations/Injuries"
                        v-model="clientdetails.physical_limitations"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Fitness Equipment Owned"
                        placeholder="Fitness Equipment Owned"
                        v-model="clientdetails.equipment_owned"
                        >
                        </base-input>
                    </b-col>
                </b-row>
            </div>
            <!-- Custom buttons -->
            <div>
                <b-button variant="secondary" @click="$bvModal.hide('modal-2')">Cancel</b-button>
                <b-button type="submit" variant="primary">Save</b-button>
            </div>
        </b-form>
    </b-modal>

    
</div>
</template>

<script>
  import axios from 'axios'
  import projects from '../../Tables/projects'
  import { Table, TableColumn} from 'element-ui'
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        clients: [],
        currentPage: 1,
        scheduledata:{
            scheduledate : '',
            type: 'trainer',
            no_of_consultation: 1
        },
        clientdetails:{
            current_acitivity_level: '',
            current_workouts: '',
            physical_limitations: '',
            equipment_owned: '',
            no_of_consultation: 1
        },
        selectedClientID: ''
      };
    },
    methods:{
        async newclientList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}newclientList`, {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.clients = response.data;
                console.log(response.data);
                
                // console.log('programs fetched successfully:', response.data);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        schedule()
        {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('datetime', this.scheduledata.scheduledate);
            formData.append('client', this.selectedClientID);
            formData.append('type', this.scheduledata.type);
            formData.append('no_of_consultation', this.scheduledata.no_of_consultation);

            axios.post(`${process.env.VUE_APP_API_BASE_URL}scheduleconsulation`, formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
            console.log('Program created successfully:', response.data);
            })
            .catch(error => {
            console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);

            });
        },
        enterClientDetails()
        {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('current_acitivity_level', this.clientdetails.current_acitivity_level);
            formData.append('client', this.selectedClientID);
            formData.append('current_workouts', this.clientdetails.current_workouts);
            formData.append('physical_limitations', this.clientdetails.physical_limitations);
            formData.append('equipment_owned', this.clientdetails.equipment_owned);
             formData.append('no_of_consultation', this.clientdetails.no_of_consultation);
             formData.append('user', 'trainer');

            axios.post(`${process.env.VUE_APP_API_BASE_URL}dietitianconsulation_details`, formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
            console.log('Program created successfully:', response.data);
            })
            .catch(error => {
            console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);

            });
        },
        handleNewClient(client)
        {
            this.selectedClientID = client.id;
            console.log(this.selectedClientID);
        }
    },
    mounted()
    {
        this.newclientList();
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
</style>
