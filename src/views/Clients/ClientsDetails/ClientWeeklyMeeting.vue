<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Weekly Meeting - {{ client[0].name }}</h3>
            
            <router-link
              :to="{ name: 'clients/graphical_view', params: { id: client[0].id } }"
              class="btn btn-sm btn-default mr-4 create_btn"
            >
             Details
          </router-link>
        </b-card-header>
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="meetingList">
            <el-table-column label="Week" min-width="100px">
                <template v-slot="scope">
                    Week - {{ scope.row.week_no }}
                </template>
            </el-table-column>

            <el-table-column label="Date" min-width="150px">
                <template v-slot="scope">
                    {{ scope.row.meeting_date }}
                </template>
            </el-table-column>

            <el-table-column label="Status" min-width="150px">
                <template v-slot="scope">
                    <span :style="{ color: scope.row.status ? 'green' : 'red' }">
                        {{ scope.row.status ? 'Completed' : 'Pending' }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="Action"
                             prop="completion"
                             min-width="95px">
                <template #default="scope">
                    <!-- <b-button v-b-modal.modal-1 variant="primary">Launch demo modal</b-button> -->
                    <base-button v-b-modal.modal-2
                    type="primary"
                    size="small"
                    @click="viewWeeklyDetails(scope.row.id)" class="table_button" v-if="scope.row.status">
                    View
                    </base-button>

                    <base-button v-b-modal.modal-1
                    type="warning"
                    size="small"
                    @click="viewUpdateWeeklyDetails(scope.row.id)" class="table_button" v-else>
                    Update
                    </base-button>
                </template>
            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
    
    <b-modal id="modal-1" title="Update Client Details" hide-footer v-if="modal_1">
        <b-form @submit.prevent="updateWeeklydata">
            <h6 class="heading-small text-muted mb-2" v-if="previousMeetingData.length != 0">Previous Data</h6>
            <div class="pl-lg-12" v-if="previousMeetingData.length != 0">
              <b-row >
                  <b-col lg="6">
                    <h5>Height: <span>{{ previousMeetingData.height }} cm</span></h5>
                    <h5>Weight: <span>{{ previousMeetingData.weight }} kg</span></h5>
                    <h5>BMI: <span>{{ previousMeetingData.bmi }} </span></h5>
                  </b-col>
              </b-row>
            </div>
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Height (cm)"
                        placeholder="Height (cm)"
                        v-model="clientData.height"
                        requied
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Weight (kg)"
                        placeholder="Weight (kg)"
                        v-model="clientData.weight"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="BMI"
                        placeholder="BMI"
                        v-model="clientData.bmi"
                        disabled
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="clientData.notes" required></textarea>
                        </base-input>
                        
                    </b-col>
                    <div>
                        <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                        <b-button type="submit"  variant="primary">Next</b-button>
                    </div> 
                </b-row>
            </div>
        </b-form>
    </b-modal>

    <b-modal id="modal-2" title="Client Details" hide-footer v-if="modal_2">
       
            <h6 class="heading-small text-muted mb-2" v-if="previousMeetingData.length != 0">Client Data</h6>
            <div class="pl-lg-12" v-if="previousMeetingData.length != 0">
              <b-row >
                  <b-col lg="6">
                    <h5>Height: <span>{{ previousMeetingData.height }} cm</span></h5>
                    <h5>Weight: <span>{{ previousMeetingData.weight }} kg</span></h5>
                    <h5>BMI: <span>{{ previousMeetingData.bmi }} </span></h5>
                  </b-col>
              </b-row>
            </div>
      
    </b-modal>

</div>
</template>

<script>
  import axios from 'axios'
  import projects from '../../Tables/projects'
  import { Table, TableColumn} from 'element-ui'
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        modal_1: false,
        modal_2: false,
        currentPage: 1,
        no_of_consultation: '',
        meeting_id: null,
        selectedClientID: '',
        client: [],
        clientData : {
          height: '',
          weight: '',
          bmi: '',
          notes: '',
        },
        meetingDetails: [],
        meetingList: [],
        previousMeetingData: []
      };
    },
    watch: {
    'clientData.height': 'calculateBMI',
    'clientData.weight': 'calculateBMI'
    },
    methods:{
        calculateBMI() {
            const height = parseFloat(this.clientData.height);
            const weight = parseFloat(this.clientData.weight);

            if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            this.clientData.bmi = bmi.toFixed(2); // Rounded to 2 decimal places
            } else {
            this.clientData.bmi = '';
            }
        },
        async WeeklyMeetingList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}weeklyMeetingList/${this.$route.params.id}`, {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.meetingList = response.data;
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        resetForm() {
            this.clientData = {
              height: '',
              weight: '',
              bmi: '',
              notes: ''
            };
        },
        viewUpdateWeeklyDetails(id)
        {
            this.meeting_id = id;
            this.fetchprevWeekDetails(this.meeting_id);
            this.modal_1 = true;
        },
        viewWeeklyDetails(id)
        {
          this.fetchMeetingDetails(id)
          this.modal_2 = true;
          
        },
        async fetchMeetingDetails(meetingid)
        {
          const token = localStorage.getItem('token');
          try {
            // Fetch the previous meeting by week_no and client
            const prevResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}weeklyMeetingDetails/${meetingid}`, {
              headers: { Authorization: `Token ${token}` }
            });

            this.previousMeetingData = prevResponse.data; // bind to your modal preview area
            
          } catch (error) {
            console.error("Error fetching previous weekly meeting:", _context2.t0.response && _context2.t0.response.data ? _context2.t0.response.data : _context2.t0);

            this.previousMeetingData = null;
          }
        },
        async fetchprevWeekDetails(currentMeetingId){
          const token = localStorage.getItem('token');

          try {
            // Fetch current meeting first to get week_no & client ID
            const currentResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}weeklyMeetingDetails/${currentMeetingId}`, {
              headers: { Authorization: `Token ${token}` }
            });

            const currentData = currentResponse.data;
            const prevWeekNo = currentData.week_no - 1;
            const clientId = currentData.client;

            // Fetch the previous meeting by week_no and client
            const prevResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}weeklyMeetingByWeekNo?client_id=${clientId}&week_no=${prevWeekNo}`, {
              headers: { Authorization: `Token ${token}` }
            });

            this.previousMeetingData = prevResponse.data; // bind to your modal preview area
            console.log(this.previousMeetingData);
            
          } catch (error) {
            console.error("Error fetching previous weekly meeting:", _context2.t0.response && _context2.t0.response.data ? _context2.t0.response.data : _context2.t0);

            this.previousMeetingData = null;
          }
        },
        async clientDetails(id)
        {
            const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}clientDetails/${id}/`, {
              headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
              this.client = response.data;
              console.log(response.data);
            })
            .catch(error => {
              console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        async updateWeeklydata()
        {
            const formData = new FormData();

            formData.append('height', this.clientData.height);
            formData.append('weight', this.clientData.weight);
            formData.append('bmi', this.clientData.bmi);
            formData.append('notes', this.clientData.notes);
            formData.append('meeting_id', this.meeting_id);

            const token = localStorage.getItem('token');
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}updateWeeklydata`, formData, {
              headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
              this.modal_1 = false;
              const id = this.$route.params.id;
              this.clientDetails(id);
              this.WeeklyMeetingList();
              this.resetForm();
              
            })
            .catch(error => {
              console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);
            });
        },
        redirect()
        {

        }
    },
    mounted()
    {
        this.WeeklyMeetingList();
        const id = this.$route.params.id;
        this.clientDetails(id);
    }

  }
</script>
<style>
    .table-icons
    {
        margin: 6px;
        font-size: 15px !important;
    }
    .header-sec
    {
        display: block ruby;
    }
    .create_btn
    {
        float: inline-end;
    }
    .table_button
    {
        font-size: 10px !important;
        padding: 9px !important;
    }
</style>
