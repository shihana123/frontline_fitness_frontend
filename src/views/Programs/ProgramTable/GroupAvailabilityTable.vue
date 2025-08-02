<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Group Availability</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>

        <b-card-body>
            <div>
                    <b-row>
                        <b-col lg="6">
                            <label class="form-control-label">Group</label>
                            <select class="form-control" v-model="selectedProgram" @change="programChange">
                                <option v-for="(program, index) in programs" :key="program.id" :value="program.id">{{ program.name }}</option>
                            </select>
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
                                                    <!-- <th>Program Name</th> -->
                                                    <!-- <th>Level</th> -->
                                                    <th>Slots</th>
                                                    <th>Time</th>
                                                    <th>Days</th>
                                                    <th>Trainer</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(program_level, index) in selectedProgramDetails">
                                                    <td>{{ program_level.enrolled_clients }}/{{ program_level.program_capacity }}</td>
                                                    <td>{{ formatTimeRanges(program_level.program_select_time) }}</td>
                                                    <td>{{ program_level.program_select_days.join(', ') }}</td>
                                                    <td>{{ program_level.trainer_name }}</td>
                                                   
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
        programs: [],
        activeIndex: null,
        selectedProgram: '',
        selectedProgramDetails: []
       }
    },
    
    methods: {
        fetchPrograms()
        {
                const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}group-programs`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    console.log(response.data);
                    this.programs = response.data;
                    if (this.programs.length > 0) {
                        this.selectedProgram = this.programs[0].id;
                        this.programChange();
                    }
                    
                }).catch(error => {
                    console.error(error);
                });
        },
        fetchSingleProgramDetails()
        {
            const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}single-group-programs/${this.selectedProgram}`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    console.log(response.data);
                    this.selectedProgramDetails = response.data;
                }).catch(error => {
                    console.error(error);
                });
        },
        formatTimeRanges(ranges) {
            if (!Array.isArray(ranges)) return '';

            return ranges
            .map(([start, end]) => {
                return `${this.formatTime(start)} to ${this.formatTime(end)}`;
            })
            .join(', ');
        },
        formatTime(timeStr) {
            if (!timeStr) return '';
            const [hourStr, minuteStr] = timeStr.split(':');
            let hour = parseInt(hourStr);
            const minute = parseInt(minuteStr);
            const ampm = hour >= 12 ? 'pm' : 'am';

            if (hour > 12) hour -= 12;
            if (hour === 0) hour = 12;

            return `${hour}${minute !== 0 ? '.' + minuteStr : ''} ${ampm}`;
        },
        programChange()
        {
            this.fetchSingleProgramDetails()
        }
    },
    mounted(){
        this.fetchPrograms();
    }
  
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
