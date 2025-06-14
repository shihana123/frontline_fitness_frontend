<template>
  <div>
    <div class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      
    </div>

    <b-container fluid class="mt--8">
      <b-row>
        <b-col xl="12" class="order-xl-1">
          <lead-edit></lead-edit>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import LeadEdit from './LeadsForm/LeadsEdit.vue';

  export default {
    components: {
      LeadEdit
    }
  };
</script>
<style>
</style>
