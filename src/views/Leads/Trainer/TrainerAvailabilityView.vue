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
                                <select class="form-control" v-model="program" @change="trainerAvailability">
                                    <option v-for="program in programs" :key="program.id" :value="program.id">{{ program.name }}</option>
                                </select>
                            </base-input>
                        </b-col>
                        <b-col lg="4">
                            <base-input label="Select Program">
                                <select class="form-control" v-model="trainer">
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
                }
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        trainerAvailability()
        {
            
        }
        
    },
    mounted(){
       this.fetchPrograms(this.program_type);
       this.fetchTrainers();
    }
  };
</script>
<style>
   
</style>
