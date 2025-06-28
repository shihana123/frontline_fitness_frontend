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

            <el-table-column label="Workout Start Date"
                             min-width="90px"
                             prop="workout_start_date">
            </el-table-column>
            
           
            <el-table-column label="Action"
                             prop="completion"
                             min-width="95px">
                <template #default="scope">
                    <base-button
                    type="primary"
                    size="small"
                    class="table_button" @click="clientView(scope.row.id)">
                    View
                    </base-button>
                </template>
                

            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
   
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
        clients: [],
        currentPage: 1,
        scheduledata:{
            scheduledate : '',
            type: 'trainer',
            no_of_consultation: 1
        },
       
        selectedClientID: ''
      };
    },
    methods:{
        async clientList(){
            const token = localStorage.getItem('token');
            axios.get('http://127.0.0.1:8000/api/user/dietitianclientList', {
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
