<template>
  <card>
    <b-row align-v="center" slot="header" >
      <b-col cols="8">
        <h3 class="mb-0">Programs - Create</h3>
      </b-col>
    </b-row>

    <b-form @submit.prevent="createProgram">
        <h6 class="heading-small text-muted mb-4">Program information</h6>

        <div class="pl-lg-4">
        
            <b-row >
            <b-col lg="6">
                <base-input
                type="text"
                label="Program Name"
                placeholder="Program Name"
                v-model="program.name"
                v-validate="'required|alpha'"
                >
                </base-input>
            </b-col>
            <b-col lg="6">
                <label class="form-control-label">Program Type</label>
                <multiselect
                v-model="program.program_type"
                :options="programTypes"
                :multiple="true"
                :taggable="true"
                placeholder="Select Program Type"
                />
            </b-col>
            </b-col>
            </b-row>

        </div>
      
        <div class="PT" v-if="program.program_type.includes('Personal Training')">
            <hr class="my-4">
            <h6 class="heading-small text-muted mb-4">Personal Training</h6>
            <div class="pl-lg-4">
                <b-row>
                    <b-col lg="12">
                        <base-input label="Program Days">
                            <b-form-checkbox-group
                            v-model="program.personal_select_days"
                            :options="days"
                            name="days"
                            stacked
                            >
                            </b-form-checkbox-group>
                        </base-input>
                        
                    </b-col>
                </b-row>
            </div>
        </div>

        <div class="GS" v-if="program.program_type.includes('Group')">
            <hr class="my-4">
            <h6 class="heading-small text-muted mb-4">Group Session</h6>
            <div class="pl-lg-4">
                <h6 class="heading-small text-muted mb-4">Level 1</h6>
                <b-row>
                    <b-col lg="4">
                        <label class="form-control-label">Program Days</label>
                        <multiselect
                        v-model="program.group_select_days_level1"
                        :options="av_days"
                        :multiple="true"
                        :taggable="true"
                        placeholder="Select Program Days"
                        />
                    </b-col>
                    <b-col lg="4">
                        <base-input
                        type="text"
                        label="Program Time"
                        placeholder="Program Time"
                        v-model="program.group_select_time_level1"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="4">
                        <base-input
                        type="text"
                        label="Program Capacity"
                        placeholder="Program Capacity"
                        v-model="program.group_capacity_level1"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="4">
                        <base-input label="Select Trainer">
                        <select class="form-control" v-model="program.group_trainer_level1">
                            <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">
                            {{ trainer.name }}
                            </option>
                        </select>
                        </base-input>
                    </b-col>
                </b-row>
            </div>

            <div class="pl-lg-4">
                <h6 class="heading-small text-muted mb-4">Level 2</h6>
                <b-row>
                    <b-col lg="4">
                        <label class="form-control-label">Program Days</label>
                        <multiselect
                        v-model="program.group_select_days_level2"
                        :options="av_days"
                        :multiple="true"
                        :taggable="true"
                        placeholder="Select Program Days"
                        />
                    </b-col>
                    <b-col lg="4">
                        <base-input
                        type="text"
                        label="Program Time"
                        placeholder="Program Time"
                        v-model="program.group_select_time_level2"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="4">
                        <base-input
                        type="text"
                        label="Program Capacity"
                        placeholder="Program Capacity"
                        v-model="program.group_capacity_level2"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="4">
                        <base-input label="Select Trainer">
                        <select class="form-control" v-model="program.group_trainer_level2">
                            <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">
                            {{ trainer.name }}
                            </option>
                        </select>
                        </base-input>
                    </b-col>
                </b-row>
            </div>
        </div>
        <br>
        <b-button type="submit" variant="success" class="submit_btn">Create Program</b-button>

    </b-form>
  </card>
</template>
<script>
  import axios from 'axios'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/default.css'
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'

  export default {
    components: {
      VueSlider, // <-- Add this
      Multiselect
    },
    data() {
      return {
        program: {
          name: '',
          program_type: [],
          personal_select_days: [],
          group_select_days_level1: [],
          group_select_time_level1: [],
          group_capacity_level1: '',
          group_trainer_level1: '',
          group_select_days_level2: [],
          group_select_time_level2: [],
          group_capacity_level2: '',
          group_trainer_level2: '',
        },
        days: [
          { text: 'Sunday', value: 'sunday' },
          { text: 'Monday', value: 'monday' },
          { text: 'Tuesday', value: 'tuesday' },
          { text: 'Wednesday', value: 'wednesday' },
          { text: 'Thursday', value: 'thursday' },
          { text: 'Friday', value: 'friday' },
          { text: 'Saturday', value: 'saturday' },
        ],
        av_days: ['Sunday', 'Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
        programTypes : ['Group', 'Personal Training', 'Recorded Sessions'],
        trainers: [],
      };
    },
    methods: {
        async fetchTrainer()
        {
            try {
            const response = await axios.get('http://127.0.0.1:8000/api/user/byrole/3/');
            console.log(response);
            this.trainers = response.data;
            
            // this.roles = response.data;
            } catch (error) {
            console.error('Error fetching roles:', error);
            }
        },
        createProgram()
        {
            console.log('dd');
            
            const formData = new FormData();
            formData.append('name', this.program.name);
            formData.append('program_type', JSON.stringify(this.program.program_type));
            formData.append('personal_select_days', JSON.stringify(this.program.personal_select_days));
            formData.append('group_select_days_level1', JSON.stringify(this.program.group_select_days_level1));
            formData.append('group_select_time_level1', JSON.stringify(this.program.group_select_time_level1));
            formData.append('group_capacity_level1', this.program.group_capacity_level1);
            formData.append('group_trainer_level1', this.program.group_trainer_level1);
            formData.append('group_select_days_level2', JSON.stringify(this.program.group_select_days_level2));
            formData.append('group_select_time_level2', JSON.stringify(this.program.group_select_time_level2));
            formData.append('group_capacity_level2', this.program.group_capacity_level2);
            formData.append('group_trainer_level2', this.program.group_trainer_level2);
            console.log(formData);

            axios.post('http://127.0.0.1:8000/api/user/programCreate', formData,{
            })
            .then(response => {
            console.log('Program created successfully:', response.data);
            })
            .catch(error => {
            console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);

            });
            
        }
    },
    mounted(){
        this.fetchTrainer();
    }
  };
</script>
<style>
  .custom-control {
    position: relative;
    display: inline !important;
    min-height: 1.5rem;
    padding-left: 4rem !important;
  }
  .vue-slider-mark-label {
    font-size: 6px !important;
  }
  .submit_btn
  {
    float: right;
  }
</style>
