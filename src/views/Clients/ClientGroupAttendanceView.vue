<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
     
    </base-header>
    <b-container fluid class="mt--7">
      <b-row>
        <b-col v-if="usersRole == 'Trainer'">
          <trainer-client-attendance/>
        </b-col>
      </b-row>
      
    </b-container>
  </div>
</template>
<script>
 
  import TrainerClientAttendance from "./ClientAttendance/ClientGroupAttendanceDetails";
  import axios from 'axios'
  
  export default {
    components: {
      TrainerClientAttendance,
    },
    data() {
      return {
        usersRole: ''
      };
    },
    methods:
    {
      async getRole()
      {
        const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}getRole`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                
                this.usersRole = response.data.roles[0];
                console.log(this.usersRole);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
      }
    },
    mounted()
    {
      this.getRole();
    }
  };
</script>
<style>

</style>
