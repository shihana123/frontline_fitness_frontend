<template>
    <div>
        <b-card no-body>
            <b-card-header class="border-0 header-sec">
                <h3 class="mb-0">Pending PT Sessions</h3>
                <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Add Lead</b-button> -->
            </b-card-header>

            <b-tabs pills  class="ml-2">
                <!-- <b-tab active> -->
                    <template v-slot:title>
                        <i class="ni ni-bell-55 mr-2"></i> Pending PT Sessions
                    </template>
                        <div class="search_bar d-flex justify-content-end">
                            <base-input
                            style="width: 35%"
                            v-model="sessionsearchQuery"
                            prepend-icon="fas fa-search"
                            placeholder="Search Tasks..."
                            />
                        </div>
                        <el-table :data="sessionpaginatedData"
                        style="width: 100%"
                        class="table-responsive table"
                        header-row-class-name="thead-light"
                        @selection-change="sessionselectedRows = $event">
                            <el-table-column label="#" min-width="80">
                                <template slot-scope="scope">
                                    {{ (sessioncurrentPage - 1) * sessionperPage + scope.$index + 1 }}
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-for="(col, index) in sessiontableColumns"
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
                                
                                    <base-button size="sm" type="info" v-b-modal.modal-1  @click="updateSession(scope.row.id)">
                                        Update
                                    </base-button>
                                    
                                </template>
                            </el-table-column>
                            
                        </el-table>
                        <b-card-footer class="py-4 d-flex justify-content-end">
                            <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="filteredSessions.length"
                            :page-size="sessionperPage"
                            :current-page.sync="sessioncurrentPage"
                            @current-change="sessionpaginationChanged"
                            class="mt-3 d-flex justify-content-end"
                            />
                        </b-card-footer>
                
                <!-- </b-tab> -->
                
               
            </b-tabs>
            
        </b-card>
        <b-modal id="modal-1" size="lg" title="Update Task" hide-footer v-if="showSessionModal" @close="showSessionModal = false">
            <b-form @submit.prevent="updateSessionData">
                <h6 class="heading-small text-muted mb-2">Update Task</h6>
                <div class="pl-lg-12">
                    <b-row>

                        <b-col lg="12">
                            <base-input label="Status">
                                <select class="form-control" v-model="sessionUpdateData.status">
                                    <option value="1">Completed</option>
                                    <option value="0">Cancelled</option>
                                </select>
                            </base-input>
                        </b-col>
                        
                        <b-col lg="12" v-if="sessionUpdateData.status === '0'">
                            <base-input label="Cancelled by">
                                <select class="form-control" v-model="sessionUpdateData.canceled_by">
                                    <option>Client</option>
                                    <option>Trainer</option>
                                </select>
                            </base-input>
                        </b-col>


                        <b-col lg="12">
                            <base-input label="Notes">
                                <textarea class="form-control" id="notes" rows="3" col="5" v-model="sessionUpdateData.notes" required></textarea>
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
  import { Table, TableColumn, Pagination} from 'element-ui'
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Pagination.name]: Pagination,
    },
    data() {
      return {
        showSessionModal: false,
        
        sessions: [],
        selectedID: '',
        sessioncurrentPage: 1,
        sessionperPage: 10,
        sessionselectedRows: [],
        sessionsearchQuery: '',
       
        sessiontableColumns: [
            { prop: 'entity_data.name', label: 'Client', minWidth: 140, sortable: true },
            { prop: 'session_no', label: 'Session', minWidth: 140, sortable: true },
            { prop: 'session_date', label: 'Session Date', minWidth: 140, sortable: true },
            { prop: 'entity_data.programs[0].program.name', label: 'Program', minWidth: 140, sortable: true },
            { prop: 'entity_data.programs[0].preferred_time[0]', label: 'Time', minWidth: 140, sortable: true },
        ],
       
        sessionUpdateData:{
            status: 1,
            canceled_by: null,
            notes: ''
        }
      };
    },
    computed: {
        
        filteredSessions()
        {
            if (!this.sessionsearchQuery) return this.sessions;

            const query = this.sessionsearchQuery.toLowerCase();

            return this.sessions.filter(session => {
                const name = session.entity_data.name || '';
                const session_no = session.session_no  || '';
                const session_date = session.session_date  || '';
                const program = session.entity_data.programs[0].program.name  || '';
                const program_time = session.entity_data.programs[0].preferred_time[0]  || '';
            

                return (
                    name.toLowerCase().includes(query) ||
                    // session_no.includes(query) ||
                    session_date.includes(query) ||
                    program.toLowerCase().includes(query) ||
                    program_time.includes(query) 
                );
            });

            return this.sessions;
        },
        sessionpaginatedData() {
            const start = (this.sessioncurrentPage - 1) * this.sessionperPage;
            const end = this.sessioncurrentPage * this.sessionperPage;
            return this.filteredSessions.slice(start, end);
        },
        
    },
    watch: {
       
        sessionsearchQuery()
        {
            this.sessioncurrentPage = 1;
        },
      
    },
    methods:{
        
        sessionpaginationChanged(page){
            this.sessioncurrentPage = 1;
        },
        
        
        async sessionList()
        {
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}sessionList`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.sessions = response.data;
                console.log(response.data);
                
                // console.log('programs fetched successfully:', response.data);
            })
            .catch(error => {
                console.error('Error fetching Sessions:', error.response && error.response.data ? error.response.data : error);

            });
        },
       
        updateSession(id)
        {
           this.selectedID = id;
           this.showSessionModal = true;
        },
       
        
        updateSessionData()
        {
            console.log(this.selectedID); 
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('session_id', this.selectedID);
            formData.append('status', this.sessionUpdateData.status);
            formData.append('canceled_by', this.sessionUpdateData.canceled_by);
            formData.append('notes', this.sessionUpdateData.notes);

            axios.post(`${process.env.VUE_APP_API_BASE_URL}updateDailySessions`, formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                console.log('Task updated successfully:', response.data);
                this.showSessionModal = false;
               
                this.sessionList();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        }
       
    },
    mounted()
    {
        this.sessionList();
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
    .btn_display
    {
        display: inline-flex;
    }
    .search_bar
    {
        margin-right: 5px;
    }
</style>
