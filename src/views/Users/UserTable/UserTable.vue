<template>
    <b-card no-body>
        <b-card-header class="border-0">
            <h3 class="mb-0">Users List</h3>
        </b-card-header>
        {{ users }}

        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="users">
            <el-table-column label="Name"
                             min-width="140px"
                             prop="name">
            </el-table-column>
            <el-table-column label="Role"
                             prop="roles[0].role.rolename"
                             min-width="140px">
            </el-table-column>

            <el-table-column label="Email"
                             min-width="170px"
                             prop="email">
            </el-table-column>

            <el-table-column label="Phone" 
                             min-width="190px"
                             prop="phone">
                
            </el-table-column>

            <el-table-column label="Action"
                             prop="completion"
                             min-width="240px">
                <div class="">
                    <a href="#" class="avatar-sm rounded-circle" data-toggle="tooltip"
                       data-original-title="View">
                        <i class="ni ni-eye"></i>
                    </a>
                    <a href="#" class="avatar-sm rounded-circle" data-toggle="tooltip"
                       data-original-title="Edit">
                        <i class="ni ni-pencil"></i>
                    </a>
                    <a href="#" class="avatar-sm rounded-circle" data-toggle="tooltip"
                       data-original-title="Delete">
                        <i class="ni ni-trash"></i>
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
        users,
        currentPage: 1
      };
    },
    methods:{
        async userList(){
            axios.get('http://127.0.0.1:8000/api/user/userList')
            .then(response => {
                this.users = response.data;
                console.log('User fetched successfully:', response.data);
            })
            .catch(error => {
                console.error('Error creating user:', error.response && error.response.data ? error.response.data : error);

            });
        }
    },
    mounted()
    {
        this.userList();
    }

  }
</script>
