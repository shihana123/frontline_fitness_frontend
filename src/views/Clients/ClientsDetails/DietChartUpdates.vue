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
                              <th>Uploaded</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(dietchart, index) in dietchartList">
                                <td>{{ index+1 }}</td>
                                <td>{{ dietchart.meeting_date }}</td>
                                <td>
                                  <span :style="{ color: dietchart.uploaded ? 'green' : 'red' }">
                                      {{ dietchart.uploaded ? 'Uploaded' : 'Pending' }}
                                  </span>
                                </td>
                                <td>
                                    <button
                                        v-if="dietchart.uploaded"
                                        class="btn btn-sm btn-success"
                                        v-b-modal.modal-2
                                        
                                    >
                                        View
                                    </button>
                                    <button
                                        v-else
                                        class="btn btn-sm btn-primary"
                                        v-b-modal.modal-1
                                        @click="handledietchartUpload(dietchart.id)"
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
    <b-modal id="modal-1" title="Update Diet Chart" hide-footer v-if="modal_1">
        <b-form @submit.prevent="saveDietchart">
            <h6 class="heading-small text-muted mb-2">Upload Diet Chart</h6>
            <div>
                <b-row>
                    <b-col lg="12">
                        <base-input
                        type="file"
                        label="Diet Plan"
                        placeholder="Diet Plan"
                        v-model="dietchartdata.diet_chart"
                        requied
                        @change="handleFileUpload($event, 'diet_chart')"
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="dietchartdata.notes" required></textarea>
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

    

  </b-card>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                modal_1: false,
                client: [],
                dietchartList: [],
                dietchartdata: {
                    diet_plan : '',
                    notes: '',
                },
                dietchart_id: null,
            }
        },
        methods:{
            handleFileUpload(event, field) {
                this.dietchartdata[field] = event.target.files[0];
            },
            async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/clientDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.client = response.data;
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
                });
            },
            async DietChartList(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/dietchartList/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.dietchartList = response.data;
                    console.log(this.dietchartList);
                })
                .catch(error => {
                    console.error('Error:', error.response && error.response.data ? error.response.data : error);

                });
            },
            
            saveDietchart()
            {
              
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('notes', this.dietchartdata.notes);
                if (this.dietchartdata.diet_chart) {
                    formData.append('diet_chart', this.dietchartdata.diet_chart);
                }
                formData.append('dietchart_id', this.dietchart_id);
              
                axios.post(`http://127.0.0.1:8000/api/user/dietChart/update`, formData, {
                    headers: { 
                        Authorization: `Token ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    this.$bvToast.toast('Weekly updated successfully!', { variant: 'success' });
                    
                    
                    this.resetForm();
                    this.modal_1 = false;
                    this.DietChartList(this.$route.params.id);
                })
                .catch(error => {
                    console.error(error);
                    this.$bvToast.toast('Error updating workout', { variant: 'danger' });
                });
              
            },
            resetForm() {
                this.dietchartdata = {
                  diet_plan : '',
                  notes: '',
                };
            },
            handledietchartUpload(dietchart_id)
            {
              this.dietchart_id = dietchart_id;
              this.modal_1 = true;
            },
         
        },
        mounted(){
            const id = this.$route.params.id;
            this.clientDetails(id);
            this.DietChartList(id);
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
