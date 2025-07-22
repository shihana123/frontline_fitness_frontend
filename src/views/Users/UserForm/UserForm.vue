<template>
  <card>
    <b-row align-v="center" slot="header" >
      <b-col cols="8">
        <h3 class="mb-0">User Profile - Create</h3>
      </b-col>
    </b-row>

    <b-form @submit.prevent="createUser">
      <h6 class="heading-small text-muted mb-4">User information</h6>

      <div class="pl-lg-4">
        
        <b-row >
          <b-col lg="6">
            <base-input
              type="text"
              label="Name"
              placeholder="Name"
              v-model="user.name"
              v-validate="'required|alpha'"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input label="Select Role">
            <select class="form-control" v-model="user.role">
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.rolename }}
                </option>
            </select>
            </base-input>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <base-input
              type="email"
              label="Username/Email"
              placeholder="Username"
              v-model="user.email   "
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="password"
              label="Password"
              placeholder="*****"
              v-model="user.password"
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
              v-model="user.phonenumber"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="number"
              label="Age"
              placeholder="Age"
              v-model="user.age"
            >
            </base-input>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <base-input label="Gender" v-model="user.gender">
            <select class="form-control">
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
            </select>
            </base-input>
          </b-col>
          
        </b-row>

      </div>
      <hr class="my-4">

      <!-- Address -->
      <h6 class="heading-small text-muted mb-4">Contact information</h6>

      <div class="pl-lg-4">
        <b-row>
          <b-col md="12">
            <base-input
              type="text"
              label="Address"
              placeholder="Home Address"
              v-model="user.address"
            >
            </base-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <base-input
              type="text"
              label="City"
              placeholder="City"
              v-model="user.city"
            >
            </base-input>
          </b-col>
          <b-col lg="4">
            <base-input
              type="text"
              label="Country"
              placeholder="Country"
              v-model="user.country"
            >
            </base-input>
          </b-col>
          <b-col lg="4">
            <base-input
              label="Postal Code"
              placeholder="ZIP Code"
              v-model="user.postalCode"
            >
            </base-input>
          </b-col>
        </b-row>
      </div>

      <hr class="my-4">
      <!-- Description -->
      <h6 class="heading-small text-muted mb-4">Documents</h6>
      <div class="pl-lg-4">
        <b-row>
          <b-col lg="6">
            <base-input
              type="file"
              label="Resume"
              placeholder="Resume"
              v-model="user.resume"
              @change="handleFileUpload($event, 'resume')"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="file"
              label="Contract"
              placeholder="Contract"
              v-model="user.contract"
              @change="handleFileUpload($event, 'contract')"
            >
            </base-input>
          </b-col>
        </b-row>
      </div>

      <hr class="my-4">
      <!-- Description -->
      <h6 class="heading-small text-muted mb-4">Work Data</h6>
      <div class="pl-lg-4">
        <b-row>
          <b-col lg="6">
            <base-input
              type="date"
              label="Joining Date"
              placeholder="Joining Date"
              v-model="user.joiningDate"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <label class="form-control-label">Languages</label>
            <multiselect
              v-model="user.language"
              :options="languages"
              :multiple="true"
              :taggable="true"
              placeholder="Select languages"
            />
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="12">
            <base-input label="Available Days">
                <b-form-checkbox-group
                v-model="user.selectedDays"
                :options="days"
                name="days"
                stacked
                >
                </b-form-checkbox-group>
            </base-input>
            
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="12">
            <label class="form-control-label">
              Available Time
            </label>
            <div>
              <!-- <div v-for="(range, index) in user.timeRanges" :key="index" class="mb-4">
                <vue-slider
                  v-model="range.value"
                  :min="0"
                  :max="1440"
                  :interval="15"
                  :tooltip="'always'"
                  :dot-size="16"
                  :marks="timeMarks"
                  :formatter="formatTime"
                  :piecewise="true"
                  :piecewise-label="true"
                  :process="true"
                  :enable-cross="false"
                  :lazy="true"
                  :contained="true"
                  :use-range="true"
                  class="w-full"
                />
                <hr>
                <div>
                  Range {{ index + 1 }}: {{ formatTime(range.value[0]) }} - {{ formatTime(range.value[1]) }}
                </div>
              </div>
              <base-button icon type="primary" @click="addRange">Add More Time Range</base-button> -->
              <div v-for="(slot, index) in user.timeRanges" :key="index" class="slot-row">
                        <input
                          type="time"
                          v-model="slot.value[0]"
                          
                        />
                        <span>to</span>
                        <input
                          type="time"
                          v-model="slot.value[1]"
                          
                        />
                        <b-button type="button" @click="removeSlot(index)">❌</b-button>
                      </div>
                      <b-button type="button" @click="addSlot()">➕ Add Time Slot</b-button>
            </div>
          </b-col>
          
        </b-row><br>
        <b-button type="submit" variant="success" class="submit_btn">Create User</b-button>
      </div>

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
        user: {
          name: '',
          email: '',
          password: '',
          role: '',
          phonenumber: '',
          age: '',
          gender: '',
          address: '',
          city: '',
          country: '',
          postalCode: '',
          resume: '',
          contract: '',
          joiningDate: '',
          language: [],
          selectedDays: [],
          // timeRanges : [
          //   { value : [540, 720] }
          // ],
          timeRanges: [
            { value : ['', ''] }
          ]
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
        languages: ['English', 'Spanish', 'French', 'German', 'Hindi', 'Malayalam', 'Tamil', 'Telugu'],
        roles: [],
      };
    },
    computed: {
      timeMarks() {
        const marks = {}
        for (let i = 0; i <= 1440; i += 60) {
          marks[i] = this.formatTime(i)
        }
        return marks
      }
    },
    methods: {
      
      formatTime(minutes) {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        const hour = h % 24
        const suffix = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 === 0 ? 12 : hour % 12
        const displayMin = m.toString().padStart(2, '0')
        return `${displayHour}:${displayMin} ${suffix}`
      },
      addRange() {
        this.user.timeRanges.push({ value: [600, 720] }) // default new range: 10:00 AM to 12:00 PM
      },
      addSlot() {
          
          // this.program.timeSlots1.push({ start: '', end: '' })
          const key = 'timeRanges'
          if (!this.user[key]) {
            
            this.$set(this.user, key, []) // Ensure it's reactive
          }
          console.log(this.user[key]);
          
          this.user[key].push({ value: ['', ''] })
      },
      removeSlot(index) {
          const key = 'timeRanges'
          if (!this.user[key]) {
            this.$set(this.user, key, []) // Ensure it's reactive
          }
          this.user[key].splice(index, 1)
      },
      createUser()
      {
        const formData = new FormData();
        formData.append('name', this.user.name);
        formData.append('email', this.user.email);
        formData.append('role_id', this.user.role);
        formData.append('password', this.user.password);
        formData.append('phone', this.user.phonenumber);
        formData.append('age', this.user.age);
        formData.append('gender', this.user.gender);
        formData.append('address', this.user.address);
        formData.append('city', this.user.city);
        formData.append('country', this.user.country);
        formData.append('pincode', this.user.postalCode);
        formData.append('joining_date', this.user.joiningDate);
        // formData.append('available_time', this.user.timeRanges);

        // Append file inputs
        if (this.user.resume) {
          formData.append('resume', this.user.resume);
        }
        if (this.user.contract) {
          formData.append('contract', this.user.contract);
        }

        // For arrays, use JSON.stringify
        formData.append('language', JSON.stringify(this.user.language));
        formData.append('available_days', JSON.stringify(this.user.selectedDays));
        
        const timeSlotsKey = `timeRanges`;
        
        const timeSlots = (this.user[timeSlotsKey] && this.user[timeSlotsKey].filter(slot => slot.value[0] && slot.value[1])) || [];

        if (timeSlots.length > 0) {
          const timeSlotValues = timeSlots.map(slot => slot.value);
          formData.append('available_time', JSON.stringify(timeSlotValues));
        }
        console.log(formData);
        
        axios.post(`${process.env.VUE_APP_API_BASE_URL}userCreate`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log('User created successfully:', response.data);
        })
        .catch(error => {
          console.error('Error creating user:', error.response && error.response.data ? error.response.data : error);

        });
        
      },
      async fetchRoles() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}roles/`);
          console.log(response);
          this.roles = response.data;
          
          // this.roles = response.data;
        } catch (error) {
          console.error('Error fetching roles:', error);
        }
      },
      handleFileUpload(event, field) {
        this.user[field] = event.target.files[0];
      }

    },
    mounted(){
      this.fetchRoles();
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
