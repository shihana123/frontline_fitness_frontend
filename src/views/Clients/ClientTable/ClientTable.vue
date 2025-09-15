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

            <el-table-column label="Actions" min-width="180">
                <template slot-scope="scope">
                    <base-button
                        type="primary"
                        size="small"
                        class="table_button" @click="clientView(scope.row.id)">
                        View
                    </base-button>
                    
                    <!-- <base-button v-if="scope.row.paused && current_date >= scope.row.paused_details.paused_from"
                        type="danger"
                        size="small"
                        class="table_button" disabled>
                        Paused
                    </base-button>

                    <span class="text-danger" v-if="scope.row.paused && current_date < scope.row.paused_details.paused_from">
                        <br>Pause from {{ scope.row.paused_details.paused_from }}
                    </span> -->

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
   
</div>
</template>

<script>
  import axios from 'axios'
  import projects from '../../Tables/projects'
  import { Table, TableColumn, Pagination } from 'element-ui'
  import { useRouter } from 'vue-router';
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Pagination.name]: Pagination,
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
        paginationChanged(page) {
            this.currentPage = page;
        },
        async clientList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}clientList`, {
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
        handleNewClient(client)
        {
            this.selectedClientID = client.id;
            console.log(this.selectedClientID);
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
</style>
