<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Client Attendance</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <b-card-body>
            <div>
                <!-- <b-form @submit.prevent="createUser"> -->
                    <b-row>
                        <b-col lg="4">
                            <base-input label="Program Type">
                                <select class="form-control" v-model="program_type">
                                    <option>Personal Training</option>
                                    <option>Group</option>
                                    
                                </select>
                            </base-input>
                        </b-col>
                        <b-col lg="4">
                            <base-input label="Select Program">
                                <select class="form-control" v-model="program" >
                                    <option v-for="program in programs" :key="program.id" :value="program.id">{{ program.name }}</option>
                                </select>
                            </base-input>
                        </b-col>
                        <b-col lg="4">
                            <base-input label="Select Trainer">
                                <select class="form-control" v-model="trainer" @change="trainerAvailability">
                                    <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">{{ trainer.name }}</option>
                                </select>
                            </base-input>
                        </b-col>
                        <!-- <b-col lg="6">
                            <b-button type="submit" variant="success" class="submit_btn">Search</b-button>
                        </b-col> -->
                    </b-row>

                    <b-row>
                        <b-col lg="12">
                            <template>
                                <div class="timetable-wrapper mt-4">
                                    <table class="table table-bordered text-center">
                                        <thead>
                                        <tr class="av_td">
                                            <th>Time</th>
                                            <th v-for="day in days" :key="day">{{ day.charAt(0).toUpperCase() + day.slice(1) }}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr class="av_td" v-for="time in timeSlots" :key="time">
                                            <td  style="width: 90px;">{{ time }}</td>
                                            <td
                                                v-for="day in days"
                                                :key="day + time"
                                                :class="getCellClass(day, time)"
                                                style="width: 80px; height: 40px; white-space: pre-line;"
                                                >
                                                {{ getCellContent(day, time) }}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
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
        program_type: 'Personal Training',
        program: '',
        trainer: '',
        programs : [],
        trainers: [],
        schedule: {},
        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        timeSlots: this.generateTimeSlots(), // 12:00 AM to 11:45 PM in 15-min increments
        availableSchedule: {
            available_days: [],
            available_time: []
        }
       }
    },
    
    methods: {
        async fetchPrograms(program_type)
        {
            const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/programListTrainer/${program_type}/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.programs = response.data;
                // console.log(programs.length);
                
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        async fetchTrainers()
        {
            const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/byrole/3/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.trainers = response.data;
                console.log(response);
                if (this.trainers.length) {
                    this.trainer = this.trainers[0].id
                    this.trainerAvailability();
                    this.fetchTrainerTimings();
                }
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        async trainerAvailability()
        {
            const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/availabilityTrainer/${this.trainer}/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.schedule = response.data;
                console.log(response);
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
            this.fetchTrainerTimings();

        },
        async fetchTrainerTimings()
        {
            const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/timingTrainer/${this.trainer}/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                // this.schedule = response.data;
                this.availableSchedule = response.data;
                console.log(response);
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        generateTimeSlots() {
            const slots = [];
            for (let h = 0; h < 24; h++) {
                for (let m = 0; m < 60; m += 30) {
                const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                slots.push(time);
                }
            }
            return slots;
        },
        // getCellClass(day, time) {
        //     const sessions = this.schedule[day] || [];
        //     for (const session of sessions) {
        //         if (this.isTimeInRange(time, session.start, session.end)) {
        //         return 'occupied';
        //         }
        //     }
        //     return 'free';
        // },
        getCellClass(day, time) {
  const sessions = this.schedule[day] || [];

  // Occupied class for booked sessions
  for (const session of sessions) {
    if (this.isTimeInRange(time, session.start, session.end)) {
      return 'occupied';
    }
  }

  // Check for unavailable day
  if (!this.availableSchedule.available_days.includes(day)) {
    return 'unavailable-day';
  }

  // Check for unavailable time
  const isWithinAvailableTime = this.availableSchedule.available_time.some(([start, end]) =>
    this.isTimeInRange(time, start, end)
  );

  if (!isWithinAvailableTime) {
    return 'unavailable-time';
  }

  return 'free';
},
        // getCellContent(day, time) {
        //     const sessions = this.schedule[day] || [];
        //     for (const session of sessions) {
        //         if (this.isTimeInRange(time, session.start, session.end)) {
        //         // Show content only at the start time
        //         return session.start === time
        //             ? `${session.program}\n${session.start} - ${session.end}`
        //             : '';
        //         }
        //     }
        //     return '';
        // },
        getCellContent(day, time) {
            const sessions = this.schedule[day] || [];

            for (const session of sessions) {
                if (this.isTimeInRange(time, session.start, session.end)) {
                return session.start === time
                    ? `${session.program}\n${session.start} - ${session.end}`
                    : '';
                }
            }
            // Check for unavailable day
            if (!this.availableSchedule.available_days.includes(day)) {
                return 'Not Available (Day)';
            }

            // Check for unavailable time
            const isWithinAvailableTime = this.availableSchedule.available_time.some(([start, end]) =>
                this.isTimeInRange(time, start, end)
            );

            if (!isWithinAvailableTime) {
                return 'Not Available (Time)';
            }

            return '';
        },
        // isTimeInRange(time, start, end) {
        //     const toMinutes = t => {
        //         const [h, m] = t.split(':').map(Number);
        //         return h * 60 + m;
        //     };
        //     const t = toMinutes(time);
        //     return t >= toMinutes(start) && t < toMinutes(end);
        // }
        isTimeInRange(time, start, end) {
            return time >= start && time < end;
        }
        
    },
    mounted(){
       this.fetchPrograms(this.program_type);
       this.fetchTrainers();
    //    this.trainerAvailability();
    }
  };
</script>
<style>
   .schedule-table table {
  width: 100%;
  border-collapse: collapse;
}
.schedule-table td, .schedule-table th {
  border: 1px solid #ccc;
  width: 100px;
  height: 30px;
  text-align: center;
}
.occupied {
  background-color: #f87171; /* Red - busy */
}

.free {
  background-color: #86efac; /* Green - available */
}
.av_td td
{
    padding: 0px !important;
}
.av_td th
{
    padding-left: 0px !important;
    padding-right: 0px !important;
    position: sticky;
    top: 0;
    background: #f8f9fa;
    z-index: 10;
}
.unavailable-day {
  background-color: #dee2e6 !important;
  color: #6c757d !important;
}

.unavailable-time {
  background-color: #fff3cd !important;
  color: #856404 !important;
}
</style>
