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
                             width="120"
                             prop="client_id">
            </el-table-column>
            <el-table-column label="Name"
                             width="120"
                             prop="name">
            </el-table-column>
            <el-table-column label="Phone"
                             
                             prop="phone">
            </el-table-column>

            <el-table-column label="Program"
                            
                             prop="programs[0].program.name">
            </el-table-column>
            
            <!-- <el-table-column label="Consulation Status"
                             
                             prop="consulationstatus">
                <template #default="scope">
                    <div v-if="scope.row.programs[0].trainer">
                        <span v-if="!scope.row.trainer_first_consultation" class="text-warning">
                            🏋️ Trainer Consultation Scheduling Pending
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
            </el-table-column> -->
           
            <el-table-column label="Action"
                             prop="completion"
                             >
                <template #default="scope">
                    <div class="btn_display">
                        <base-button v-b-modal.modal-1
                        v-if="!scope.row.programs[0].dietitian || !scope.row.programs[0].trainer"
                        type="primary"
                        size="small"
                        @click="assignTrainerView(scope.row)" class="table_button">
                        Assign
                        </base-button>
                        <base-button  v-else type="success" size="small" class="table_button">Assigned</base-button>

                        <base-button
                        type="primary"
                        size="small"
                        @click="redirectClient(scope.row.id)" class="table_button">
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
    <b-modal id="modal-1" size="lg" title="Assign Trainer & Dietitian" hide-footer v-if="showModal" @close="showModal = false">
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
                        <base-input label="Choose Program Months">
                            <select class="form-control" v-model="assignedata.program_month" required>
                                <option v-for="program_month in program_months" :key="program_month" :value="program_month">{{ program_month }}</option>
                            </select>
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="text"
                        label="Amount"
                        v-model="assignedata.amount"
                        required
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="date"
                        label="Program Start Date"
                        v-model="assignedata.program_start_date"
                        required
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="date"
                        label="Program End Date"
                        v-model="assignedata.program_end_date"
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
    watch: {
        'assignedata.program_start_date': 'updateEndDate',
        'assignedata.program_month': 'updateEndDate',
    },
    data() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const yyyy = today.getFullYear();
      return {
        showModal: false,
        clients: [],
        currentPage: 1,
        assignedata:{
            trainer : '',
            dietitian: '',
            program_month: 3,
            amount: 0,
            program_start_date: `${yyyy}-${mm}-${dd}`,
            program_end_date: ''
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
        selectedProgramId: '',
        selectedProgramTime: '',
        trainers: [],
        dietitians: [],
        program_months: [1,3,6,9,12]
      };
    },
    created() {
        this.updateEndDate(); // call once to initialize program_end_date
    },
    methods:{
        updateEndDate() {
            if (!this.assignedata.program_start_date || !this.assignedata.program_month) return;

            const startDate = new Date(this.assignedata.program_start_date);
            const monthsToAdd = parseInt(this.assignedata.program_month);

            // Calculate new end date
            const endDate = new Date(startDate.setMonth(startDate.getMonth() + monthsToAdd));

            const yyyy = endDate.getFullYear();
            const mm = String(endDate.getMonth() + 1).padStart(2, '0');
            const dd = String(endDate.getDate()).padStart(2, '0');

            this.assignedata.program_end_date = `${yyyy}-${mm}-${dd}`;
        },
        async newclientList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}salesclientList`, {
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
            this.selectedProgramId = client.programs[0].program.id;
            
        },
        async fetchTrainers()
        {
            const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}byrole/3/`, {
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
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}byrole/4/`, {
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
            formData.append('program_month', this.assignedata.program_month);
            formData.append('amount', this.assignedata.amount);
            formData.append('client_id', this.selectedClientID);
            formData.append('program_start_date', this.assignedata.program_start_date);
            formData.append('program_end_date', this.assignedata.program_end_date);
            formData.append('program_id', this.selectedProgramId);

            axios.post(`${process.env.VUE_APP_API_BASE_URL}assignTrainerDietitian`, formData,{
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
        },
        redirectClient(client)
        {
            this.$router.push({ name: 'clients/view', params: { id: client } });
        }
    },
    mounted()
    {
        this.newclientList();
        this.fetchTrainers();
        this.fetchDietitians();
        console.log(this.assignedata.program_start_date);
        
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
        font-size: 9px !important;
        padding: 9px !important;
    }
     .btn_display
    {
        display: inline-flex;
    }
</style>
