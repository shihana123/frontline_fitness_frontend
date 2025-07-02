<template>
  <div>

    <status-card></status-card>
    <div class="ml-5 mr-5">
      <missed-consultation></missed-consultation>
    </div>
    
    
  </div>
</template>
<script>
  // Charts
    import StatusCard from './dietitian/DietitianstatusCard.vue';
    import MissedConsultation from './../Clients/ClientTable/MissedDietitianConsultationScheduleTable.vue'

  export default {
    components: {
      StatusCard,
      MissedConsultation
    },
    data() {
      return {
        
       
      };
    },
    methods: {
      
    },
    
  };
</script>
<style>
.el-table .cell{
  padding-left: 0px;
  padding-right: 0px;
}
</style>
