<template>
  <div>
    <div class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      
    </div>

    <b-container fluid class="mt--8">
      <b-row>
        <b-col xl="12" class="order-xl-1">
          <program-form></program-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import ProgramForm from './ProgramForm/ProgramForm.vue';

  export default {
    components: {
      ProgramForm
    }
  };
</script>
<style>
</style>
