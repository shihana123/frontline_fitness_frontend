<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Trainer Availability</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <b-card-body>
            <div>
                
                    <b-row>
                        <b-col lg="12">
                            <template>
                                <div class="timetable-wrapper mt-4">
                                    <div class="table-responsive">
                                        <table class="table table-bordered text-center">
                                            <thead>
                                            <tr>
                                                <th>Trainer</th>
                                                <th v-for="hour in timeSlots" :key="'head-' + hour">{{ hour }}:00</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="trainer in trainers" :key="trainer.trainer_id">
                                                <td>{{ trainer.trainer_name }}</td>
                                                <!-- <td v-for="slot in timeSlots" :key="slot"
                                                    :style="{ backgroundColor: trainer.slots[slot].available ? '#66eb66' : '#fc01018c' }">
                                                    <span class="program_details" v-if="!trainer.slots[slot].available">
                                                    {{ trainer.slots[slot].program_name }} <br>
                                                    <small>{{ trainer.slots[slot].program_days }}</small>
                                                    </span>
                                                </td> -->
                                                <template v-for="hour in timeSlots">
                                                    <template v-if="!skipCells[`${trainer.trainer_id}_${hour}`]">
                                                        <td
                                                            :key="`cell-${trainer.trainer_id}-${hour}`"
                                                            :colspan="getProgramAtHour(trainer, hour) ? getProgramAtHour(trainer, hour).end_hour - hour : 1"
                                                            :style="{
                                                            backgroundColor: getProgramAtHour(trainer, hour) ? '#fc01018c' : '#66eb66'
                                                            }"
                                                        ></td>

                                                        <!-- <template v-if="getProgramAtHour(trainer, hour)">
                                                            <span>{{ getProgramAtHour(trainer, hour).program_name }}</span><br>
                                                            <span>{{ getProgramAtHour(trainer, hour).program_days.join(', ') }}</span>
                                                        </template> -->
                                                    </template>
                                                </template>
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
        timeSlots: [...Array(24).keys()], // [0, 1, 2, ..., 23]
        trainers: [],
        skipCells: {}  // to mark which cells to skip
       }
    },
    
    methods: {
      
        fetchAvailability()
        {
           
            axios.get('http://127.0.0.1:8000/api/user/trainerHourlySchedule', {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            }).then(response => {
                console.log(response.data);
                // this.timeSlots = response.data.time_slots;
                // this.trainers = response.data.trainers;
                // this.calculateSkips();
                this.trainers = response.data;
                this.markSkipCells();
            }).catch(error => {
                console.error(error);
            });
        },
        markSkipCells() {
            this.skipCells = {};

            this.trainers.forEach(trainer => {
            trainer.program_blocks.forEach(program => {
                for (let hour = program.start_hour + 1; hour < program.end_hour; hour++) {
                this.skipCells[`${trainer.trainer_id}_${hour}`] = true;
                }
            });
            });
        },

        getProgramAtHour(trainer, hour) {
            return trainer.program_blocks.find(program => program.start_hour === hour);
        }
        
        
    },
    mounted() {
        this.fetchAvailability();
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
