<template>
  <card>
    <b-row align-v="center" slot="header" >
      <b-col cols="8">
        <h3 class="mb-0">Client - Create</h3>
      </b-col>
    </b-row>
    

    <b-form @submit.prevent="createLead">
      <h6 class="heading-small text-muted mb-4">Client information</h6>

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
            <base-input
              type="text"
              label="Source *"
              placeholder="Source"
              v-model="lead.source"
              v-validate="'required|alpha'"
              required
            >
            </base-input>
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
            <label class="form-control-label">Program Type *</label>
              <select class="form-control" v-model="lead.program_type" @change="fetchProgram">
                <option v-for="program_type in programTypes" :value="program_type">{{ program_type }}</option>
              </select>
          </b-col>
          <b-col lg="6">
            <label class="form-control-label">Program Needed *</label>
            <select v-model="lead.program" class="form-control" required>
              <option v-for="program in programs" :key="program.id" :value="program.id">{{ program.name }}</option>
            </select>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <label class="form-control-label">Trainer *</label>
              <select class="form-control" v-model="lead.trainer" required>
                <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">
                    {{ trainer.name }}
                </option>
              </select>
          </b-col>
          <b-col lg="6">
            <base-input label="Dietitian *">
                <select class="form-control" v-model="lead.dietitian" required>
                    <option v-for="dietitian in dietitians" :key="dietitian.id" :value="dietitian.id">{{ dietitian.name }}</option>
                </select>
            </base-input>
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
            <b-col lg="6">
                        <base-input label="Choose Program Months *">
                            <select class="form-control" v-model="lead.program_month" required>
                                <option v-for="program_month in program_months" :key="program_month" :value="program_month">{{ program_month }}</option>
                            </select>
                        </base-input>
                    </b-col>
                    <b-col lg="6">
                        <base-input
                        type="text"
                        label="Amount *"
                        v-model="lead.amount"
                        required
                        >
                        </base-input>
                    </b-col>
        </b-row>

        <b-row>
            <b-col lg="6">
                <base-input
                type="date"
                label="Program Start Date *"
                v-model="lead.program_start_date"
                required
                >
                </base-input>
            </b-col>
            <b-col lg="6">
                <base-input
                type="date"
                label="Program End Date *"
                v-model="lead.program_end_date"
                disabled
                >
                </base-input>
            </b-col>
        </b-row>
      

        <b-button type="submit" variant="success" class="submit_btn">Create Client</b-button>
      </div>

    </b-form>

    <b-modal
      id="lead-success-modal"
      title="Client Management"
      hide-footer
      v-model="showSuccessModal"
    >
      <div class="text-center">
        <b-alert show variant="success">
          <span class="alert-icon"><i class="ni ni-like-2"></i></span>
          <span class="alert-text"><strong>Success!</strong> Client Created Successfully!</span>
        </b-alert>


        <b-button variant="primary" @click="goToLeadsList">Close</b-button>
        <b-button variant="info" class="ml-2" @click="addMoreClient">Add More</b-button>
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
  import TrainerAvailability from "../../Leads/Trainer/TrainerAvailabilityTimeView";
  import GroupTable from "../../Programs/ProgramTable/GroupAvailabilityTable";
  
 

  export default {
    components: {
      TrainerAvailability,
      GroupTable
    },
    data() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const yyyy = today.getFullYear();
      return {
        showSuccessModal: false,
        lead: {
            name: '',
            source: '',
            phone_no: '',
            email: '',
            status: 'Converted',
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
            program_month: 3,
            amount: 0,
            program_start_date: `${yyyy}-${mm}-${dd}`,
            program_end_date: '',
            dietitian: '',
        },
        trainers: [],
        dietitians: [],
        program_months: [1,3,6,9,12],
        days: [
          { text: 'Sunday', value: 'sunday' },
          { text: 'Monday', value: 'monday' },
          { text: 'Tuesday', value: 'tuesday' },
          { text: 'Wednesday', value: 'wednesday' },
          { text: 'Thursday', value: 'thursday' },
          { text: 'Friday', value: 'friday' },
          { text: 'Saturday', value: 'saturday' },
        ],
        status: ['Converted', 'InActive'],
        programTypes : ['Personal Training', 'Group', 'Recorded Sessions'],
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
      },
      'lead.program_start_date': 'updateEndDate',
      'lead.program_month': 'updateEndDate',
    },
    created() {
        this.updateEndDate(); // call once to initialize program_end_date
    },
    methods: {
        updateEndDate() {
            if (!this.lead.program_start_date || !this.lead.program_month) return;

            const startDate = new Date(this.lead.program_start_date);
            const monthsToAdd = parseInt(this.lead.program_month);

            // Calculate new end date
            const endDate = new Date(startDate.setMonth(startDate.getMonth() + monthsToAdd));

            const yyyy = endDate.getFullYear();
            const mm = String(endDate.getMonth() + 1).padStart(2, '0');
            const dd = String(endDate.getDate()).padStart(2, '0');

            this.lead.program_end_date = `${yyyy}-${mm}-${dd}`;
        },
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
        formData.append('trainer_id', this.lead.trainer);
        formData.append('follow_up_date', this.lead.followup_date);
        formData.append('preferred_days', JSON.stringify(this.lead.preferred_days));
        formData.append('dietitian_id', this.lead.dietitian);
        formData.append('program_month', this.lead.program_month);
        formData.append('amount', this.lead.amount);
        formData.append('program_start_date', this.lead.program_start_date);
        formData.append('program_end_date', this.lead.program_end_date);
        formData.append('status', this.lead.status);


        const timeSlotsKey = `preferred_time`;
        
        const timeSlots = (this.lead[timeSlotsKey] && this.lead[timeSlotsKey].filter(slot => slot.value[0] && slot.value[1])) || [];

        if (timeSlots.length > 0) {
          const timeSlotValues = timeSlots.map(slot => slot.value);
          formData.append('preferred_time', JSON.stringify(timeSlotValues));
        }
        const token = localStorage.getItem('token');
        axios.post(`${process.env.VUE_APP_API_BASE_URL}clientCreate`, formData,{
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
      addMoreClient()
      {
        this.showSuccessModal = false;
        // Reset form
        this.lead = {
            name: '',
            source: '',
            phone_no: '',
            email: '',
            status: 'Converted',
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
            program_month: 3,
            amount: 0,
            program_start_date: `${yyyy}-${mm}-${dd}`,
            program_end_date: '',
            dietitian: '',
        },
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
        async fetchDietitians()
        {
            const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}byrole/4/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.dietitians = response.data;
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
    
    },
    mounted(){
      
      this.fetchProgram();
      this.fetchCountries();
      this.fetchTrainer();
      this.fetchDietitians();
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
