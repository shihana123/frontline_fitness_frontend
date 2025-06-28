<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">New Client List</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>
       
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="clients">

            <el-table-column label="ID"
                             min-width="90px"
                             prop="client_id">
            </el-table-column>
            <el-table-column label="Name"
                             min-width="90px"
                             prop="name">
            </el-table-column>
           
            <el-table-column label="Email"
                             min-width="110px"
                             prop="email">
            </el-table-column>

            <el-table-column label="Phone"
                             min-width="80px"
                             prop="phone">
            </el-table-column>

            <el-table-column label="Program"
                             min-width="100px"
                             prop="programs[0].program.name">
            </el-table-column>

            <el-table-column label="Consulation Status"
                             min-width="140px"
                             prop="consulationstatus">
                <template #default="scope">
                    <div>
                        <span v-if="!scope.row.trainer_first_consultation" class="text-warning">
                            🏋️ Trainer Consultation Scheduling Pending
                        </span>
                        <span v-else class="text-success">
                            ✅ Trainer Consultation Scheduled
                        </span>
                    </div>

                    <div>
                        <span v-if="!scope.row.diet_first_consultation" class="text-warning">
                            🥗 Diet Consultation Scheduling Pending
                        </span>
                        <span v-else class="text-success">
                            ✅ Diet Consultation Scheduled
                        </span>
                    </div>
                </template>
            </el-table-column>
           
            <el-table-column label="Action"
                             prop="completion"
                             min-width="95px">
                <template #default="scope">

                    <!-- <b-button v-b-modal.modal-1 variant="primary">Launch demo modal</b-button> -->
                    <base-button v-b-modal.modal-1
                    v-if="scope.row.new_client && scope.row.trainer_first_consultation == 0"
                    type="primary"
                    size="small"
                    @click="handleNewClient(scope.row)" class="table_button">
                    Schedule
                    </base-button>


                    <base-button v-b-modal.modal-2
                    v-else-if="scope.row.new_client && scope.row.diet_first_consultation == 2"
                    type="warning"
                    size="small"
                    @click="handleNewClient(scope.row)" class="table_button">
                        Enter Data
                    </base-button>

                    <base-button
                    v-else-if="scope.row.new_client && scope.row.diet_first_consultation == 3"
                    type="success"
                    size="small"
                    class="table_button">
                        Completed
                    </base-button>
                </template>
            </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer>
    </b-card>
    <b-modal id="modal-1" title="Schedule First Consultation" hide-footer>
        <b-form @submit.prevent="schedule">
            <h6 class="heading-small text-muted mb-2">Schedule First Consulation</h6>
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
                <b-button type="submit" variant="primary">Schedule</b-button>
            </div>
        </b-form>
    </b-modal>

    <b-modal id="modal-2" title="Details of Client" hide-footer>
        <b-form @submit.prevent="enterClientDetails">
            <div v-show="dietary_div">
                <h6 class="heading-small text-muted mb-2">Dietary and Nutritional Assessment</h6>
                <div class="pl-lg-12">
                    <b-row >
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Diet Preference"
                            placeholder="Diet Preference"
                            v-model="clientdetails.diet_preferences"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Current Eating Pattern"
                            placeholder="Current Eating Pattern"
                            v-model="clientdetails.current_eating_pattern"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Appetite Level"
                            placeholder="Appetite Level"
                            v-model="clientdetails.appetite_level"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="No.of Meals per Day"
                            placeholder="No.of Meals per Day"
                            v-model="clientdetails.no_of_meals_per_day"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Cooking at Home/Eat Out"
                            placeholder="Cooking at Home/Eat Out"
                            v-model="clientdetails.cook_at_home_out"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Food Allergies and Intolerance"
                            placeholder="Food Allergies and Intolerance"
                            v-model="clientdetails.food_allergies"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Specific Diets Tried Before"
                            placeholder="Specific Diets Tried Before"
                            v-model="clientdetails.diet_before"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Snacking Habits"
                            placeholder="Snacking Habits"
                            v-model="clientdetails.snacking_habits"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Nutrient Deficiencies"
                            placeholder="Nutrient Deficiencies"
                            v-model="clientdetails.nutrient_deficiencies"
                            >
                            </base-input>
                        </b-col>

                    </b-row>
                </div>
                <!-- Custom buttons -->
                <div>
                    <b-button variant="secondary" @click="$bvModal.hide('modal-2')">Cancel</b-button>
                    <b-button @click="showlifestyle_div" variant="primary">Next</b-button>
                </div>
            </div>

            <div v-show="lifestyle_div">
                <h6 class="heading-small text-muted mb-2">Lifestyle Pattern</h6>
                <div class="pl-lg-12">
                    <b-row >
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Sleeping Duration"
                            placeholder="Sleeping Duration"
                            v-model="clientdetails.sleeping_duration"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Total Water Intake per Day"
                            placeholder="Total Water Intake per Day"
                            v-model="clientdetails.water_intake_per_day"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Working Schedule"
                            placeholder="Working Schedule"
                            v-model="clientdetails.working_schedule"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Sleep Quality"
                            placeholder="Sleep Quality"
                            v-model="clientdetails.sleep_quality"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Stress"
                            placeholder="Stress"
                            v-model="clientdetails.stress"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Hobbies"
                            placeholder="Hobbies"
                            v-model="clientdetails.hobbies"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Screen Time"
                            placeholder="Screen Time"
                            v-model="clientdetails.screen_time"
                            >
                            </base-input>
                        </b-col>
                    </b-row>
                </div>
                <div>
                    <b-button variant="secondary" @click="showdietary_div">Prev</b-button>
                    <b-button @click="showmedical_div" variant="primary">Next</b-button>
                </div>
            </div>

            <div v-show="medical_div">
                <h6 class="heading-small text-muted mb-2">Medical History</h6>
                <div class="pl-lg-12">
                    <b-row >
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Pre-existing conditions"
                            placeholder="Pre-existing conditions"
                            v-model="clientdetails.pre_existing_conditions"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Past Surgeries"
                            placeholder="Past Surgeries"
                            v-model="clientdetails.past_surgeries"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Medications"
                            placeholder="Medications"
                            v-model="clientdetails.medication"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Menstrual History"
                            placeholder="Menstrual History"
                            v-model="clientdetails.menstrual_history"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Pregnancy History"
                            placeholder="Pregnancy History"
                            v-model="clientdetails.pregnancy_history"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Breastfeeding"
                            placeholder="Breastfeeding"
                            v-model="clientdetails.breast_feeding"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Supplements"
                            placeholder="Supplements"
                            v-model="clientdetails.supplements"
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="12">
                            <base-input
                            type="text"
                            label="Medical Tests"
                            placeholder="Medical Tests"
                            v-model="clientdetails.medical_tests"
                            >
                            </base-input>
                        </b-col>
                    </b-row>
                </div>
                <div>
                    <b-button variant="secondary" @click="showlifestyle_div">Prev</b-button>
                    <b-button type="submit" variant="primary">Save</b-button>
                </div>
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
        clients: [],
        currentPage: 1,
        scheduledata:{
            scheduledate : '',
            type: 'dietitian',
            no_of_consultation: 1
        },
        clientdetails:{
            diet_preferences: '',
            current_eating_pattern: '',
            appetite_level: '',
            no_of_meals_per_day: '',
            cook_at_home_out: '',
            food_allergies: '',
            diet_before: '',
            snacking_habits: '',
            nutrient_deficiencies: '',
            sleeping_duration: '',
            water_intake_per_day: '',
            working_schedule: '',
            sleep_quality: '',
            stress: '',
            hobbies: '',
            screen_time: '',
            pre_existing_conditions: '',
            past_surgeries: '',
            medication: '',
            menstrual_history: '',
            pregnancy_history: '',
            breast_feeding: '',
            supplements: '',
            medical_tests: '',
            no_of_consultation: 1
        },
        selectedClientID: '',
        dietary_div: true,
        lifestyle_div: false,
        medical_div: false,
      };
    },
    methods:{
        showlifestyle_div()
        {
            this.dietary_div = false;
            this.medical_div = false;
            this.lifestyle_div = true;
        },
        showdietary_div()
        {
            this.dietary_div = true;
            this.medical_div = false;
            this.lifestyle_div = false;
        },
        showmedical_div()
        {
            this.dietary_div = false;
            this.medical_div = true;
            this.lifestyle_div = false;
        },
        async newclientList(){
            const token = localStorage.getItem('token');
            axios.get('http://127.0.0.1:8000/api/user/newclientListDietitian', {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                this.clients = response.data;
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
            formData.append('no_of_consultation', this.scheduledata.no_of_consultation);

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
        enterClientDetails()
        {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            
            formData.append('client', this.selectedClientID);
            formData.append('no_of_consultation', this.clientdetails.no_of_consultation);
            formData.append('diet_preferences', this.clientdetails.diet_preferences);
            formData.append('current_eating_pattern', this.clientdetails.current_eating_pattern);
            formData.append('appetite_level', this.clientdetails.appetite_level);
            formData.append('no_of_meals_per_day', this.clientdetails.no_of_meals_per_day);
            formData.append('cook_at_home_out', this.clientdetails.cook_at_home_out);
            formData.append('food_allergies', this.clientdetails.food_allergies);
            formData.append('diet_before', this.clientdetails.diet_before);
            formData.append('snacking_habits', this.clientdetails.snacking_habits);
            formData.append('nutrient_deficiencies', this.clientdetails.nutrient_deficiencies);
            formData.append('sleeping_duration', this.clientdetails.sleeping_duration);
            formData.append('water_intake_per_day', this.clientdetails.water_intake_per_day);
            formData.append('working_schedule', this.clientdetails.working_schedule);
            formData.append('sleep_quality', this.clientdetails.sleep_quality);
            formData.append('stress', this.clientdetails.stress);
            formData.append('hobbies', this.clientdetails.hobbies);
            formData.append('screen_time', this.clientdetails.screen_time);
            formData.append('pre_existing_conditions', this.clientdetails.pre_existing_conditions);
            formData.append('past_surgeries', this.clientdetails.past_surgeries);
            formData.append('medication', this.clientdetails.medication);
            formData.append('menstrual_history', this.clientdetails.menstrual_history);
            formData.append('pregnancy_history', this.clientdetails.pregnancy_history);
            formData.append('breast_feeding', this.clientdetails.breast_feeding);
            formData.append('supplements', this.clientdetails.supplements);
            formData.append('medical_tests', this.clientdetails.medical_tests);

            axios.post('http://127.0.0.1:8000/api/user/dietitianconsulation_details', formData,{
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
            console.log('data created successfully:', response.data);
            })
            .catch(error => {
            console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);

            });
        },
        handleNewClient(client)
        {
            this.selectedClientID = client.id;
            console.log(this.selectedClientID);
        }
    },
    mounted()
    {
        this.newclientList();
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
