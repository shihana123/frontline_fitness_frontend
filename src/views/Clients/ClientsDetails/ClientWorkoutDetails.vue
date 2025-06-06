<template>
  <b-card no-body class="card-profile" alt="Image placeholder" img-top>
    <b-row class="justify-content-center">
      <b-col lg="3" class="order-lg-2">
        <div class="card-profile-image">
          <a href="#">
            <!-- <b-img src="img/theme/team-4.jpg" rounded="circle" /> -->
          </a>
        </div>
      </b-col>
    </b-row>

    <b-card-header class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
      <div class="d-flex justify-content-between">
        <a href="#" class="btn btn-sm btn-info mr-4">Weekly Workout Updates</a>
      </div>
    </b-card-header>
    <div v-for="(week, index) in workoutDetails" :key="index">
      <b-card-header  class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
        <div class="d-flex justify-content-between">
          <!-- <a href="#" v-b-toggle.collapse-1 class="btn btn-sm btn-success mr-4">Week{{ week['week_no'] }}</a> -->
          <a href="#" v-b-toggle="'collapse-' + week['week_no']" class="btn btn-sm btn-success mr-4">Week {{ week['week_no'] }}</a>
        </div>
      </b-card-header>
      <b-card-body class="pt-0">
        <b-row>
            <b-collapse :id="'collapse-' + week['week_no']">
              <b-container fluid>
                <b-row>
                  <b-col xl="6" md="6" sm="6" v-for="l in week['week_no_of_days']" :key="l">
                    <div p-2 class="el-table table-responsive table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                        <table class="table table-flush workout_table el-table__header">
                        <thead class="thead-light">
                          <tr>
                            <th width="10">Slno</th>
                            <th>Workout Type</th>
                            <th>Sets</th>
                            <th>Reps</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="n in 10" :key="n">
                            <td class="table_row">{{ n }}</td>
                            <td class="table_row">
                              <base-input
                                type="text"
                                placeholder="Workout type"
                                v-validate="'required|alpha'"
                                class="table_input"
                                >
                              </base-input>
                            </td>
                            <td class="table_row">
                              <base-input
                                type="text"
                                placeholder="Sets"
                                v-validate="'required|alpha'"
                                class="table_input"
                                >
                              </base-input>
                            </td>
                            <td class="table_row">
                              <base-input
                                type="text"
                                placeholder="Reps"
                                v-validate="'required|alpha'"
                                class="table_input"
                                >
                              </base-input>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                      
                  </b-col>
                </b-row>
              </b-container>
              
            </b-collapse>
        </b-row>
        <b-row>
          <b-col >
            <div class="card-profile-stats d-flex justify-content-center mt-md-5">
              <div class="d-flex justify-content-between">
                  <a href="#" class="btn btn-sm btn-warning mr-4">Add Updates</a>
              </div>
            </div>
          </b-col>
        </b-row>
        <!-- <div class="text-center">
          <base-button
              type="primary"
              size="small"
              class="table_button" @click="workoutView(client[0].id)">
              Weekly Workout Plan
          </base-button>
        </div> -->
      </b-card-body>
    </div>
    

    
  </b-card>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                client: [],
                workoutDetails: [],
                week_days: 0
            }
        },
        methods:{
            async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/clientDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.client = response.data;
                    
                    // console.log('programs fetched successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            async WeeklyWorkoutUpdates(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/weekworkoutDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.workoutDetails = response.data;
                    console.log(response.data);
                    this.week_days = response.data[0].week_no_of_days;
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            }
        },
        mounted(){
            const id = this.$route.params.id;
            this.clientDetails(id);
            this.WeeklyWorkoutUpdates(id);
        }
    };
</script>
<style>
  .table_row
  {
    padding: 10px !important;
    font-size: 10px !important;
  }
  .table_input
  {
    font-size: 10px !important;
  }
  .form-group {
    margin-bottom: 0rem;
  }
  .workout_table
  {
    border: 1px solid #f1e7e7;
  }
</style>
