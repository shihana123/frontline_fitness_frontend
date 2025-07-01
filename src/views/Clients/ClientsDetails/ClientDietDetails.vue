<template>
  <b-card no-body class="card-profile" alt="Image placeholder" img-top>
    <b-row class="justify-content-center">
      <b-col lg="3" class="order-lg-2">
        <div class="card-profile-image">
          <a href="#">
            <!-- <b-img src="img/theme/team-4.jpg" rounded="circle" /> -->
          </a>
        </div>
      </b-col>
    </b-row>

    <b-card-header class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
      <div class="d-flex justify-content-between">
        <a href="#" class="btn btn-sm btn-info mr-4">Weekly Dietchart Updates</a>
      </div>
    </b-card-header>
    <div>
      <b-card-header  class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
        <div class="d-flex justify-content-between">
          <!-- <a href="#" v-b-toggle.collapse-1 class="btn btn-sm btn-success mr-4">Week{{ week['week_no'] }}</a> -->
          <!-- <a href="#" @click.prevent v-b-toggle="'collapse-' + week['week_no']" class="btn btn-sm btn-success mr-4">Week {{ week['week_no'] }}</a> -->
        </div>
      </b-card-header>
      <b-card-body class="pt-0">
        
          <b-row>
            <!-- <b-collapse :id="'collapse-' + week['week_no']"> -->
              <b-container fluid>
                <b-row>
                  <b-col xl="12" md="12" sm="12">
                    <div p-2 class="el-table table-responsive table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
                      
                        <table class="table table-flush workout_table el-table__header">
                          <thead class="thead-light">
                            <tr>
                              <th width="10">Slno</th>
                              <th>Week No</th>
                              <th>Diet Chart</th>
                              <!-- <th>Reps</th> -->
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(week, index) in dietChartDetails">
                                <td>{{ index+1 }}</td>
                                <td>Week {{ index+1 }}</td>
                                <td>
                                    <button
                                        v-if="week.diet_chart"
                                        class="btn btn-sm btn-primary"
                                        @click="viewPdf(week.diet_chart)"
                                    >
                                        View PDF
                                    </button>
                                </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                    </b-col>
                    
                  </b-row>
                  <b-row>
                      <b-col >
                        <b-card-header  class=" button_header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            <div class="d-flex justify-content-between">
                            <!-- <a href="#" v-b-toggle.collapse-1 class="btn btn-sm btn-success mr-4">Week{{ week['week_no'] }}</a> -->
                            <a href="#" @click.prevent v-b-toggle.collapse-1 class="btn btn-sm btn-success mr-4">Add Next Week Diet Chart Week -{{ week_days }}</a>
                            </div>
                        </b-card-header>
                        <b-card-body class="pt-0">
                            <b-form @submit.prevent="updateDietData">
                                <b-row>
                                    <b-collapse :id="'collapse-1'">
                                        <b-container class="button_header">
                                            <b-row>
                                                <b-col xl="6" md="6" sm="6">
                                                    <base-input
                                                    type="file"
                                                    placeholder="Upload Diet Chart"
                                                    v-validate="'required|mimes:application/pdf'"
                                                    class="table_input"
                                                    label="Upload Diet Chart"
                                                    v-model="dietDetails.diet_chart"
                                                    @change="handleFileUpload($event, 'diet_chart')"
                                                    >
                                                    </base-input>
                                                    <base-input
                                                    type="hidden"
                                                    v-validate="'required'"
                                                    class="table_input" 
                                                    v-model="dietDetails.week_no"
                                                    :value="week_days"
                                                    >
                                                    </base-input>
                                                </b-col>
                                                
                                            </b-row>
                                            <b-row>
                                                <b-col xl="6" md="6" sm="6">
                                                    <b-button type="submit" class="btn btn-sm btn-warning mr-4">Upload</b-button>
                                                </b-col>
                                            </b-row>
                                        </b-container>
                                    </b-collapse>
                                </b-row>
                            </b-form>
                        </b-card-body>
                      </b-col>
                    </b-row>
                </b-container>
              <!-- </b-collapse> -->
          </b-row>
          
        
      </b-card-body>

     
    </div>
    
    <div v-if=" dietChartDetails.length == 0">
        <b-card-header  class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
            <div class="d-flex justify-content-between">
            <!-- <a href="#" v-b-toggle.collapse-1 class="btn btn-sm btn-success mr-4">Week{{ week['week_no'] }}</a> -->
            <a href="#" @click.prevent  class="btn btn-sm btn-success mr-4">Week 1</a>
            </div>
        </b-card-header>
        <b-card-body class="pt-0">
            <b-form @submit.prevent="updateDietData">
                <b-row>
                    <!-- <b-collapse :id="'collapse-1'"> -->
                        <b-container fluid>
                            <b-row>
                                <b-col xl="6" md="6" sm="6">
                                    <base-input
                                    type="file"
                                    placeholder="Upload Diet Chart"
                                    v-validate="'required|mimes:application/pdf'"
                                    class="table_input"
                                    label="Upload Diet Chart"
                                    v-model="dietDetails.diet_chart"
                                    @change="handleFileUpload($event, 'diet_chart')"
                                    >
                                    </base-input>
                                    <base-input
                                    type="hidden"
                                    v-validate="'required'"
                                    class="table_input" 
                                    v-model="dietDetails.week_no"
                                    value="1"
                                    >
                                    </base-input>
                                </b-col>
                                
                            </b-row>
                            <b-row>
                                <b-col xl="6" md="6" sm="6">
                                    <b-button type="submit" class="btn btn-sm btn-warning mr-4">Upload</b-button>
                                </b-col>
                            </b-row>
                        </b-container>
                    <!-- </b-collapse> -->
                </b-row>
            </b-form>
        </b-card-body>
    </div>
    
  </b-card>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                client: [],
                dietChartDetails: [],
                week_days: 0,
                dietDetails: {
                    diet_chart: '',
                    week_no: 1
                },
                week_id: 1 
            }
        },
        methods:{
            async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/clientDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.client = response.data;
                    
                    // console.log('programs fetched successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            async WeeklyDietUpdates(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/weekdietDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.dietChartDetails = response.data;
                    console.log(response.data.length);
                    if(response.data)
                    {
                        this.week_days = response.data.length + 1;
                        this.week_table_id = response.data[0].id;
                        // this.week_id = 
                    }
                    
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            
            updateDietData()
            {
              
                console.log(this.dietDetails.diet_chart);
                
                const token = localStorage.getItem('token');

                const formData = new FormData();
                formData.append('week_no', this.dietDetails.week_no);
                formData.append('diet_chart', this.dietDetails.diet_chart);
              
                axios.post(`http://127.0.0.1:8000/api/user/diet_chart/update/${this.client[0].id}`, formData, {
                    headers: { 
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data' 
                    }
                })
                .then(response => {
                    this.$bvToast.toast('DietChart updated successfully!', { variant: 'success' });
                    this.WeeklyDietUpdates(this.client[0].id);
                })
                .catch(error => {
                    console.error(error);
                    this.$bvToast.toast('Error updating workout', { variant: 'danger' });
                });
              
            },
            handleFileUpload(event, field) {
                this.dietDetails[field] = event.target.files[0];
            },
            viewPdf(pdfUrl) {
                const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `http://127.0.0.1:8000${pdfUrl}`;
                window.open(fullUrl, '_blank');
            }
            
        },
        mounted(){
            const id = this.$route.params.id;
          
            this.clientDetails(id);
            this.WeeklyDietUpdates(id);
        }
    };
</script>
<style scoped>
  .table_row
  {
    padding: 10px !important;
    font-size: 10px !important;
  }
  .table_input
  {
    font-size: 10px !important;
  }
  .form-group {
    margin-bottom: 0rem;
  }
  .workout_table
  {
    border: 1px solid #f1e7e7;
  }
  .collapse 
  {
    width: 100%;
  }
  .button_header
  {
    padding-left: 0px;
  }
</style>
