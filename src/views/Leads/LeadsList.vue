<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
     
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        <b-col v-if="usersRole == 'Sales'">
          <leads-table/>
        </b-col>
        <b-col v-else-if="usersRole == 'Admin'">
          <admin-leads-table/>
        </b-col>
      </b-row>
      
    </b-container>
  </div>
</template>
<script>
  import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn } from 'element-ui';
  import projects from '../Tables/projects'
  import users from '../Tables/users'
  import LeadsTable from "./LeadsTable/LeadsListView";
  import AdminLeadsTable from "./LeadsTable/AdminLeadsListView";
  import axios from 'axios'

  export default {
    components: {
      LeadsTable,
      AdminLeadsTable,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        usersRole: ''
      };
    },
    methods:
    {
      async getRole()
      {
        const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}getRole`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                
                this.usersRole = response.data.roles[0];
                console.log(this.usersRole);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
      }
    },
    mounted()
    {
      this.getRole();
    }
  };
</script>
<style>
.el-table.table-dark{
  background-color: #172b4d;
  color: #f8f9fe;
}

.el-table.table-dark th,
.el-table.table-dark tr{
  background-color: #172b4d;
}

.el-table.table-dark td,
.el-table.table-dark th.is-leaf{
  border-bottom: none;
}
</style>
