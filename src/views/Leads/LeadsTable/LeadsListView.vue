<template>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Leads List</h3>
            <b-button  variant="success" class="create_btn" @click="redirect()">Add Lead</b-button>
        </b-card-header>
       
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="leads">
            <el-table-column label="#" type="index"  :index="indexMethod">
            </el-table-column>
            <el-table-column label="Name"
                             min-width="140px"
                             prop="name">
            </el-table-column>
            <el-table-column label="Source"
                             min-width="170px"
                             prop="source"
                             >
            </el-table-column>
            <el-table-column label="Phone"
                             min-width="170px"
                             prop="phone"
                             >
            </el-table-column>
            <el-table-column label="Followup Date"
                             min-width="170px"
                             prop="follow_up_date"
                             >
            </el-table-column>
            <el-table-column label="Status"
                             min-width="170px"
                             prop="status"
                             >
            </el-table-column>
           
            <el-table-column label="Action"
                             min-width="240px">
                <template #default="scope">
                    <div class="btn_display">
                        <b-button  variant="info"  @click="followup(scope.row.id)">Update</b-button>
                        <base-button v-b-modal.modal-1
                            type="primary"
                            size="small"
                            @click="redirectLead(scope.row)" class="table_button">
                            Follow Ups
                        </base-button>
                    </div>
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
  import { Table, TableColumn} from 'element-ui'
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        leads: [],
        currentPage: 1,
        selectedLeadID: ''
      };
    },
    methods:{
        async leadsList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}leadsList`, {
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
</style>
