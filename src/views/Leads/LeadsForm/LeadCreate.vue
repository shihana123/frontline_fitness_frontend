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
              label="Name *"
              placeholder="Name"
              v-model="lead.name"
              v-validate="'required'"
              required
            >
            </base-input>
           
          </b-col>
          <b-col lg="6">
            
            <label class="form-control-label">Source *</label>
              <select class="form-control" v-model="lead.source" required>
                <option v-for="source in sources" :value="source">{{ source }}</option>
              </select>
          </b-col>
          
        </b-row>

        <b-row>
            <b-col lg="6">
                <base-input
                type="tel"
                label="Phone Number *"
                placeholder="Phone Number"
                v-model="lead.phonenumber"
                required
                >
                </base-input>
            </b-col>
            <b-col lg="6">
                <base-input
                type="email"
                label="Email *"
                placeholder="Email"
                v-model="lead.email"
                required
                >
                </base-input>
            </b-col>
          
        </b-row>

        <b-row>
          <b-col lg="6">
            <label class="form-control-label">Status *</label>
            <select class="form-control" v-model="lead.status">
              <option v-for="stat in status" :value="stat">{{ stat }}</option>
            </select>
          </b-col>
          <b-col lg="6">
            <label class="form-control-label">Country *</label>
            <select class="form-control" v-model="lead.country">
              <option v-for="country in countries" :value="country.id">{{ country.country_name }}</option>
            </select>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <base-input
              type="number"
              label="Age *"
              placeholder="Age"
              v-model="lead.age"
              v-validate="'required'"
              required
              min=1
            >
            </base-input>
           
          </b-col>
        </b-row>

      </div>
     
      <hr class="my-4">
      <!-- Description -->
      <h6 class="heading-small text-muted mb-4">Program Data</h6>
      <div class="pl-lg-4">
        <b-row>
          <b-button size="sm"  variant="success" class="create_btn" v-if="lead.program_type=='Personal Training'" v-b-modal.modal-1 @click="trainer_availabilitymodal()">Trainer Availability</b-button>

          <b-button size="sm"  variant="success" class="create_btn" v-if="lead.program_type=='Group'" v-b-modal.modal-2 @click="group_availabilitymodal()">Group Availability</b-button>
        </b-row>
        <b-row>
          
          <b-col lg="6">
            <label class="form-control-label">Program Type</label>
              <select class="form-control" v-model="lead.program_type" @change="fetchProgram">
                <option v-for="program_type in programTypes" :value="program_type">{{ program_type }}</option>
              </select>
          </b-col>
          <b-col lg="6">
            <label class="form-control-label">Program Needed</label>
            <select v-model="lead.program" class="form-control" >
              <option v-for="program in programs" :key="program.id" :value="program.id">{{ program.name }}</option>
            </select>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <label class="form-control-label">Trainer</label>
              <select class="form-control" v-model="lead.trainer" :disabled="lead.program_type === 'Group'">
                <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">
                    {{ trainer.name }}
                </option>
              </select>
          </b-col>

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
                    :readonly="lead.program_type === 'Group'"      
                  />
                  <span>  to  </span>
                  <input
                    type="time"
                    v-model="slot.value[1]" 
                    class="time_field" 
                    :readonly="lead.program_type === 'Group'"
                  />
              </div>
            </div>
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
                :disabled="lead.program_type === 'Group'"
                >
                </b-form-checkbox-group>
            </base-input>
            
          </b-col>
        </b-row>

        <b-row>
          
          
        </b-row>

        <hr class="my-4">
      <!-- Description -->
      <h6 class="heading-small text-muted mb-4">Followup Details</h6>
      <div class="pl-lg-4">
        <b-row>
          <b-col lg="6">
              <base-input
                type="date"
                label="Follow-up Date *"
                placeholder="Follow-up Date"
                v-model="lead.followup_date"
                required
              >
              </base-input>
            </b-col>

            <b-col lg="6">
              <base-input label="Notes">
                <textarea class="form-control" id="notes" rows="3" col="5" v-model="lead.notes" required ></textarea>
              </base-input>
            </b-col>
        </b-row>
      </div>
      

        <b-button type="submit" variant="success" class="submit_btn">Create Lead</b-button>
      </div>

    </b-form>

    <b-modal
      id="lead-success-modal"
      title="Lead Management"
      hide-footer
      v-model="showSuccessModal"
    >
      <div class="text-center">
        <b-alert show variant="success">
          <span class="alert-icon"><i class="ni ni-like-2"></i></span>
          <span class="alert-text"><strong>Success!</strong> Lead Created Successfully!</span>
        </b-alert>


        <b-button variant="primary" @click="goToLeadsList">Close</b-button>
        <b-button variant="info" class="ml-2" @click="addMoreLead">Add More</b-button>
      </div>
    </b-modal>

    <b-modal size="lg" id="modal-1" hide-footer v-if="modal_1">
        <trainer-availability/>
    </b-modal>

    <b-modal size="lg" id="modal-2" hide-footer v-if="modal_2">
        <group-table/>
    </b-modal>
   

  </card>

  
