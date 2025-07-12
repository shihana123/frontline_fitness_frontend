<template>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <!-- Card stats -->
        <template>
            <div class="month_year_block">
                <select class="form-control monthSelector mr-2" v-model="currentYear"  @change="onDataChange">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
                <select class="form-control monthSelector" v-model="currentMonth"  @change="onDataChange">
                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
            </div>
        </template>
        
        <br>
      <b-row>
        <b-col xl="3" md="6">
          <stats-card title="Active Clients"
                      type="gradient-red"
                      :sub-title=String(active_client_count)
                      icon="ni ni-active-40"
                      class="mb-4">

            <template slot="footer">
              
              <span class="text-nowrap mr-2"></span>
              <span class="text-success">{{currentMonth}},{{currentYear}}</span>
            </template>
          </stats-card>
        </b-col>
        
      </b-row>
    </base-header>
</template>

<script>
    import axios from 'axios'
    export default {
    data() {
        const today = new Date();
        const monthNames = [
        'January', 'Februray', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const years = [2025]
        return {
            active_client_count : 0,
            currentYear: today.getFullYear().toString(),  // "2025"
            currentMonth: monthNames[today.getMonth()], 
            months: monthNames,
            years: years
        };
    },
    methods: {
        async activeClientCount()
        {
            const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/fetchActiveClients/${this.currentMonth}/${this.currentYear}/   `, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.active_client_count = response.data.active_client_count;
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
        },
        onDataChange()
        {
          this.activeClientCount();
        }
     
    },
   
    mounted() {
      this.activeClientCount()
    }
  };
</script>
<style>
    .monthSelector
    {
        width: 20%;
    }
    .month_year_block{
        display: flex;
    }
</style>