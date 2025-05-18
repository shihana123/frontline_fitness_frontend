<template>
  <card>
    <b-row align-v="center" slot="header" >
      <b-col cols="8">
        <h3 class="mb-0">User Profile - Create</h3>
      </b-col>
    </b-row>

    <b-form @submit.prevent="updateProfile">
      <h6 class="heading-small text-muted mb-4">User information</h6>

      <div class="pl-lg-4">
        
        <b-row >
          <b-col lg="6">
            <base-input
              type="text"
              label="First Name"
              placeholder="First Name"
              v-model="user.firstName"
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
            <base-input label="Languages Known" v-model="user.language">
            <select  class="form-control">
                <option>Malayalam</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
            </select>
            </base-input>
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
            <base-input label="Available Time">
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
      </div>

    </b-form>
  </card>
</template>
<script>
export default {
  data() {
    return {
      user: {
        company: 'Creative Code Inc.',
        username: 'michael23',
        email: '',
        firstName: 'Mike',
        lastName: 'Andrew',
        address: 'Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09',
        city: 'New York',
        country: 'USA',
        postalCode: '',
        aboutMe: `Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo.`,
        selectedDays: [],
      },
      days: [
        { text: 'Sunday', value: 'sunday' },
        { text: 'Monday', value: 'monday' },
        { text: 'Tuesday', value: 'tuesday' },
        { text: 'Wednesday', value: 'wednesday' },
        { text: 'Thursday', value: 'thursday' },
        { text: 'Friday', value: 'friday' },
        { text: 'Saturday', value: 'saturday' },
      ]
    };
  },
  methods: {
    updateProfile() {
      alert('Your data: ' + JSON.stringify(this.user));
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
</style>
