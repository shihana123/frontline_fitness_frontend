<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
     
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <client-table></client-table>
        </b-col>
      </b-row>
      
    </b-container>
  </div>
</template>
<script>
  import ClientTable from "./ClientTable/PausedClientTable";
  import axios from 'axios'
  export default {
    components: {
      ClientTable
    },
    data() {
      return {
        usersRole: ''
      };
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
