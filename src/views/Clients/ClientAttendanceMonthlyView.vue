<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
     
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <client-attendance-monthly/>
        </b-col>
      </b-row>
      
    </b-container>
  </div>
</template>
<script>
 
  import ClientAttendanceMonthly from "./ClientAttendance/ClientAttendanceDetailsMonthly";

  export default {
    components: {
      ClientAttendanceMonthly,
    },
    data() {
      return {
      };
    }
  };
</script>
<style>

</style>
