<template>
  <div>

    <status-card></status-card>
    
  </div>
</template>
<script>
  // Charts
    import StatusCard from './dietitian/DietitianstatusCard.vue';

  export default {
    components: {
      StatusCard,
    },
    data() {
      return {
        
       
      };
    },
    methods: {
      
    },
    mounted() {
      this.initBigChart(0);
      // console.log(localStorage.getItem('token'));
    }
  };
</script>
<style>
.el-table .cell{
  padding-left: 0px;
  padding-right: 0px;
}
</style>
