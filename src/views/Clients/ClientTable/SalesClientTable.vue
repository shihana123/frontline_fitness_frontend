<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Client List</h3>
            <b-button  variant="success" class="create_btn" @click="redirect()">Create Client</b-button>
        </b-card-header>
        <div class="search_bar d-flex justify-content-end">
            <base-input
            style="width: 35%"
            v-model="searchQuery"
            prepend-icon="fas fa-search"
            placeholder="Search Clients..."
            />
        </div>
        <el-table
        :data="paginatedData"
        style="width: 100%"
        class="table-responsive table"
        header-row-class-name="thead-light"
        @selection-change="selectedRows = $event"
        >

            <el-table-column label="#" min-width="80">
                <template slot-scope="scope">
                    {{ (currentPage - 1) * perPage + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column
                v-for="(col, index) in tableColumns"
                :key="index"
                :prop="col.prop"
                :label="col.label"
                :min-width="col.minWidth"
                :sortable="col.sortable"
            >
            </el-table-column>
            
            <el-table-column label="Actions" min-width="180">
                <template slot-scope="scope">
                    <!-- <a href="#" class="table-icons" data-toggle="tooltip" title="View">
                        <i class="ni ni-circle-08"></i>
                    </a> -->

                    <base-button size="sm" type="info" v-b-modal.modal-1 @click="assignTrainerView(scope.row)" v-if="!scope.row.programs[0].dietitian || !scope.row.programs[0].trainer">
                        Assign
                    </base-button>
                    <base-button  v-else type="success" size="small" class="table_button">Assigned</base-button>
                
                    <base-button size="sm" type="warning" @click="redirectClient(scope.row.id)">
                        view
                    </base-button>

                    <base-button size="sm" type="danger" @click="deleteProgram(scope.row.id)">
                        delete
                    </base-button>
                </template>
            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredClients.length"
            :page-size="perPage"
            :current-page.sync="currentPage"
            @current-change="paginationChanged"
            class="mt-3 d-flex justify-content-end"
            />
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
                        <base-input label="Choose Program Months *">
                            <select class="form-control" v-model="assignedata.program_month" required>
                                <option v-for="program_month in program_months" :key="program_month" :value="program_month">{{ program_month }}</option>
                            </select>
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="text"
                        label="Amount *"
                        v-model="assignedata.amount"
                        required
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="date"
                        label="Program Start Date *"
                        v-model="assignedata.program_start_date"
                        required
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="date"
                        label="Program End Date *"
                        v-model="assignedata.program_end_date"
                        disabled
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input label="Choose Trainer *">
                            <select class="form-control" v-model="assignedata.trainer" required>
                                <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">{{ trainer.name }}</option>
                            </select>
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input label="Choose Dietitian *">
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
  import { Table, TableColumn, Pagination } from 'element-ui'
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Pagination.name]: Pagination,
    },
    watch: {
        'assignedata.program_start_date': 'updateEndDate',
        'assignedata.program_month': 'updateEndDate',
        searchQuery() {
            this.currentPage = 1;
        }
    },
    data() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const yyyy = today.getFullYear();
      return {
        showModal: false,
        clients: [],
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
        program_months: [1,3,6,9,12],
        currentPage: 1,
        perPage: 10,
        selectedRows: [],
        searchQuery: '',   // For storing search input
        tableColumns: [
            { prop: 'client_id', label: 'ID', minWidth: 140, sortable: true },
            { prop: 'name', label: 'Name', minWidth: 140, sortable: true },
            // { prop: 'status', label: 'Status', minWidth: 140, sortable: true },
            { prop: 'phone', label: 'Phone', minWidth: 140, sortable: true },
            { prop: 'programs[0].program.name', label: 'Program', minWidth: 140, sortable: true },
            { prop: 'country_name', label: 'Country', minWidth: 140, sortable: true },
        ],
      };
    },
    created() {
        this.updateEndDate(); // call once to initialize program_end_date
    },
    computed: {
        filteredClients() {
            if (!this.searchQuery) return this.clients;

            const query = this.searchQuery.toLowerCase();
            return this.clients.filter(client => {
                const name = client.name || '';
                const client_id = client.client_id || '';
                const program = client.programs[0].program.name || '';
                const country = client.country_name || '';

                return (
                name.toLowerCase().includes(query) ||
                client_id.includes(query) ||
                program.toLowerCase().includes(query) ||
                country.toLowerCase().includes(query)
                );
            });
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = this.currentPage * this.perPage;
            return this.filteredClients.slice(start, end);
        }
    },
    methods:{
        paginationChanged(page) {
            this.currentPage = page;
        },
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
            console.log(client);
            
            this.showModal = true;
            this.selectedClientID = client.id;
            this.selectedProgram = client.programs[0].program.name;
            this.selectedProgramTime = client.programs[0].preferred_time[0];
            this.selectedProgramId = client.programs[0].program.id;
            this.assignedata.trainer = client.leads[0].trainer;
            
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
        },
        redirect()
        {
            this.$router.push({ name: 'clients/create' });
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
    .search_bar
    {
        margin-right: 5px;
    }
</style>
