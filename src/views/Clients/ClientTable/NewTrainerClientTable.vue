<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">New Client List</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <div class="search_bar d-flex justify-content-end mr-2">
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

            <el-table-column label="Actions" min-width="180">
                <template slot-scope="scope">
                    <!-- <a href="#" class="table-icons" data-toggle="tooltip" title="View">
                        <i class="ni ni-circle-08"></i>
                    </a> -->

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
                    @click="ClientDataEnter(scope.row)" class="table_button">
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
    <b-modal id="modal-1" title="Schedule First Consultation" hide-footer v-if="schedule_modal">
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

    <b-modal id="modal-2" title="Details of Client" hide-footer v-if="data_modal">
        <b-form @submit.prevent="enterClientDetails">
            <h6 class="heading-small text-muted mb-2">Enter Details after First Consulation</h6>
            <div class="pl-lg-12" v-if="basic_details">
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
                <!-- Custom buttons -->
                <div>
                    <b-button variant="secondary" @click="$bvModal.hide('modal-2')">Cancel</b-button>
                    <b-button type="button" variant="primary" @click="showMoredetails()">Next</b-button>
                </div>
            </div>
            <div class="pl-lg-12" v-if="more_details">
                    <b-row>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Half Sit-Up"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.half_sit_up"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Modified Push ups"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.modified_push_ups"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Plank Hold"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.plank_hold"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Wall Squat Hold"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.wall_sqaut_hold"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Shoulder Flexibility(0-5 Scale)"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.shoulder_flexibility"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Sit and Reach(0-5 Scale)"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.sit_and_reach"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Hamstring Flexibility(0-5 Scale)"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.hamstring_flexibility"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Quadriceps Flexibility(0-5 Scale)"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.quadriceps_flexibility"
                        required
                        >
                        </base-input>
                        
                    </b-col>

                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Rounded Shoulder"
                        placeholder="Rounded Shoulder"
                        v-model="clientdetails.rounded_shoulder"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Kyphosis"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.kyphosis"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Lordosis"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.lordosis"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Scoliosis"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.scoliosis"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Bow Leg"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.bow_leg"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Knock Knees"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.knock_knees"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Winging of Scapula"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.winging_of_scapula"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Flat Foot"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="clientdetails.flat_foot"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="clientdetails.notes" required></textarea>
                        </base-input>
                        
                    </b-col>
                    <div>
                        <b-button variant="secondary" @click="showBasicdetails()">Prev</b-button>
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
  import { Table, TableColumn, Pagination } from 'element-ui'
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Pagination.name]: Pagination,
    },
    data() {
      return {
        basic_details: true,
        more_details: false,
        schedule_modal: false,
        data_modal: false,
        clients: [],
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
            half_sit_up : '',
            modified_push_ups : '',
            plank_hold : '',
            wall_sqaut_hold : '',
            shoulder_flexibility : '',
            sit_and_reach : '',
            hamstring_flexibility : '',
            quadriceps_flexibility : '',
            rounded_shoulder : '',
            kyphosis : '',
            lordosis : '',
            scoliosis : '',
            bow_leg : '',
            knock_knees : '',
            winging_of_scapula : '',
            flat_foot : '',
            notes: '',
            no_of_consultation: 1
        },
        selectedClientID: '',
        currentPage: 1,
        perPage: 10,
        searchQuery: '', 
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
    watch: {
        searchQuery() {
            this.currentPage = 1;
        }
    },
     computed: {
        filteredClients() {
            if (!this.searchQuery) return this.clients;

            const query = this.searchQuery.toLowerCase();
            return this.clients.filter(client => {
                const name = client.name || '';
                const client_id = client.client_id || '';
                const program = client.programs[0].program.name || '';
                // const country = client.country_name || '';

                return (
                name.toLowerCase().includes(query) ||
                client_id.includes(query) ||
                program.toLowerCase().includes(query)
                // country.toLowerCase().includes(query)
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
        showMoredetails()
        {
            this.basic_details = false;
            this.more_details = true;
        },
        showBasicdetails()
        {
            this.basic_details = true;
            this.more_details = false;
        },
        paginationChanged(page) {
            this.currentPage = page;
        },
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
            this.schedule_modal = false;
            this.newclientList();
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
            formData.append('half_sit_up', this.clientdetails.half_sit_up);
            formData.append('modified_push_ups', this.clientdetails.modified_push_ups);
            formData.append('plank_hold', this.clientdetails.plank_hold);
            formData.append('wall_sqaut_hold', this.clientdetails.wall_sqaut_hold);
            formData.append('shoulder_flexibility', this.clientdetails.shoulder_flexibility);
            formData.append('sit_and_reach', this.clientdetails.sit_and_reach);
            formData.append('hamstring_flexibility', this.clientdetails.hamstring_flexibility);
            formData.append('quadriceps_flexibility', this.clientdetails.quadriceps_flexibility);
            formData.append('rounded_shoulder', this.clientdetails.rounded_shoulder);
            formData.append('kyphosis', this.clientdetails.kyphosis);
            formData.append('lordosis', this.clientdetails.lordosis);
            formData.append('scoliosis', this.clientdetails.scoliosis);
            formData.append('bow_leg', this.clientdetails.bow_leg);
            formData.append('knock_knees', this.clientdetails.knock_knees);
            formData.append('winging_of_scapula', this.clientdetails.winging_of_scapula);
            formData.append('flat_foot', this.clientdetails.flat_foot);
            formData.append('notes', this.clientdetails.notes);

            axios.post(`${process.env.VUE_APP_API_BASE_URL}dietitianconsulation_details`, formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
            console.log('Program created successfully:', response.data);
            this.data_modal = false;
            this.newclientList();
            })
            .catch(error => {
            console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);

            });
        },
        handleNewClient(client)
        {
            this.selectedClientID = client.id;
            this.schedule_modal = true;
        },
        ClientDataEnter(client)
        {
            this.selectedClientID = client.id;
            this.data_modal = true;
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
