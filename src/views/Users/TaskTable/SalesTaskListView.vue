<template>
    <div>
        <b-card no-body>
            <b-card-header class="border-0 header-sec">
                <h3 class="mb-0">Daily Tasks</h3>
                <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Add Lead</b-button> -->
            </b-card-header>
        <div class="search_bar d-flex justify-content-end">
                <base-input
                style="width: 35%"
                v-model="searchQuery"
                prepend-icon="fas fa-search"
                placeholder="Search Tasks..."
                />
            </div>
            <el-table :data="paginatedData"
            style="width: 100%"
            class="table-responsive table"
            header-row-class-name="thead-light"
            @selection-change="selectedRows = $event">
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
                       
                        <base-button size="sm" type="info" v-b-modal.modal-1  @click="updateTask(scope.row.id)">
                            Update
                        </base-button>
                    
                        <base-button v-if="scope.row.task_type == 'Lead Calls'" size="sm" type="warning" @click="redirectLead(scope.row)">
                            Followups
                        </base-button>

                        
                    </template>
                </el-table-column>
                
            </el-table>
            <b-card-footer class="py-4 d-flex justify-content-end">
                <el-pagination
                background
                layout="prev, pager, next"
                :total="filteredLeads.length"
                :page-size="perPage"
                :current-page.sync="currentPage"
                @current-change="paginationChanged"
                class="mt-3 d-flex justify-content-end"
                />
            </b-card-footer>
        </b-card>
        <b-modal id="modal-1" size="lg" title="Update Task" hide-footer v-if="showModal" @close="showModal = false">
            <b-form @submit.prevent="updateDailyTask">
                <h6 class="heading-small text-muted mb-2">Update Task</h6>
                <div class="pl-lg-12">
                    <b-row>
                        <b-col lg="6">
                            <base-input label="Connected *">
                                <select class="form-control" v-model="updateData.connected" required>
                                    <option value="True">Connected</option>
                                    <option value="False">Not Connected</option>
                                </select>
                            </base-input>
                        </b-col>
                        <b-col lg="6">
                            <base-input
                            type="date"
                            label="Next Date *"
                            v-model="updateData.next_date"
                            :disabled="updateData.connected === 'True'"
                            
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="6">
                            <base-input label="Notes">
                                <textarea class="form-control" id="notes" rows="3" col="5" v-model="updateData.notes" required ></textarea>
                            </base-input>
                        </b-col>
                    </b-row>
                </div>
                <!-- Custom buttons -->
                <div>
                    <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                    <b-button type="submit" variant="primary">Update</b-button>
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
        showModal: false,
        leads: [],
        currentPage: 1,
        selectedID: '',
        currentPage: 1,
        perPage: 10,
        selectedRows: [],
        searchQuery: '', 
        tableColumns: [
            { prop: 'task_type', label: 'Task Type', minWidth: 140, sortable: true },
            { prop: 'date', label: 'Date', minWidth: 140, sortable: true },
            // { prop: 'status', label: 'Status', minWidth: 140, sortable: true },
            { prop: 'entity_data.name', label: 'Client', minWidth: 140, sortable: true },
            
        ],
        updateData:{
            connected: 'True',
            next_date: '',
            notes: ''
        }
      };
    },
    computed: {
        filteredLeads() {
            if (!this.searchQuery) return this.leads;

            const query = this.searchQuery.toLowerCase();

            return this.leads.filter(lead => {
                const name = lead.name || '';
                const statusText = lead.status;
                const country = lead.country_name;
                const source = lead.source;
            

                return (
                name.toLowerCase().includes(query) ||
                statusText.toLowerCase().includes(query) ||
                country.toLowerCase().includes(query) ||
                source.toLowerCase().includes(query) 
                );
            });
        },
        paginatedData() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = this.currentPage * this.perPage;
        return this.filteredLeads.slice(start, end);
        }
    },
    watch: {
        searchQuery() {
            this.currentPage = 1;
        }
    },
    methods:{
        paginationChanged(page) {
            this.currentPage = page;
        },
        async taskList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}taskList`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.leads = response.data;
                console.log(response.data);
                
                // console.log('programs fetched successfully:', response.data);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        updateTask(id)
        {
           this.selectedID = id;
           this.showModal = true;
        },
        redirectLead(lead)
        {  
            this.selectedID = lead.client;
            this.$router.push(`/leads/follow_ups/${this.selectedID}`);
        },
        updateDailyTask()
        {  
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('task_id', this.selectedID);
            formData.append('connected', this.updateData.connected);
            formData.append('date', this.updateData.next_date);
            formData.append('notes', this.updateData.notes);

            axios.post(`${process.env.VUE_APP_API_BASE_URL}updateDailyTask`, formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                console.log('Task updated successfully:', response.data);
                this.showModal = false;
                this.taskList();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        },
       
    },
    mounted()
    {
        this.taskList();
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
