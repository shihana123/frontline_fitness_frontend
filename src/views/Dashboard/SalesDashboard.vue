<template>
  <div>

    <status-card></status-card>
    <sales-graph></sales-graph>

  </div>
</template>
<script>
  // Charts
    import StatusCard from './sales/SalesstatusCard.vue';
    import SalesGraph from './sales/SalesGraph.vue';

  export default {
    components: {
      StatusCard,
      SalesGraph
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