</template>
<script>
  import axios from 'axios'
  import TrainerAvailability from "../Trainer/TrainerAvailabilityTimeView";
  import GroupTable from "../../Programs/ProgramTable/GroupAvailabilityTable";
  
 

  export default {
    components: {
      TrainerAvailability,
      GroupTable
    },
    data() {
      return {
        showSuccessModal: false,
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
          trainer: '',
          notes: '',
          age: '',
        },
        trainers: [],
        days: [
          { text: 'Sunday', value: 'sunday' },
          { text: 'Monday', value: 'monday' },
          { text: 'Tuesday', value: 'tuesday' },
          { text: 'Wednesday', value: 'wednesday' },
          { text: 'Thursday', value: 'thursday' },
          { text: 'Friday', value: 'friday' },
          { text: 'Saturday', value: 'saturday' },
        ],
        status: ['New Lead', 'Interested', 'Not Interested', 'Follow-up scheduled', 'CLosed/Lost', 'pending Payment'],
        programTypes : ['Personal Training', 'Group', 'Recorded Sessions'],
        sources : ['Instagram', 'Friend/Family Recommendation', 'Online Search', 'Aster Medicity', 'VMC'],
        programs: [],
        countries: [],
        modal_1: false,
        modal_2: false
      };
    },
    watch: {
      'lead.program'(newVal) {
        if (newVal && this.lead.program_type === 'Group') {
          this.fetchGroupProgramDetails(newVal);
        }
      }
    },
    methods: {
      fetchGroupProgramDetails(selectedProgram)
      {
        const token = localStorage.getItem('token');
        axios.get(`${process.env.VUE_APP_API_BASE_URL}single-group-programs/${selectedProgram}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
          }
          }).then(response => {
            console.log(response.data);
            // this.selectedProgramDetails = response.data;
            this.lead.preferred_days = response.data[0].program_select_days;
            this.lead.preferred_time = response.data[0].program_select_time.map(slot => ({ value: slot }));
            this.lead.trainer = response.data[0].program_trainer;
          }).catch(error => {
            console.error(error);
          });
      },
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
        formData.append('trainer', this.lead.trainer);
        formData.append('age', this.lead.age);
        formData.append('follow_up_date', this.lead.followup_date);
        formData.append('notes', this.lead.notes);
        formData.append('preferred_days', JSON.stringify(this.lead.preferred_days));
        
        const timeSlotsKey = `preferred_time`;
        
        const timeSlots = (this.lead[timeSlotsKey] && this.lead[timeSlotsKey].filter(slot => slot.value[0] && slot.value[1])) || [];

        if (timeSlots.length > 0) {
          const timeSlotValues = timeSlots.map(slot => slot.value);
          formData.append('preferred_time', JSON.stringify(timeSlotValues));
        }
        const token = localStorage.getItem('token');
        axios.post(`${process.env.VUE_APP_API_BASE_URL}leadCreate`, formData,{
                headers: { Authorization: `Token ${token}` }
        })
        .then(response => {
          console.log('Lead created successfully:', response.data);
          this.showSuccessModal = true;
        })
        .catch(error => {
          console.error('Error creating Lead:', error.response && error.response.data ? error.response.data : error);
          alert('Error in creating Lead');
        });
        
      },
      goToLeadsList()
      {
        this.showSuccessModal = false;
        this.$router.push({ name: 'leads' });
      },
      addMoreLead()
      {
        this.showSuccessModal = false;
        // Reset form
        this.lead = {
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
        };
        this.errors.clear();
        this.$validator.reset();
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
        if (this.lead.program_type !== 'Group') {
          this.lead.preferred_days = [];
          this.lead.preferred_time = [{ value: ['', ''] }];
        }
      
        const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}programListTrainer/${program_type}/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.programs = response.data;
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
      },
      async fetchCountries()
      {
          const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}fetchCountry/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.countries = response.data;
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
      },
      trainer_availabilitymodal()
      {
        this.modal_1 = true;
      },
      group_availabilitymodal()
      {
        this.modal_2 = true;
      },
      async fetchTrainer()
        {
            try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}byrole/3/`);
            // console.log(response);
            this.trainers = response.data;
            
            // this.roles = response.data;
            } catch (error) {
            console.error('Error fetching roles:', error);
            }
        },
    
    },
    mounted(){
      
      this.fetchProgram();
      this.fetchCountries();
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
  .time_field
  {
    border: 1px solid #dcd0d0;
    width: 30%;
    padding: 5px;
    border-radius: 7px;
  }
</style>
