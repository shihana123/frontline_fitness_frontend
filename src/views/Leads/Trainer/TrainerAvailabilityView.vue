<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Trainer Availability</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <b-card-body>
            <div>
                <!-- <b-form @submit.prevent="createUser"> -->
                    <b-row>
                        <b-col lg="4">
                            <div class="time-range-selector">
                                <label>Start Time: <input type="time" v-model="startTime" class="time_field"  /></label>
                                <label>End Time: <input type="time" v-model="endTime" class="time_field"  /></label>
                                
                            </div>
                        </b-col>
                        <b-col lg="4">
                            <div class="time-range-selector">
                                <base-button type="primary"  @click="fetchAvailability">Check Availability</base-button>
                            </div>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col lg="12">
                            <template>
                                <div class="timetable-wrapper mt-4">
                                    <div class="table-responsive">
                                        <table class="table table-bordered text-center">
                                            <thead>
                                            <tr>
                                                <th>Trainer</th>
                                                <th v-for="day in days" :key="day">{{ day }}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="trainer in trainers" :key="trainer.trainer_id">
                                                <td>{{ trainer.trainer_name }}</td>
                                                <td v-for="day in days" :key="day"
                                                    :style="{ backgroundColor: trainer.availability[day].available ? '#66eb66' : '#fc01018c' }">
                                                    <span class="program_details" v-if="!trainer.availability[day].available">
                                                    {{ trainer.availability[day].program_name }} <br> {{ trainer.availability[day].program_time }}
                                                    </span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                </div>   
                            </template>
                        </b-col>
                    </b-row>

                <!-- </b-form> -->
                
            </div>
        </b-card-body>
    </b-card>
   
</div>
</template>

<script>
import axios from 'axios'
  export default {
    data() {
       return {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        startTime: '',
        endTime: '',
        trainers: [],
       }
    },
    
    methods: {
      
        fetchAvailability()
        {
            if (!this.startTime || !this.endTime) {
                alert('Please select a valid time range.');
                return;
            }

            axios.post(`${process.env.VUE_APP_API_BASE_URL}availabilityTrainer`, {
                start_time: this.startTime,
                end_time: this.endTime
            }, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
            }).then(response => {
                console.log(response.data);
            
                this.trainers = response.data;
            }).catch(error => {
                console.error(error);
            });
        }
        
        
    },
  
  };
</script>
<style>

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.table td,
.table th {
  white-space: nowrap;
  font-size: 11px;
}
.timetable-wrapper {
  max-width: 100%;
}
.program_details
{
    color: #000;
}
.time-range-selector
{
    display: flex;
}
.time_field
{
    border: 1px solid #dcd0d0;
    width: 95%;
    padding: 5px;
    border-radius: 7px;
}
</style>
