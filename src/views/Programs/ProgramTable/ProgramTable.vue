<template>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Program List</h3>
            <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button>
        </b-card-header>
       
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="programs">
            <el-table-column label="Name"
                             min-width="140px"
                             prop="name">
            </el-table-column>
           

            <el-table-column label="Program Type"
                             min-width="170px"
                             >
                             <template #default="scope">
                            {{ scope.row.program_type.join(', ') }}
                            </template>
            </el-table-column>

           
            <el-table-column label="Action"
                             prop="completion"
                             min-width="240px">
                <div class="">
                    <a href="#" class="table-icons" data-toggle="tooltip"
                       data-original-title="View">
                       <i class="ni ni-circle-08"></i>
                    </a>
                    <a href="#" class="table-icons" data-toggle="tooltip"
                       data-original-title="Edit">
                        <i class="ni ni-settings text-yellow"></i>
                    </a>
                    <a href="#" class="table-icons" data-toggle="tooltip"
                       data-original-title="Delete">
                        <i class="ni ni-fat-remove text-red"></i>
                    </a>
                </div>
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
        programs: [],
        currentPage: 1
      };
    },
    methods:{
        async userList(){
            axios.get('${process.env.VUE_APP_API_BASE_URL}ProgramList')
            .then(response => {
                this.programs = response.data;
                console.log(response.data[1].program_type);
                
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
        this.userList();
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
