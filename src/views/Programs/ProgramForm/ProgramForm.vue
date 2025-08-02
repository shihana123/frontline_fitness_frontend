<template>
  <card>
    <b-row align-v="center" slot="header" >
      <b-col cols="8">
        <h3 class="mb-0">Sessions - Create</h3>
      </b-col>
    </b-row>

    <b-form @submit.prevent="createProgram">
        <h6 class="heading-small text-muted mb-4">Sessions information</h6>

        <div class="pl-lg-4">
        
            <b-row >
            <b-col lg="6">
                <base-input label="Select Program *">
                  <select class="form-control" v-model="program.name" required>
                      <option v-for="program in programs" :key="program.id" :value="program.id">
                      {{ program.name }}
                      </option>
                  </select>
                </base-input>
            </b-col>
            <b-col lg="6">
                <base-input label="Program Type *">
                  <select class="form-control" v-model="program.program_type" required>
                      <option v-for="programType in programTypes" :key="programType" :value="programType">
                      {{ programType }}
                      </option>
                  </select>
                </base-input>
            </b-col>

            <b-col lg="6">
                <base-input
                  type="text"
                  label="Session Name"
                  placeholder="Session Name"
                  v-model="program.session_name"
                >
                </base-input>
            </b-col>

            </b-col>
            </b-row>

        </div>
        <div class="GS" v-if="program.program_type=='Group'">
            <hr class="my-4">
            <h6 class="heading-small text-muted mb-4">Group Session Details</h6>
            <div class="pl-lg-4">
                <!-- <h6 class="heading-small text-muted mb-4">Level 1</h6> -->
                <b-row>
                    <b-col lg="12">
                        <!-- <label class="form-control-label">Program Days</label> -->
                        <!-- <multiselect
                        v-model="program.group_select_days_level1"
                        :options="av_days"
                        :multiple="true"
                        :taggable="true"
                        placeholder="Select Program Days"
                        /> -->
                        <base-input label="Program Days *">
                          <b-form-checkbox-group
                          v-model="program.program_select_days"
                          :options="days"
                          name="days"
                          stacked
                          >
                          </b-form-checkbox-group>
                      </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="number"
                        label="Program Capacity"
                        placeholder="Program Capacity"
                        v-model="program.program_capacity"
                        min="1"
                        >
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input label="Select Trainer">
                          <select class="form-control" v-model="program.program_trainer" required>
                              <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">
                              {{ trainer.name }}
                              </option>
                          </select>
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                      <label class="form-control-label">Program Time *</label>
                      <div v-for="(slot, index) in program.program_select_time" :key="index" class="slot-row">
                        <input
                          type="time"
                          v-model="slot.value[0]"
                          required
                        />
                        <span>to</span>
                        <input
                          type="time"
                          v-model="slot.value[1]"
                          required
                        />
                        <!-- <b-button type="button" @click="removeSlot(index, '1')">❌</b-button> -->
                      </div>
                      <!-- <b-button type="button" @click="addSlot('1')">➕ Add Time Slot</b-button> -->
                      <pre>{{ program.program_select_time }}</pre> 
                    </b-col>
                </b-row>
            </div>

           
        </div>
        <br>
        <b-button type="submit" variant="success" class="submit_btn">Create Session</b-button>

    </b-form>
  </card>
</template>
<script>
  import axios from 'axios'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/default.css'
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import TimePicker from 'vue2-timepicker'
  import 'vue2-timepicker/dist/VueTimepicker.css'

  export default {
    components: {
      VueSlider, // <-- Add this
      Multiselect,
      TimePicker
    },
    data() {
      return {
        program: {
          name: '',
          program_type: '',
          session_name: '',
          program_select_days: [],
          program_capacity: 1,
          program_trainer: '',
          
          program_select_time: [
            { value : ['', ''] }
          ],
         
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
        av_days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        programTypes : ['Group', 'Personal Training', 'Recorded Sessions'],
        trainers: [],
        programs: [],
        selectedTime: '',
        programCount: 0,
        
      };
    },
    watch: {
      'program.name': 'generateSessionName',
      'program.program_type': 'generateSessionName'
    },
    methods: {
        async programList() {
          try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}mainProgramList`);
            this.programs = response.data;
            console.log(this.programs);
            
            console.log('Users fetched:', this.users);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        },
        async generateSessionName() {
          const token = localStorage.getItem('token');
          if (this.program.name && this.program.program_type) {
            try {
              const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}program-count/`, {
                params: {
                  mainprogram_id: this.program.name,
                  program_type: this.program.program_type
                },
                headers: { Authorization: `Token ${token}` }
              });

              const count = response.data.count || 0;
              const sessionNumber = count + 1;

              this.program.session_name = `${this.getProgramNameById(this.program.name)}_${this.program.program_type}_${sessionNumber}`;
            } catch (error) {
              console.error('Error fetching program count:', error);
            }
          }
        },
        getProgramNameById(id) {
          const found = this.programs.find(p => p.id === id);
          return found ? found.name : '';
        },
        async fetchTrainer()
        {
            try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}byrole/3/`);
            console.log(response);
            this.trainers = response.data;
            
            // this.roles = response.data;
            } catch (error) {
            console.error('Error fetching roles:', error);
            }
        },
        createProgram()
        {
            
            const formData = new FormData();
            formData.append('mainprogram', this.program.name);
            formData.append('name', this.program.session_name);
            formData.append('program_type', this.program.program_type);
            formData.append('program_select_days', JSON.stringify(this.program.program_select_days));
            formData.append('program_capacity', this.program.program_capacity);
            formData.append('program_trainer', this.program.program_trainer);

            const timeSlots = (this.program['program_select_time'] && this.program['program_select_time'].filter(slot => slot.value[0] && slot.value[1])) || [];

            if (timeSlots.length > 0) {
              const timeSlotValues = timeSlots.map(slot => slot.value);
              formData.append('program_select_time', JSON.stringify(timeSlotValues));
            }

            axios.post(`${process.env.VUE_APP_API_BASE_URL}programCreate`, formData,{
            })
            .then(response => {
            console.log('Program created successfully:', response.data);
            this.resetForm();
            this.$swal.fire("Created!", "Session has been created.", "success");
            })
            .catch(error => {
              const errorMsg = error.response && error.response.data ? error.response.data : error
              console.log(errorMsg.error);
              
            // console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);
            this.$swal.fire("Error!", errorMsg.error, "error");

            });
            
        },
        resetForm() {
          this.program = {
            name: '',
            program_type: '',
            session_name: '',
            program_select_days: [],
            program_capacity: 1,
            program_trainer: '',
            
            program_select_time: [
              { value : ['', ''] }
            ],
          
          }
      },
        
    },
    mounted(){
        this.fetchTrainer();
        this.programList();
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
  .slot-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .slot-row input[type="time"] {
    margin: 0 5px;
  }
</style>
