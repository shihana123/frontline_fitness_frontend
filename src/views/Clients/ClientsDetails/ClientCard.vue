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
        <a href="#" class="btn btn-sm btn-info mr-4">Consultation Details</a>
        <a href="#" class="btn btn-sm btn-default float-right">More Details</a>
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
          {{ client[0].name }}<span class="font-weight-light">, {{ client[0].client_id }}</span>
        </h5>
        <div class="h5 font-weight-300">
          <i class="ni location_pin mr-2"></i>{{ client[0].email }}
        </div>
        <div class="h5 font-weight-300">
          <i class="ni location_pin mr-2"></i>{{ client[0].phone }}
        </div>
        <div class="h5 mt-4">
          <i class="ni business_briefcase-24 mr-2"></i>Selected Program - {{ client[0].programs[0].program.name }}
        </div>
        <div>
          <i class="ni education_hat mr-2"></i>Program Type - {{ client[0].programs[0].program.program_type[0] }}
        </div>
        <div v-if="client[0].programs[0].program.program_type[0] === 'Group'">
          <i class="ni education_hat mr-2"></i>Selected Time - {{ client[0].programs[0].preferred_time }}
        </div>
        <div v-else-if="client[0].programs[0].program.program_type[0] === 'Personal Training'">
          <i class="ni education_hat mr-2"></i>Selected Time - {{ client[0].programs[0].preferred_time }}
        </div>
        
        <hr class="my-4">
        <!-- <p>Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music.</p> -->
        <base-button
            type="primary"
            size="small"
            class="table_button" @click="workoutView(client[0].id)">
            Weekly Workout Plan
        </base-button>
        <base-button
            type="primary"
            size="small"
            class="table_button" @click="ClientAttendanceView(client[0].id)">
            Attendance Details
        </base-button>

      </div>
    </b-card-body>
  </b-card>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                client: []
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
            ClientAttendanceView(client_id)
            {
                this.$router.push({ name: 'clients/attendance_view', params: { id: client_id } });
            }
        },
        mounted(){
            const id = this.$route.params.id;
            this.clientDetails(id);
        }
    };
</script>
<style></style>
