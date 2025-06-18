<template>
  <card>
    <b-row align-v="center" slot="header" >
      <b-col cols="8">
        <h3 class="mb-0">Leads - Create</h3>
      </b-col>
    </b-row>

    <b-form @submit.prevent="createLead">
      <h6 class="heading-small text-muted mb-4">Leads information</h6>

      <div class="pl-lg-4">
        
        <b-row >
          <b-col lg="6">
            <base-input
              type="text"
              label="Name"
              placeholder="Name"
              v-model="lead.name"
              v-validate="'required|alpha'"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="text"
              label="Source"
              placeholder="Source"
              v-model="lead.source"
              v-validate="'required|alpha'"
            >
            </base-input>
          </b-col>
          
        </b-row>

        <b-row>
            <b-col lg="6">
                <base-input
                type="tel"
                label="Phone Number"
                placeholder="Phone Number"
                v-model="lead.phonenumber"
                >
                </base-input>
            </b-col>
            <b-col lg="6">
                <base-input
                type="email"
                label="Email"
                placeholder="Email"
                v-model="lead.email   "
                >
                </base-input>
            </b-col>
          
        </b-row>

        <b-row>
          <b-col lg="6">
            <label class="form-control-label">Status</label>
            <select class="form-control" v-model="lead.status">
              <option v-for="stat in status" :value="stat">{{ stat }}</option>
            </select>
          </b-col>
          <b-col lg="6">
            <label class="form-control-label">Country</label>
            <select class="form-control" v-model="lead.country">
              <option v-for="country in countries" :value="country.id">{{ country.country_name }}</option>
            </select>
          </b-col>
        </b-row>

      </div>
     
      <hr class="my-4">
      <!-- Description -->
      <h6 class="heading-small text-muted mb-4">Program Data</h6>
      <div class="pl-lg-4">
        <b-row>
          <b-col lg="6">
            <label class="form-control-label">Program Type</label>
              <select class="form-control" v-model="lead.program_type" @change="fetchProgram">
                <option v-for="program_type in programTypes" :value="program_type">{{ program_type }}</option>
              </select>
          </b-col>
          <b-col lg="6">
            <label class="form-control-label">Program Needed</label>
            <select v-model="lead.program" class="form-control">
              <option v-for="program in programs" :key="program.id" :value="program.id">{{ program.name }}</option>
            </select>
          </b-col>
          
        </b-row>

        <b-row>
          <b-col lg="12">
            <base-input label="Days">
                <b-form-checkbox-group
                v-model="lead.preferred_days"
                :options="days"
                name="days"
                stacked
                >
                </b-form-checkbox-group>
            </base-input>
            
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <label class="form-control-label">
              Preferred Time
            </label>
            <div>
              <div v-for="(slot, index) in lead.preferred_time" :key="index" class="slot-row">
                  <input
                    type="time"
                    v-model="slot.value[0]"
                    class="time_field"      
                  />
                  <span>  to  </span>
                  <input
                    type="time"
                    v-model="slot.value[1]" 
                    class="time_field" 
                  />
              </div>
            </div>
          </b-col>
          <b-col lg="6">
              <base-input
                type="date"
                label="Follow-up Date"
                placeholder="Follow-up Date"
                v-model="lead.followup_date"
              >
              </base-input>
            </b-col>
        </b-row>
      

        <b-button type="submit" variant="success" class="submit_btn">Create Lead</b-button>
      </div>

    </b-form>
  </card>
</template>
<script>
  import axios from 'axios'
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'

  export default {
    components: {
      Multiselect
    },
    data() {
      return {
        lead: {
          name: '',
          source: '',
          phone_no: '',
          email: '',
          status: 'New Lead',
          country: 100,
          program_type: 'Personal Training',
          program: '',
          preferred_time: [
            { value : ['', ''] }
          ],
          preferred_days: [],
          lead_date: '',
          followup_date: '',
          // notes: '',
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
        status: ['New Lead', 'Interested', 'Not Interested', 'Follow-up scheduled', 'CLosed/Lost', 'Converted', 'pending Payment'],
        programTypes : ['Personal Training', 'Group', 'Recorded Sessions'],
        programs: [],
        countries: []
      };
    },
    methods: {
      createLead()
      {
        const formData = new FormData();
        formData.append('name', this.lead.name);
        formData.append('source', this.lead.source);
        formData.append('email', this.lead.email);
        formData.append('phone', this.lead.phonenumber);
        formData.append('country', this.lead.country);
        formData.append('program_type', this.lead.program_type);
        formData.append('program_name', this.lead.program);
        // formData.append('lead_date', this.lead.lead_date);
        formData.append('follow_up_date', this.lead.followup_date);
        // formData.append('notes', this.lead.notes);
        formData.append('preferred_days', JSON.stringify(this.lead.preferred_days));

        const timeSlotsKey = `preferred_time`;
        
        const timeSlots = (this.lead[timeSlotsKey] && this.lead[timeSlotsKey].filter(slot => slot.value[0] && slot.value[1])) || [];

        if (timeSlots.length > 0) {
          const timeSlotValues = timeSlots.map(slot => slot.value);
          formData.append('preferred_time', JSON.stringify(timeSlotValues));
        }
        const token = localStorage.getItem('token');
        axios.post('http://127.0.0.1:8000/api/user/leadCreate', formData,{
                headers: { Authorization: `Token ${token}` }
        })
        .then(response => {
          console.log('Program created successfully:', response.data);
        })
        .catch(error => {
          console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);
        });
        
      },
      addSlot() {
          
          // this.program.timeSlots1.push({ start: '', end: '' })
          const key = 'preferred_time'
          if (!this.lead[key]) {
            
            this.$set(this.lead, key, []) // Ensure it's reactive
          }
          console.log(this.lead[key]);
          
          this.lead[key].push({ value: ['', ''] })
      },
      removeSlot(index) {
          const key = 'preferred_time'
          if (!this.lead[key]) {
            this.$set(this.lead, key, []) // Ensure it's reactive
          }
          this.lead[key].splice(index, 1)
      },
      async fetchProgram()
      {
        const program_type = this.lead.program_type;
      
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
      async fetchCountries()
      {
          const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/fetchCountry/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.countries = response.data;
                // console.log(programs.length);
                
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
      }
    
    },
    mounted(){
      
      this.fetchProgram();
      this.fetchCountries();

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
  .time_field
  {
    border: 1px solid #dcd0d0;
    width: 30%;
    padding: 5px;
    border-radius: 7px;
  }
</style>
