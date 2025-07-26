<template>
  <div>
    <!-- Header -->
    <div class="header  py-4">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <img src="img/brand/FF_logo.jpg" class="logo_auth">
              <!-- <h1 class="text-white">Welcome!</h1> -->
              <!-- <p class="text-lead text-white">Use these awesome forms to login or create new account in your project for
                free.</p> -->
            </b-col>
          </b-row>
        </div>
      </b-container>
      <!-- <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div> -->
    </div>
    <!-- Page content -->
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7" class="mt-4">
          <b-card no-body class="bg-secondary border-0 mb-0">
            
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <h3>Welcome, Sign In</h3>
              </div>
              <!-- <validation-observer v-slot="{handleSubmit}" ref="formValidator"> -->
                <b-form role="form" @submit.prevent="handleSubmit">
                  <base-input alternative
                              class="mb-3"
                              name="Email"
                              :rules="{required: true, email: true}"
                              prepend-icon="ni ni-email-83"
                              placeholder="Email"
                              v-model="cred.email">
                  </base-input>

                  <base-input alternative
                              class="mb-3"
                              name="Password"
                              :rules="{required: true, min: 6}"
                              prepend-icon="ni ni-lock-circle-open"
                              type="password"
                              placeholder="Password"
                              v-model="cred.password">
                  </base-input>

                  <!-- <b-form-checkbox v-model="model.rememberMe">Remember me</b-form-checkbox> -->
                  <div class="text-center">
                    <base-button type="success"  native-type="submit" class="my-4 submit_btn">Sign in</base-button>
                  </div>
                </b-form>
              <!-- </validation-observer> -->
            </b-card-body>
          </b-card>
          <b-row class="mt-3">
            <b-col cols="6">
              <router-link to="/dashboard" class="text-light"><small>Forgot password?</small></router-link>
            </b-col>
            
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        cred: {
          email: '',
          password: '',
          rememberMe: false,
        },
        role: ''
      };
    },
    methods: {
      async handleSubmit() {
        // this will be called only after form is valid. You can do api call here to login

        try {
        const response = await axios.post('http://13.48.75.237/api/auth/login', {
          email: this.cred.email,
          password: this.cred.password
        });

        const token = response.data.key;
        localStorage.setItem('token', token);

        // Wait for userDetails to finish
        await this.userDetails();

        // Only after userDetails completes
        console.log(this.role);
        localStorage.setItem('role_name', this.role);
        if(this.role == 'Sales')
        {
          this.$router.push('/dashboard');
        }
        else if(this.role == 'Dietitian')
        {
          this.$router.push('dietitan/dashboard');
        }
        else if(this.role == 'Trainer')
        {
          this.$router.push('/dashboard');
        }
        else if(this.role == 'Admin')
        {
          this.$router.push('/dashboard');
        }
        else if(this.role == 'VMC')
        {
          this.$router.push('/dashboard');
        }
        

      } catch (error) {
        console.log(error);
      }
        
        // axios.post('http://127.0.0.1:8000/api/auth/login', {
        //   email : this.cred.email,
        //   password : this.cred.password
        // })
        // .then(response => {
        //   const token = response.data.key
        //   localStorage.setItem('token', token) 
        //   await this.userDetails();
        //   console.log(this.role);
          
        //   this.$router.push('/dashboard')
        //   console.log(response);
          
        // })
        // .catch(error => {
        //   console.log(error);
          
        // })
      },
      async userDetails()
      {
        const token = localStorage.getItem('token');
        await axios.get(`${process.env.VUE_APP_API_BASE_URL}userDetails/`, {
        headers: { Authorization: `Token ${token}` }
        })
        .then(response => {
            console.log(response.data);
            this.role = response.data.roles[0].role.rolename;
        })
        .catch(error => {
            console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

        });
      }
    },
    mounted()
    {
     console.log(localStorage.getItem('token'));
    }
  };
</script>
<style scoped>
  .logo_auth
  {
    width: 150px !important;
  }
  .submit_btn
  {
    background: #00835c;
  }
</style>
