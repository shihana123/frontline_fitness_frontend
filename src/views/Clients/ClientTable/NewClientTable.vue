<template>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">New Client List</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>
       
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="clients">
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
                             min-width="110px"
                             prop="programs[0].program.name">
            </el-table-column>

            <el-table-column label="Consulation Status"
                             min-width="140px"
                             prop="consulationstatus">
                <template #default="scope">
                    <div>
                        <span v-if="!scope.row.trainer_first_consultation" class="text-warning">
                            🏋️ Trainer Consultation Pending
                        </span>
                        <span v-else class="text-success">
                            ✅ Trainer Consultation Completed
                        </span>
                    </div>

                    <div>
                        <span v-if="!scope.row.diet_first_consultation" class="text-warning">
                            🥗 Diet Consultation Pending
                        </span>
                        <span v-else class="text-success">
                            ✅ Diet Consultation Completed
                        </span>
                    </div>
                </template>
            </el-table-column>
           
            <el-table-column label="Action"
                             prop="completion"
                             min-width="140px">
                <template #default="scope">
                    <base-button
                    v-if="scope.row.new_client || !scope.row.trainer_first_consultation"
                    type="primary"
                    size="small"
                    @click="handleNewClient(scope.row)">
                    First Consultation
                    </base-button>

                    <!-- You can add other actions here for non-new clients -->
                    <el-button
                    v-else
                    type="success"
                    size="small"
                    @click="handleExistingClient(scope.row)">
                    Existing Client
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
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
        currentPage: 1
      };
    },
    methods:{
        async newclientList(){
            axios.get('http://127.0.0.1:8000/api/user/clientList')
            .then(response => {
                this.clients = response.data;
                console.log(response.data);
                
                // console.log('programs fetched successfully:', response.data);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        redirect()
        {
            this.$router.push('/programs/create');
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
</style>
