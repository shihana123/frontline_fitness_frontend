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
              label="First Name"
              placeholder="First Name"
              v-model="user.firstName"
              v-validate="'required|alpha'"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="text"
              label="Last Name"
              placeholder="Last Name"
              v-model="user.lastName"
            >
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
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="file"
              label="Contract"
              placeholder="Contract"
              v-model="user.contract"
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
              <div v-for="(range, index) in user.timeRanges" :key="index" class="mb-4">
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
              <base-button icon type="primary" @click="addRange">Add More Time Range</base-button>
              <!-- <button @click="addRange">Add Time Range</button> -->
              <!-- <pre>{{ user.timeRanges }}</pre> -->
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
          email: '',
          firstName: '',
          lastName: '',
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
          timeRanges : [
            { value : [540, 720] }
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
      createUser()
      {
        axios.post('http://127.0.0.1:8000/api/auth/login', {
          data: this.user
        })
        .then(response => {
          
          console.log(response);
          
        })
        .catch(error => {
          console.log(error);
          
        })
        
      }
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
