<template>
  <div>
    <div class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      
    </div>

    <b-container fluid class="mt--8">
      <b-row>
        <b-col xl="12" class="order-xl-1">
          <user-form></user-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import UserForm from './UserForm/UserForm.vue';

  export default {
    components: {
      UserForm
    }
  };
</script>
<style>
</style>
