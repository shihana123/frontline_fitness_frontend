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
          <a href="#" @click.prevent v-b-toggle="'collapse-' + week['week_no']" class="btn btn-sm btn-success mr-4">Week {{ week['week_no'] }}</a>
        </div>
      </b-card-header>
      <b-card-body class="pt-0" v-if="!week.status">
        <b-form @submit.prevent="updateWorkoutData">
          <b-row>
            <b-collapse :id="'collapse-' + week['week_no']">
              <b-container fluid>
                <b-row>
                  <b-col xl="6" md="6" sm="6" v-for="l in week['week_no_of_days']" :key="l">
                    <span class="text-nowrap">{{ week.week_workout_dates[l-1] }} - {{ week.week_workout_days[l-1] }}</span>
                    <br>

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
                                  :value="getWorkoutValue(week.week_no, l, n, 'workout_type')"
                                  @input="val => setWorkoutValue(week.week_no, l, n, 'workout_type', val, week.week_workout_dates[l - 1])"
                                  >
                                </base-input>
                              </td>
                              <td class="table_row">
                                <base-input
                                  type="text"
                                  placeholder="Sets"
                                  v-validate="'required|alpha'"
                                  class="table_input"
                                  :value="getWorkoutValue(week.week_no, l, n, 'sets')"
                                  @input="val => setWorkoutValue(week.week_no, l, n, 'sets', val, week.week_workout_dates[l - 1])"
                                  >
                                </base-input>
                              </td>
                              <td class="table_row">
                                <base-input
                                  type="text"
                                  placeholder="Reps"
                                  v-validate="'required|alpha'"
                                  class="table_input"
                                  :value="getWorkoutValue(week.week_no, l, n, 'reps')"
                                  @input="val => setWorkoutValue(week.week_no, l, n, 'reps', val, week.week_workout_dates[l - 1])"
                                  >
                                </base-input>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                        
                    </b-col>
                    
                  </b-row>
                  <b-row>
                      <b-col >
                        <div class="card-profile-stats d-flex justify-content-center mt-md-5">
                          <div class="d-flex justify-content-between">
                              <b-button type="submit" class="btn btn-sm btn-warning mr-4">Add Updates</b-button>
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                </b-container>
                
              </b-collapse>
          </b-row>
          
        </b-form>
        
        
        <!-- <div class="text-center">
          <base-button
              type="primary"
              size="small"
              class="table_button" @click="workoutView(client[0].id)">
              Weekly Workout Plan
          </base-button>
        </div> -->
      </b-card-body>

      <b-card-body class="pt-0" v-else>
        <b-row>
          <b-collapse :id="'collapse-' + week['week_no']">
            <b-container fluid>
              <b-row>
                <b-col xl="6" md="6" sm="6" v-for="m in week['week_no_of_days']" :key="m">
                  <span class="text-nowrap">{{ week.week_workout_dates[m-1] }} - {{ week.week_workout_days[m-1] }}</span>
                  <br>
                  <div p-2 class="el-table table-responsive table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                    <table class="table table-flush workout_table el-table__header">
                          <thead class="thead-light">
                            <tr>
                              <!-- <th width="10">Slno  </th> -->
                              <th>Workout Type</th>
                              <th>Sets</th>
                              <th>Reps</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(daily_work, index) in week.daily_workouts" :key="daily_work" v-if="daily_work['day_no'] == m">
                                <!-- <td>{{ index + 1 }}</td> -->
                                <td>{{ daily_work['workout_type'] }}</td>
                                <td>{{ daily_work['workout_sets'] }}</td>
                                <td>{{ daily_work['workout_reps'] }}</td>
                            </tr>
                          </tbody>
                    </table>
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </b-collapse>
        </b-row>
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
                week_days: 0,
                workoutData: {},
                week_table_id: 1 
            }
        },
        methods:{
            async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}clientDetails/${id}/`, {
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
                axios.get(`${process.env.VUE_APP_API_BASE_URL}weekworkoutDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.workoutDetails = response.data;
                    console.log(response.data);
                    this.week_days = response.data[0].week_no_of_days;
                    this.week_table_id = response.data[0].id;
                    
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            getWorkoutValue(week, day, row, field) {
              return this.workoutData[week] &&
                    this.workoutData[week][day] &&
                    this.workoutData[week][day][row]
                ? this.workoutData[week][day][row][field]
                : '';
            },

            setWorkoutValue(week, day, row, field, value, date) {
              if (!this.workoutData[week]) this.$set(this.workoutData, week, {});
              if (!this.workoutData[week][day]) this.$set(this.workoutData[week], day, {});
              if (!this.workoutData[week][day][row]) {
                this.$set(this.workoutData[week][day], row, {});
              }

              this.$set(this.workoutData[week][day][row], field, value);
              this.$set(this.workoutData[week][day][row], 'date', date); // ✅ Add the dat
            },
            updateWorkoutData()
            {
              
              const payload = [];

              for (const [weekNo, days] of Object.entries(this.workoutData)) {
                for (const [day, rows] of Object.entries(days)) {
                  for (const [row, data] of Object.entries(rows)) {
                    if (data.workout_type || data.sets || data.reps) {
                      payload.push({
                        week_no: weekNo,
                        day: day,
                        row: row,
                        workout_type: data.workout_type,
                        sets: data.sets,
                        reps: data.reps,
                        date: data.date
                      });
                    }
                  }
                }
              }
              const token = localStorage.getItem('token');
              
              axios.post(`${process.env.VUE_APP_API_BASE_URL}workout/update/${this.client[0].id}/${this.week_table_id}`, payload, {
                headers: { Authorization: `Token ${token}` }
              })
              .then(response => {
                this.$bvToast.toast('Workout updated successfully!', { variant: 'success' });
              })
              .catch(error => {
                console.error(error);
                this.$bvToast.toast('Error updating workout', { variant: 'danger' });
              });
              
            },
            initializeData()
            {
              this.workoutDetails.forEach(week => {
                this.workoutData[week.week_no] = {};
                week.week_no_of_days.forEach(day => {
                  this.workoutData[week.week_no][day] = {};
                  for (let i = 1; i <= 10; i++) {
                    this.workoutData[week.week_no][day][i] = {
                      workout_type: '',
                      sets: '',
                      reps: ''
                    };
                  }
                });
              });
            }
        },
        mounted(){
            const id = this.$route.params.id;
            this.initializeData();
            this.clientDetails(id);
            this.WeeklyWorkoutUpdates(id);
        }
    };
</script>
<style scoped>
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
  .collapse 
  {
    width: 100%;
  }
</style>
