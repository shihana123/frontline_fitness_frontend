<template>
  <b-card no-body class="card-profile" alt="Image placeholder" img-top>
    <b-row class="justify-content-center">
      <b-col lg="3" class="order-lg-2">
        <div class="card-profile-image">
          <a href="#">
            <b-img src="img/theme/team-4.jpg" rounded="circle" />
          </a>
        </div>
      </b-col>
    </b-row>

    <b-card-header class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
      <div class="d-flex justify-content-between">
        <!-- <a href="" class="btn btn-sm btn-info mr-4" v-if="role_id == 'Dietitian'">Consultation Details</a> -->
        <router-link
          :to="{ name: 'clients/consultation_details', params: { id: client[0].id } }"
          class="btn btn-sm btn-info mr-4"
          v-if="role_id == 'Dietitian'"
        >
          Consultation Details
        </router-link>
        <router-link
          :to="{ name: 'clients/graphical_view', params: { id: client[0].id } }"
          class="btn btn-sm btn-default mr-4"
          v-if="role_id == 'Dietitian'"
        >
          More Details
        </router-link>
        <!-- <a href="#" class="btn btn-sm btn-default float-right" v-if="role_id != 'Sales'">More Details</a> -->
      </div>
    </b-card-header>

    <b-card-body class="pt-0">
      <b-row>
        <b-col >
          <div class="card-profile-stats d-flex justify-content-center mt-md-5">
            
          </div>
        </b-col>
      </b-row>
      <div class="text-center">
        <h5 class="h3">
          {{ client[0].name }}<span class="">, {{ client[0].client_id }}</span>
        </h5>
        <div class="h5 font-weight-300">
          <i class="ni location_pin mr-2"></i>{{ client[0].email }}
        </div>
        <div class="h5 font-weight-300">
          <i class="ni location_pin mr-2"></i>{{ client[0].phone }}
        </div>
        <div class="h5 mt-4" v-if="role_id == 'Sales'">
          <h5><i class="ni business_briefcase-24 mr-2"></i>Selected Program - {{ client[0].programs[0].program.name }}</h5>
          <h5><i class="ni business_briefcase-24 mr-2"></i>Program Choosen for - {{ client[0].program_months }} Months</h5>
          <h5><i class="ni business_briefcase-24 mr-2"></i>Amount Paid - ₹{{ client[0].amount }}</h5>
        </div>
        <div v-else>
          <h5><i class="ni business_briefcase-24 mr-2"></i>Selected Program - {{ client[0].programs[0].program.name }}</h5>
        </div>
        
        <div>
          <i class="ni education_hat mr-2"></i>Program Type - {{ client[0].programs[0].program.program_type[0] }}
        </div>
        <!-- <div v-if="client[0].programs[0].program.program_type[0] === 'Group'">
          <i class="ni education_hat mr-2"></i>Selected Time - {{ client[0].programs[0].preferred_time }}
        </div> -->
        <div>
          <i class="ni education_hat mr-2"></i>Workout Selected Time - IST {{ formatPreferredTime(client[0].programs[0].preferred_time) }}
        </div>
        <div>
          <i class="ni education_hat mr-2"></i>Workout Selected Days - {{ formatPreferredDays(client[0].programs[0].workout_days) }}
        </div>
        
        <hr class="my-4">
        <!-- Trainer -->
        <base-button v-if="role_id == 'Trainer'"
            type="primary"
            size="small"
            class="table_button" @click="workoutView(client[0].id)">
            Weekly Workout Plan
        </base-button>
        <base-button v-if="role_id == 'Trainer'"
            type="primary"
            size="small"
            class="table_button" @click="ClientAttendanceView(client[0].id)">
            Attendance Details
        </base-button>
        <!-- Trainer -->

        <!-- Dietitian -->
         <base-button v-if="role_id == 'Dietitian'"
            type="primary"
            size="small"
            class="table_button" @click="dietView(client[0].id)">
            Weekly Diet Plan
        </base-button>
        <!-- Dietitian -->

        <!-- Sales -->
        <base-button v-if="role_id == 'Sales'"
            type="primary"
            size="small"
            class="table_button" v-b-toggle.collapse-2>
            Followup Details
        </base-button>

        <b-collapse id="collapse-2">
          <b-card v-for="followup in followups"> 
            <h5>Followup Date : {{ followup.follow_up_date }}</h5>
            <h5>Status : {{ followup.lead_status }}</h5>
            <h5 v-if="followup.lead_status != 'Converted'">Notes : {{ followup.notes }}</h5>
            <h5 v-if="followup.lead_status != 'Converted'">Activity Type : {{ followup.activity_type }}</h5>
          </b-card>
        </b-collapse>
        <!-- Sales -->

      </div>
    </b-card-body>
  </b-card>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                client: [],
                role_id: localStorage.getItem('role_name'),
                followups: []
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
                    console.log(response.data);
                    
                    // console.log('programs fetched successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            workoutView(client_id)
            {
                // console.log(client_id);
                this.$router.push({ name: 'clients/workout_view', params: { id: client_id } });
            },
            dietView(client_id)
            {
              this.$router.push({ name: 'clients/diet_view', params: { id: client_id } });
            },
            ClientAttendanceView(client_id)
            {
                this.$router.push({ name: 'clients/attendance_view', params: { id: client_id } });
            },
            async userData()
            {
              const token = localStorage.getItem('token');
              console.log(localStorage.getItem('token'));
              var userRes = await axios.get('http://127.0.0.1:8000/api/user/userDetails/', {
                headers: { Authorization: `Token ${token}` }
              });
              
              
            },
            formatPreferredTime(times) {
                if (!Array.isArray(times) || times.length === 0) return '';
                
                const timeRange = times[0]; // assuming first element is [start, end]
                if (!Array.isArray(timeRange) || timeRange.length !== 2) return '';
                
                const [start, end] = timeRange;
                return `${this.formatTimeTo12Hour(start)} to ${this.formatTimeTo12Hour(end)}`;
            },
            formatTimeTo12Hour(timeStr) {
                const [hour, minute] = timeStr.split(':');
                const h = parseInt(hour);
                const ampm = h >= 12 ? 'PM' : 'AM';
                const formattedHour = h % 12 === 0 ? 12 : h % 12;
                return `${formattedHour}:${minute} ${ampm}`;
            },
            formatPreferredDays(days) {
                if (!Array.isArray(days)) return '';
                return days
                .map(day => day.charAt(0).toUpperCase() + day.slice(1))
                .join(', ');
            },
            followupDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/fetchFollowups/${id}`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.followups = response.data[0].followups;
                    // console.log('programs fetched successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            }
        },
        mounted(){
            this.userData()
            const id = this.$route.params.id;
            this.clientDetails(id);
            this.followupDetails(id);
        }
    };
</script>
<style></style>
