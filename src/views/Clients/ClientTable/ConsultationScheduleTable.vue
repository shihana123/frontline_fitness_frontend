<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Consulation Schedule List</h3>
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

            <el-table-column label="Completed Consultation"
                             min-width="100px"
                             prop="completed_consultations">
            </el-table-column>

            <el-table-column label="Next Consultation Date"
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
    <b-modal id="modal-1" title="Schedule Next Consultation" hide-footer>
        <b-form @submit.prevent="schedule">
            <h6 class="heading-small text-muted mb-2">Schedule Next Consulation</h6>
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="datetime-local"
                        label="Schedule Date & Time"
                        placeholder="Schedule Date & Timee"
                        v-model="scheduledata.scheduledate"
                        >
                        </base-input>
                        
                    </b-col>
                </b-row>
            </div>
            <!-- Custom buttons -->
            <div>
                <b-button variant="secondary" @click="$bvModal.hide('modal-1')">Cancel</b-button>
                <b-button type="submit" variant="primary">Done & Schedule Next</b-button>
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
        consultations: [],
        currentPage: 1,
        no_of_consultation: '',
        scheduledata:{
            scheduledate : '',
            type: 'trainer',
            no_of_consultation: ''
        },
        selectedClientID: ''
      };
    },
    methods:{
        async consultationList(){
            const token = localStorage.getItem('token');
            axios.get('http://127.0.0.1:8000/api/user/consulationscheduleList', {
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
            console.log(this.selectedClientID);
            
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('datetime', this.scheduledata.scheduledate);
            formData.append('client', this.selectedClientID);
            formData.append('type', this.scheduledata.type);
            formData.append('no_of_consultation', this.no_of_consultation);

            axios.post('http://127.0.0.1:8000/api/user/scheduleconsulation', formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
            console.log('Program created successfully:', response.data);
            })
            .catch(error => {
            console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);

            });
        },
        
        handleNewClient(client)
        {
            this.selectedClientID = client.client.id;
            this.no_of_consultation = client.no_of_consultation + 1;
            console.log(this.selectedClientID);
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
