<template>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Leads List</h3>
            <b-button  variant="success" class="create_btn" @click="redirect()">Add Lead</b-button>
        </b-card-header>
       <div class="search_bar d-flex justify-content-end">
            <base-input
            style="width: 35%"
            v-model="searchQuery"
            prepend-icon="fas fa-search"
            placeholder="Search Leads..."
            />
        </div>

        <b-row class="mb-2 ml-1">
            <b-col lg="3">
                <!-- <div class="search_bar d-flex ml-2"> -->
                    <label class="form-control-label">Status</label>
                    <select class="form-control" v-model="search_status">
                    <option v-for="stat in status" :value="stat">{{ stat }}</option>
                    </select>
                <!-- </div> -->
            </b-col>
            <b-col lg="3">
                <base-input
                type="date"
                label="From Date"
                v-model="from_date"
                required
                >
                </base-input>
            </b-col>
            <b-col lg="3">
                <base-input
                type="date"
                label="To Date"
                v-model="to_date"
                required
                >
                </base-input>
            </b-col>
        </b-row>

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
                   
                    <!-- <base-button size="sm" type="info" v-b-modal.modal-1  @click="followup(scope.row.id)">
                        Update
                    </base-button> -->
                
                    <base-button size="sm" type="warning" @click="redirectLead(scope.row)">
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
        search_status: 'New Lead',
        from_date: '',
        to_date: '',
        status: ['New Lead', 'Interested', 'Not Interested', 'Follow-up scheduled', 'CLosed/Lost', 'Converted', 'pending Payment'],
        leads: [],
        currentPage: 1,
        selectedLeadID: '',
        currentPage: 1,
        perPage: 10,
        selectedRows: [],
        searchQuery: '', 
        tableColumns: [
            { prop: 'name', label: 'Name', minWidth: 140, sortable: true },
            { prop: 'source', label: 'Source', minWidth: 140, sortable: true },
            { prop: 'status', label: 'Status', minWidth: 140, sortable: true },
            { prop: 'sales_id.name', label: 'Sales', minWidth: 140, sortable: true },
            { prop: 'phone', label: 'Phone', minWidth: 140, sortable: true },
            { prop: 'country_name', label: 'Country', minWidth: 140, sortable: true },
        ],
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
        },
        from_date() {
            this.triggerFilters();
        },
        to_date() {
            this.triggerFilters();
        },
        search_status() { // your status dropdown v-model
            this.triggerFilters();
        }
    },
    methods:{
        paginationChanged(page) {
            this.currentPage = page;
        },
        async leadsList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}allleadsList`, {
                headers: { Authorization: `Token ${token}` },
                params: {
                    status: this.search_status,     // always has a value
                    from_date: this.from_date || '', // empty if not provided
                    to_date: this.to_date || ''      // empty if not provided
                }
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
        followup(id)
        {
           this.$router.push(`/leads/edit/${id}`);
            
        },
        redirectLead(lead)
        {  
            this.selectedLeadID = lead.id;
            this.$router.push(`/leads/follow_ups/${this.selectedLeadID}`);
        },
        redirect()
        {
            this.$router.push('/leads/create');
        },
        triggerFilters() {
           
            // You can decide whether to require both dates or not
            if (this.from_date && this.to_date) {
                this.leadsList();
            } else if (!this.from_date && !this.to_date) {
                // if no dates, still allow status filtering
                this.leadsList();
            }
        }
    },
    mounted()
    {
        this.leadsList();
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
