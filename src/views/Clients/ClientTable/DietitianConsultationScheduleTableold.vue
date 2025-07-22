<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">First Consulation Schedule List</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>
       
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="consultations">
            <el-table-column label="Name"
                             min-width="90px"
                             prop="client.name">
            </el-table-column>
           
            <!-- <el-table-column label="Email"
                             min-width="110px"
                             prop="email">
            </el-table-column> -->

            <el-table-column label="Phone"
                             min-width="80px"
                             prop="client.phone">
            </el-table-column>

            <el-table-column label="Program"
                             min-width="100px"
                             prop="client.programs[0].program.name">
            </el-table-column>

            <!-- <el-table-column label="Completed Consultation"
                             min-width="100px"
                             prop="completed_consultations">
            </el-table-column> -->

            <el-table-column label="Consultation Date"
                             min-width="100px"
                             prop="last_consultation_datetime">
            </el-table-column>

            <el-table-column label="Action"
                             prop="completion"
                             min-width="95px">
                <template #default="scope">

                    <!-- <b-button v-b-modal.modal-1 variant="primary">Launch demo modal</b-button> -->
                    <base-button v-b-modal.modal-1
                    type="primary"
                    size="small"
                    @click="handleNewClient(scope.row)" class="table_button">
                    Update
                    </base-button>

                </template>
            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
    <b-modal id="modal-1" title="Schedule Next Consultation" hide-footer v-if="modal_1">
        <b-form @submit.prevent="schedule">
            <h6 class="heading-small text-muted mb-2">Schedule Next Consulation</h6>
            <div class="pl-lg-12" v-if="consult_data">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Height (cm)"
                        placeholder="Height (cm)"
                        v-model="scheduledata.height"
                        requied
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Weight (kg)"
                        placeholder="Weight (kg)"
                        v-model="scheduledata.weight"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="BMI"
                        placeholder="BMI"
                        v-model="scheduledata.bmi"
                        disabled
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="scheduledata.notes" required></textarea>
                        </base-input>
                        
                    </b-col>
                    <div>
                        <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                        <b-button type="button" @click="showSchedule"  variant="primary">Next</b-button>
                    </div> 
                </b-row>
            </div>
            <div class="pl-lg-12" v-if="consulat_schedule">
                
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="datetime-local"
                        label="Schedule Date & Time"
                        placeholder="Schedule Date & Time"
                        v-model="scheduledata.scheduledate"
                        >
                        </base-input>
                        
                    </b-col>
                    <div>
                        <b-button variant="secondary" @click="showConsultData()">Back</b-button>
                        <b-button type="submit" variant="primary">Done & Schedule Next</b-button>
                    </div>
                </b-row>
            </div>
            
        </b-form>
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
        consulat_schedule: false,
        consult_data: true,
        consultations: [],
        currentPage: 1,
        no_of_consultation: '',
        scheduledata:{
            scheduledate : '',
            type: 'dietitian',
            no_of_consultation: '',
            height: '',
            weight: '',
            bmi: 0,
            notes: ''

        },
        selectedClientID: '',
        completed_consultation: 0
      };
    },
    watch: {
    'scheduledata.height': 'calculateBMI',
    'scheduledata.weight': 'calculateBMI'
    },
    methods:{
        showSchedule()
        {
            this.consulat_schedule = true;
            this.consult_data = false;
        },
        showConsultData()
        {
            this.consulat_schedule = false;
            this.consult_data = true;
        },
        calculateBMI() {
            const height = parseFloat(this.scheduledata.height);
            const weight = parseFloat(this.scheduledata.weight);

            if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            this.scheduledata.bmi = bmi.toFixed(2); // Rounded to 2 decimal places
            } else {
            this.scheduledata.bmi = '';
            }
        },
        async consultationList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}dietconsulationscheduleList`, {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.consultations = response.data;
                console.log(response.data);
                
                // console.log('programs fetched successfully:', response.data);
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        schedule()
        {
            
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('datetime', this.scheduledata.scheduledate);
            formData.append('client', this.selectedClientID);
            formData.append('type', this.scheduledata.type);
            formData.append('no_of_consultation', this.no_of_consultation);
            formData.append('height', this.scheduledata.height);
            formData.append('weight', this.scheduledata.weight);
            formData.append('bmi', this.scheduledata.bmi);
            formData.append('notes', this.scheduledata.notes);
            
            axios.post(`${process.env.VUE_APP_API_BASE_URL}scheduleconsulation`, formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                console.log('Consultation scheduled successfully:', response.data);
                this.modal_1 = false;
                this.consultationList();
                this.resetForm();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        },
        resetForm() {
            this.scheduledata = {
            client: null,
            height: '',
            weight: '',
            bmi: '',
            no_of_consultation: '',
            datetime: '',
            type: '',
            notes: ''
            };
        },
        
        handleNewClient(client)
        {
            this.selectedClientID = client.client.id;
            this.no_of_consultation = client.no_of_consultation + 1;
            this.completed_consultation = client.completed_consultations;
            console.log(this.selectedClientID);
            this.modal_1 = true;
        }
    },
    mounted()
    {
        this.consultationList();
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
