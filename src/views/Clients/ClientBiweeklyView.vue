<template>
  <div>
    <div class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      
    </div>

    <b-container fluid class="mt--6">
      <b-row>
        <!-- <b-col xl="4" class="order-xl-2 mb-5">
          <client-card></client-card>
        </b-col> -->
        <b-col xl="12" class="order-xl-1">
          <client-biweekly-updates></client-biweekly-updates>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
//   import ClientCard from './ClientsDetails/ClientCard.vue';
  import ClientBiweeklyUpdates from './ClientsDetails/ClientBiweeklyUpdates.vue';

  export default {
    components: {
      ClientBiweeklyUpdates,
    //   ClientCard
    }
  };
</script>
<style>
</style>
