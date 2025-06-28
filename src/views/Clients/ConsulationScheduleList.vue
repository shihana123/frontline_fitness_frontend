<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
     
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        
        <b-col v-if="role == 'Trainer'">
          <consultation-table></consultation-table>
        </b-col>
        <b-col v-else-if="role == 'Dietitian'">
          <dietitian-consultation-table></dietitian-consultation-table>
        </b-col>
      </b-row>
      
    </b-container>
  </div>
</template>
<script>
  import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn } from 'element-ui';
  import ConsultationTable from "./ClientTable/ConsultationScheduleTable";
  import DietitianConsultationTable from "./ClientTable/DietitianConsultationScheduleTable";

  export default {
    components: {
      ConsultationTable,
      DietitianConsultationTable
    },
    data() {
      return {
        role: localStorage.getItem('role_name')
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
