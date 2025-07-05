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
        <h3>Bi-weekly Updates</h3>
        <a v-if="biweeklyDetails.length == 0" href="#" v-b-modal.modal-1 class="btn  btn-success mr-4" @click="handleBiweeklyData()">Add Week 1 Data</a>
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
                              <th>Date</th>
                              <th>Notes</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(week, index) in biweeklyDetails">
                                <td>{{ index+1 }}</td>
                                <td>{{ week.update_date }}</td>
                                <td>
                                    <el-tooltip class="item" effect="dark" :content="week.notes" placement="top">
                                        <span class="truncate-notes">{{ week.notes }}</span>
                                    </el-tooltip>
                                </td>
                                <td>
                                    <button
                                        v-if="week.status"
                                        class="btn btn-sm btn-success"
                                        disabled
                                    >
                                        Completed
                                    </button>
                                    <button
                                        v-else
                                        class="btn btn-sm btn-primary"
                                        v-b-modal.modal-1
                                        @click="handleBiweeklyData(week.id)"
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
    <b-modal id="modal-1" title="Bi-weekly Data Updation" hide-footer v-if="modal_1">
        <b-form @submit.prevent="saveBiweeklydata">
            <h6 class="heading-small text-muted mb-2">Bi-weekly Data Updation</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="biweekly.notes" required></textarea>
                        </base-input>
                        <base-input
                        type="hidden"
                        v-model="biweekly.week_no"
                        >
                        </base-input>
                    </b-col>
                    <div>
                        <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                        <b-button type="submit"  variant="primary">Save</b-button>
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
                biweeklyDetails: [],
                week_days: 0,
                biweekly: {
                    notes: '',
                    week_no: 1,
                    status: true
                },
                week_id: null,
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
            async BiweeklyUpdates(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/biweeklyDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.biweeklyDetails = response.data;
                    
                    console.log(response.data);
                    if(response.data.length != 0)
                    {
                        this.biweekly.week_no = response.data.length;
                    }
                    
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            
            saveBiweeklydata()
            {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('week_no', this.biweekly.week_no);
                formData.append('notes', this.biweekly.notes);
                formData.append('status', this.biweekly.status);
                formData.append('biweekly_id', this.week_id);
              
                axios.post(`http://127.0.0.1:8000/api/user/bi_weekly_data/update/${this.client[0].id}`, formData, {
                    headers: { 
                        Authorization: `Token ${token}`
                    }
                })
                .then(response => {
                    this.$bvToast.toast('Weekly updated successfully!', { variant: 'success' });
                    this.BiweeklyUpdates(this.client[0].id);
                    this.modal_1 = false;
                    this.resetForm();
                })
                .catch(error => {
                    console.error(error);
                    this.$bvToast.toast('Error updating workout', { variant: 'danger' });
                });
              
            },
            resetForm() {
                this.biweekly = {
                week_no: 1,
                status: true,
                notes: ''
                };
            },
            handleBiweeklyData(week_id=null)
            {
                this.modal_1 = true;
                this.week_id = week_id;
            }
            
        },
        mounted(){
            const id = this.$route.params.id;
          
            this.clientDetails(id);
            this.BiweeklyUpdates(id);
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
