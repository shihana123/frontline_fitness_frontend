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
        <h3>Measurement Updates - {{ client[0].name }}</h3>
        <router-link
              :to="{ name: 'clients/measurement_graphical_view', params: { id: client[0].id } }"
              class="btn btn-sm btn-default mr-4 create_btn"
            >
             Details
        </router-link>
      </div>
    </b-card-header>
    <div>
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
                              <th>TDC Meeting Date</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(measure, index) in measurementList">
                                <td>{{ index+1 }}</td>
                                <td>{{ measure.meeting_date }}</td>
                                <td>
                                  <span :style="{ color: measure.updated_date ? 'green' : 'red' }">
                                      {{ measure.updated_date ? 'Completed' : 'Pending' }}
                                  </span>
                                </td>
                                <td>
                                    <button
                                        v-if="measure.updated_date"
                                        class="btn btn-sm btn-success"
                                        v-b-modal.modal-2
                                        @click="viewMeasure(measure.measurement_id)"
                                    >
                                        View
                                    </button>
                                    <button
                                        v-else
                                        class="btn btn-sm btn-primary"
                                        v-b-modal.modal-1
                                        @click="handleMeasureUpdate(measure.measurement_id)"
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                    </b-col>
                    
                  </b-row>
                </b-container>
          </b-row>
      </b-card-body>
    </div>
    <b-modal id="modal-1" title="Update Measurement Details" hide-footer v-if="modal_1">
        <b-form @submit.prevent="saveMeasuredata">
            <h6 class="heading-small text-muted mb-2">Measurement Details</h6>
            <div>
                <b-row>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Chest (cm)"
                        placeholder="Chest (cm)"
                        v-model="measureData.chest"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Right Arm (cm)"
                        placeholder="Right Arm (cm)"
                        v-model="measureData.right_arm"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Left Arm (cm)"
                        placeholder="Left Arm (cm)"
                        v-model="measureData.left_arm"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Waist (cm)"
                        placeholder="Waist (cm)"
                        v-model="measureData.waist"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Hip (cm)"
                        placeholder="Hip (cm)"
                        v-model="measureData.hip"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Right Thigh (cm)"
                        placeholder="Right Thigh (cm)"
                        v-model="measureData.right_thigh"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Left Thigh (cm)"
                        placeholder="Left Thigh (cm)"
                        v-model="measureData.left_thigh"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Right Calf (cm)"
                        placeholder="Right Calf (cm)"
                        v-model="measureData.right_calf"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Left Calf (cm)"
                        placeholder="Left Calf (cm)"
                        v-model="measureData.left_calf"
                        required
                        >
                        </base-input>   
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="measureData.notes" required></textarea>
                        </base-input>
                        
                    </b-col>
                    <div>
                        <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                        <b-button type="submit" variant="primary">Save</b-button>
                    </div> 
                </b-row>
            </div>
        </b-form>
    </b-modal>

    <b-modal size="lg" id="modal-2" title="Measurememnt Details of Client" hide-footer v-if="modal_2">
        <div class="pl-lg-6">
            <h6 class="heading-small text-muted mb-2">Measurements</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Chest : <span>{{ measureDetails.chest }} cm</span></h5>
                        <h5>Right Arm : <span>{{ measureDetails.right_arm }} cm</span></h5>
                        <h5>Left Arm : <span>{{ measureDetails.left_arm }} cm</span></h5>
                        <h5>Waist : <span>{{ measureDetails.waist }} cm</span></h5>
                        <h5>Hip : <span>{{ measureDetails.hip }} cm</span></h5>
                        <h5>Right Thigh : <span>{{ measureDetails.right_thigh }} cm</span></h5>
                        <h5>Left Thigh : <span>{{ measureDetails.left_thigh }} cm</span></h5>
                        <h5>Right Calf : <span>{{ measureDetails.right_calf }} cm</span></h5>
                        <h5>Left Calf : <span>{{ measureDetails.left_calf }} cm</span></h5>
                        
                    </b-col>
                </b-row>
            </div>
        </div>
    </b-modal>

  </b-card>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                modal_1: false,
                modal_2: false,
                client: [],
                measurementList: [],
                week_days: 0,
                measureData: {
                    chest : 0,
                    right_arm: 0,
                    left_arm: 0,
                    waist: 0,
                    hip: 0,
                    left_thigh: 0,
                    right_thigh: 0,
                    right_calf: 0,
                    left_calf: 0,
                    notes: '',
                },
                measureDetails: [],
                measure_id: null,
            }
        },
        methods:{
            async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}clientDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.client = response.data;
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
                });
            },
            async MeasurementList(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}measurementList/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.measurementList = response.data;
                    console.log(this.measurementList);
                })
                .catch(error => {
                    console.error('Error:', error.response && error.response.data ? error.response.data : error);

                });
            },
            
            saveMeasuredata()
            {
              console.log(this.measure_id);
              
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('chest', this.measureData.chest);
                formData.append('right_arm', this.measureData.right_arm);
                formData.append('left_arm', this.measureData.left_arm);
                formData.append('waist', this.measureData.waist);
                formData.append('hip', this.measureData.hip);
                formData.append('left_thigh', this.measureData.left_thigh);
                formData.append('right_thigh', this.measureData.right_thigh);
                formData.append('right_calf', this.measureData.right_calf);
                formData.append('left_calf', this.measureData.left_calf);
                formData.append('meeting_id', this.measure_id);
              
                axios.post(`${process.env.VUE_APP_API_BASE_URL}measureData/update`, formData, {
                    headers: { 
                        Authorization: `Token ${token}`
                    }
                })
                .then(response => {
                    this.$bvToast.toast('Weekly updated successfully!', { variant: 'success' });
                    this.MeasurementList(this.$route.params.id);
                    this.modal_1 = false;
                    this.resetForm();
                })
                .catch(error => {
                    console.error(error);
                    this.$bvToast.toast('Error updating workout', { variant: 'danger' });
                });
              
            },
            async showMeasureDetails(meeting_id)
            {
                const token = localStorage.getItem('token');
                await axios.get(`${process.env.VUE_APP_API_BASE_URL}measurementDetails/${meeting_id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.measureDetails = response.data;
                    console.log(this.measureDetails);
                })
                .catch(error => {
                    console.error('Error:', error.response && error.response.data ? error.response.data : error);

                });
            },
            resetForm() {
                this.measureData = {
                  chest : 0,
                  right_arm: 0,
                  left_arm: 0,
                  waist: 0,
                  hip: 0,
                  left_thigh: 0,
                  right_thigh: 0,
                  right_calf: 0,
                  left_calf: 0,
                  notes: '',
                };
            },
            handleMeasureUpdate(measure_id)
            {
              this.measure_id = measure_id;
              this.modal_1 = true;
            },
            viewMeasure(measure_id)
            {
              this.measure_id = measure_id;
              this.showMeasureDetails(this.measure_id);
              this.modal_2 = true;
            }
            
        },
        mounted(){
            const id = this.$route.params.id;
            this.clientDetails(id);
            this.MeasurementList(id);
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
  .truncate-notes {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
</style>
