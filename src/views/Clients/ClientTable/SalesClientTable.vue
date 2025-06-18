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
                    <div v-if="scope.row.programs[0].trainer">
                        <span v-if="!scope.row.trainer_first_consultation" class="text-warning">
                            🏋️ Trainer Consultation Scheduling Pending -- {{ scope.row.programs[0].trainer }}
                        </span>
                        <span v-else class="text-success">
                            ✅ Trainer Consultation Scheduling Completed 
                        </span>
                    </div>
                    <div v-else>
                        <span class="text-warning">
                            🏋️ Trainer not assigned
                        </span>
                    </div>

                    <div v-if="scope.row.programs[0].dietitian">
                        <span v-if="!scope.row.diet_first_consultation" class="text-warning">
                            🥗 Diet Consultation Scheduling Pending
                        </span>
                        <span v-else class="text-success">
                            ✅ Diet Consultation Scheduling Completed
                        </span>
                    </div>
                    <div v-else>
                        <span class="text-warning">
                            🥗 Dietitian not assigned
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
                    v-if="scope.row.programs[0].dietitian || !scope.row.programs[0].trainer"
                    type="primary"
                    size="small"
                    @click="assignTrainerView(scope.row)" class="table_button">
                    Assign
                    </base-button>


                    <!-- <base-button v-b-modal.modal-2
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
                    </base-button> -->
                </template>
            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
    <b-modal id="modal-1" title="Assign Trainer & Dietitian" hide-footer v-if="showModal" @close="showModal = false">
        <b-form @submit.prevent="assignTrainer">
            <h6 class="heading-small text-muted mb-2">Assign Trainer & Dietitian</h6>
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="6">
                        <base-input
                        type="text"
                        label="Program Selected"
                        v-model="selectedProgram"
                        disabled
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="text"
                        label="Program Time"
                        v-model="selectedProgramTime"
                        disabled
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input label="Choose Trainer">
                            <select class="form-control" v-model="assignedata.trainer" required>
                                <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">{{ trainer.name }}</option>
                            </select>
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input label="Choose Dietitian">
                            <select class="form-control" v-model="assignedata.dietitian" required>
                                <option v-for="dietitian in dietitians" :key="dietitian.id" :value="dietitian.id">{{ dietitian.name }}</option>
                            </select>
                        </base-input>
                    </b-col>
                </b-row>
            </div>
            <!-- Custom buttons -->
            <div>
                <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                <b-button type="submit" variant="primary">Assign</b-button>
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
        showModal: false,
        clients: [],
        currentPage: 1,
        assignedata:{
            trainer : '',
            dietitian: ''
        },
        clientdetails:{
            current_acitivity_level: '',
            current_workouts: '',
            physical_limitations: '',
            equipment_owned: '',
            no_of_consultation: 1
        },
        selectedClientID: '',
        selectedProgram: '',
        selectedProgramTime: '',
        trainers: [],
        dietitians: []
      };
    },
    methods:{
        async newclientList(){
            const token = localStorage.getItem('token');
            axios.get('http://127.0.0.1:8000/api/user/salesclientList', {
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
        assignTrainerView(client)
        {
            this.showModal = true;
            this.selectedClientID = client.id;
            this.selectedProgram = client.programs[0].program.name;
            this.selectedProgramTime = client.programs[0].preferred_time[0];
        },
        async fetchTrainers()
        {
            const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/byrole/3/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.trainers = response.data;
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        async fetchDietitians()
        {
            const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/byrole/4/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.dietitians = response.data;
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        assignTrainer()
        {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('dietitian_id', this.assignedata.dietitian);
            formData.append('trainer_id', this.assignedata.trainer);
            formData.append('client_id', this.selectedClientID);

            axios.post('http://127.0.0.1:8000/api/user/assignTrainerDietitian', formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                console.log('Assigned Trainer&Dietitian successfully:', response.data);
                this.showModal = false;
                this.newclientList();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        }
    },
    mounted()
    {
        this.newclientList();
        this.fetchTrainers();
        this.fetchDietitians();

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
