<template>
  <div>

    <status-card></status-card>
    <vmc-graph></vmc-graph>

  </div>
</template>
<script>
  // Charts
    import StatusCard from './vmc/VMCstatusCard.vue';
    import VmcGraph from './vmc/VMCGraph.vue';

  export default {
    components: {
      StatusCard,
      VmcGraph
    },
  };
</script>
<style>
.el-table .cell{
  padding-left: 0px;
  padding-right: 0px;
}
</style>
