<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Client List</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="clients">

            <el-table-column label="ID"
                             
                             prop="client_id">
            </el-table-column>
            <el-table-column label="Name"
                             
                             prop="name">
            </el-table-column>

            <el-table-column label="Phone"
                             
                             prop="phone">
            </el-table-column>

            <el-table-column label="Program Type"
                            
                             prop="programs[0].program_type">
            </el-table-column>

            <el-table-column label="Program"
                            
                             prop="programs[0].program.name">
            </el-table-column>

            <!-- <el-table-column label="Workout Start Date"
                             
                             prop="workout_start_date">
            </el-table-column> -->
           
            <el-table-column label="Diet Chart"
                             prop="completion"
                             > 
                <template #default="scope">
                    <div class="action_buttons">
                        <base-button
                        v-if="scope.row.dietchart.length == 0"
                        v-b-modal.modal-1
                        type="warning"
                        size="small"
                        class="table_button" @click="DietchartView(scope.row.id)">
                        Upload
                        </base-button>

                        <base-button
                        v-else
                        type="primary"
                        size="small"
                        class="table_button" @click="clientView(scope.row.dietchart)">
                        View
                        </base-button>
                       
                    </div>
                    
                </template>

            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
   
    <b-modal id="modal-1" title="Upload DietChart" hide-footer v-if="modal_1">
        <b-form @submit.prevent="uploadDietchart">
            <h6 class="heading-small text-muted mb-2">Upload DietChart</h6>
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="file"
                        label="Diet Chart"
                        placeholder="Diet Chart"
                        v-model="dietdata.diet_plan"
                        requied
                        @change="handleFileUpload"
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="dietdata.notes" required></textarea>
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
</div>
</template>

<script>
  import axios from 'axios'
  import projects from '../../Tables/projects'
  import { Table, TableColumn} from 'element-ui'
  import { useRouter } from 'vue-router';
  export default {
    name: 'light-table',
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        modal_1: false,
        clients: [],
        currentPage: 1,
        dietdata:{
            diet_plan : '',
            notes:''
        },
       
        selectedClientID: '',
      };
    },
    methods:{
        async clientList(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}vmcclientList`, {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.clients = response.data;
                console.log(this.clients);
                
            })
            .catch(error => {
                console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

            });
        },
        uploadDietchart()
        {
            
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('client_id', this.selectedClientID);
            formData.append('notes', this.dietdata.notes);
            if (this.dietdata.diet_plan) {
                formData.append('diet_plan', this.dietdata.diet_plan);
            }
            
            axios.post(`${process.env.VUE_APP_API_BASE_URL}vmcDietchartUpload`, formData,{
                headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                
                this.modal_1 = false;
                this.clientList();
                this.resetForm();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        },
        resetForm() {
            this.dietdata = {
                diet_plan: '',
                notes: '',
            };
        },
        handleFileUpload(event) {
            this.dietdata.diet_plan = event.target.files[0];
        },
        DietchartView(client)
        {
            this.selectedClientID = client;
            this.modal_1 = true;
            console.log(this.selectedClientID);
        },
        clientView(dietchart)
        {
            console.log(dietchart[0].diet_plan);
            const pdfUrl = 'http://127.0.0.1:8000' + dietchart[0].diet_plan;
            if (pdfUrl) {
            window.open(pdfUrl, '_blank');
            } else {
            this.$toast.error("No diet plan file found.");
            console.log("No diet plan file found.");
            
            }
            
        }
    },
    mounted()
    {
        this.clientList();
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
    .action_buttons
    {
        display: flex;
    }
</style>
