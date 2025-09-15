<template>
    <div>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Consulation Details - {{ client[0].name }}</h3>
            <!-- <b-button  variant="success" class="create_btn" @click="redirect()">Create Program</b-button> -->
        </b-card-header>
        <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="consultations">
            <el-table-column label="Consultation" min-width="155px">
                <template v-slot="scope">
                    Meeting - Day {{ scope.row.day_no }}
                </template>
            </el-table-column>

            <el-table-column label="Date" min-width="120px">
                <template v-slot="scope">
                    {{ scope.row.meeting_date }}
                </template>
            </el-table-column>

            <el-table-column label="Type" min-width="80px">
                <template v-slot="scope">
                    {{ scope.row.meeting_type }}
                </template>
            </el-table-column>

            <el-table-column label="Status" min-width="130px">
                <template v-slot="scope">
                    <span :style="{ color: scope.row.status ? 'green' : 'red' }" v-if="scope.row.need_meeting == 1">
                        {{ scope.row.status ? 'Completed' : 'Pending' }}
                    </span>
                    <span :style="{ color: 'red' }" v-if="scope.row.need_meeting == 0">
                       Canceled
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="Action"
                             prop="completion"
                             min-width="115px">
                <template #default="scope">
                    
                    <!-- <b-button v-b-modal.modal-1 variant="primary">Launch demo modal</b-button> -->
                    <div v-if="current_date >= scope.row.meeting_date">
                        <base-button v-b-modal.modal-2
                        type="primary"
                        size="small"
                        @click="viewConsultDetails(scope.row)" class="table_button" v-if="scope.row.meeting_type == 'day_1'">
                        View
                        </base-button>

                        <base-button v-b-modal.modal-1
                        type="warning"
                        size="small"
                        @click="updateDay3Modal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'dietchart'  && scope.row.status == false">
                        Update
                        </base-button>

                        <base-button v-b-modal.modal-3
                        type="primary"
                        size="small"
                        @click="viewDay3Modal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'dietchart'  && scope.row.status == true">
                        View
                        </base-button>

                        <!-- <base-button v-b-modal.modal-3
                        type="primary"
                        size="small"
                        @click="viewDay3Modal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'dietition_only'  && scope.row.need_meeting == 0" disabled>
                        Meeting Canceled 
                        </base-button> -->
                        
                        <base-button v-b-modal.modal-4
                        type="warning"
                        size="small"
                        @click="updateDay10Modal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'dietition_only'  && scope.row.status == false">
                        Update
                        </base-button>

                        <base-button v-b-modal.modal-5
                        type="primary"
                        size="small"
                        @click="viewMeetingModal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'dietition_only'  && scope.row.status == true">
                        View
                        </base-button>

                        <base-button v-b-modal.modal-6
                        type="warning"
                        size="small"
                        @click="viewTDCModal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'TDC'  && scope.row.status == false && scope.row.measurements == false">
                        Update
                        </base-button>

                        <base-button v-b-modal.modal-1
                        type="warning"
                        size="small"
                        @click="updateDay3Modal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'TDC'  && scope.row.status == false && scope.row.measurements == true">
                        Update
                        </base-button>

                        <base-button v-b-modal.modal-
                        type="warning"
                        size="small"
                        @click="viewTDCModal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'Renewal'  && scope.row.status == false">
                        Update
                        </base-button>  

                        <base-button v-b-modal.modal-5
                        type="primary"
                        size="small"
                        @click="viewMeetingModal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'TDC'  && scope.row.status == true">
                        View
                        </base-button> 

                        <base-button v-b-modal.modal-5
                        type="primary"
                        size="small"
                        @click="viewMeetingModal(scope.row)" class="table_button" v-else-if="scope.row.meeting_type == 'Renewal'  && scope.row.status == true">
                        View
                        </base-button> 
                    </div>
                    <div v-else>
                        <base-button v-b-modal.modal-1
                        type="danger"
                        size="small"
                        @click="updateMeetingDetail(scope.row)" class="table_button" v-if="scope.row.trainer_status == false" disabled>
                        Upcoming
                        </base-button>
                    </div>
                    

                </template>
            </el-table-column>
        </el-table>

        <!-- <b-card-footer class="py-4 d-flex justify-content-end">
            <base-pagination v-model="currentPage" :per-page="10" :total="50"></base-pagination>
        </b-card-footer> -->
    </b-card>
    <b-modal id="modal-1" title="Client Details" hide-footer v-if="modal_1">
        <b-form @submit.prevent="dataUpload">
            <h6 class="heading-small text-muted mb-2">Upload Diet Plan</h6>
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="file"
                        label="Diet Plan"
                        placeholder="Diet Plan"
                        v-model="scheduledata.diet_plan"
                        requied
                        @change="handleFileUpload($event, 'diet_chart')"
                        >
                        </base-input>
                        
                    </b-col>
                </b-row>
            </div>
            <h6 class="heading-small text-muted mb-2">Measurement Details</h6>
            <div>
                <b-row>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Chest (cm)"
                        placeholder="Chest (cm)"
                        v-model="scheduledata.chest"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Right Arm (cm)"
                        placeholder="Right Arm (cm)"
                        v-model="scheduledata.right_arm"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Left Arm (cm)"
                        placeholder="Left Arm (cm)"
                        v-model="scheduledata.left_arm"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Waist (cm)"
                        placeholder="Waist (cm)"
                        v-model="scheduledata.waist"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Hip (cm)"
                        placeholder="Hip (cm)"
                        v-model="scheduledata.hip"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Right Thigh (cm)"
                        placeholder="Right Thigh (cm)"
                        v-model="scheduledata.right_thigh"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Left Thigh (cm)"
                        placeholder="Left Thigh (cm)"
                        v-model="scheduledata.left_thigh"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Right Calf (cm)"
                        placeholder="Right Calf (cm)"
                        v-model="scheduledata.right_calf"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Left Calf (cm)"
                        placeholder="Left Calf (cm)"
                        v-model="scheduledata.left_calf"
                        required
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
                        <b-button type="submit" variant="primary">Save</b-button>
                    </div> 
                </b-row>
            </div>
            
        </b-form>
    </b-modal>
    <b-modal size="lg" id="modal-2" title="Details of Client" hide-footer v-if="modal_2">
        <div class="pl-lg-6">
            <h6 class="heading-small text-muted mb-2">Dietary and Nutritional Assessment</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Diet Preferrence : <span>{{ diet_preferences }}</span></h5>
                        <h5>Current Eating Pattern : <span>{{ current_eating_pattern }}</span></h5>
                        <h5>Appetite Level : <span>{{ appetite_level }}</span></h5>
                        <h5>No.of Meals per Day : <span>{{ no_of_meals_per_day }}</span></h5>
                        <h5>Cooking at Home/Eat Out : <span>{{ cook_at_home_out }}</span></h5>
                        <h5>Food Allergies and Intolerance : <span>{{ food_allergies }}</span></h5>
                        <h5>Specific Diets Tried Before : <span>{{ diet_before }}</span></h5>
                        <h5>Snacking Habits : <span>{{ snacking_habits }}</span></h5>
                        <h5>Nutrient Deficiencies : <span>{{ nutrient_deficiencies }}</span></h5>
                        
                    </b-col>
                </b-row>
            </div>
        </div>
        <div class="pl-lg-6">
            <h6 class="heading-small text-muted mb-2">Lifestyle Pattern</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Sleeping Duration : <span>{{ sleeping_duration }}</span></h5>
                        <h5>Total Water Intake per Day : <span>{{ water_intake_per_day }}</span></h5>
                        <h5>Working Schedule : <span>{{ working_schedule }}</span></h5>
                        <h5>Sleep Quality : <span>{{ sleep_quality }}</span></h5>
                        <h5>Stress : <span>{{ stress }}</span></h5>
                        <h5>Hobbies : <span>{{ hobbies }}</span></h5>
                        <h5>Screen Time : <span>{{ screen_time }}</span></h5>
                    </b-col>
                </b-row>
            </div>
        </div>

        <div class="pl-lg-6">
            <h6 class="heading-small text-muted mb-2">Medical History</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Pre-existing conditions : <span>{{ pre_existing_conditions }}</span></h5>
                        <h5>Past Surgeries : <span>{{ past_surgeries }}</span></h5>
                        <h5>Medications : <span>{{ medication }}</span></h5>
                        <h5>Menstrual History : <span>{{ menstrual_history }}</span></h5>
                        <h5>Pregnancy History : <span>{{ pregnancy_history }}</span></h5>
                        <h5>Breastfeeding : <span>{{ breast_feeding }}</span></h5>
                        <h5>Supplements : <span>{{ supplements }}</span></h5>
                        <h5>Medical Tests : <span>{{ medical_tests }}</span></h5>
                    </b-col>
                </b-row>
            </div>
        </div>

        <!-- <div class="pl-lg-6" >
            <h6 class="heading-small text-muted mb-2">Details</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Height : <span>{{ height }} cm</span></h5>
                        <h5>Weight : <span>{{ weight }} kg</span></h5>
                        <h5>BMI : <span>{{ bmi }}</span></h5>
                        <h5>Notes : <span>{{ notes }}</span></h5>
                    </b-col>
                </b-row>
            </div>
        </div> -->
        
    </b-modal>
    <b-modal size="lg" id="modal-3" title="Details of Client" hide-footer v-if="modal_3">
        <div class="pl-lg-6">
            <h6 class="heading-small text-muted mb-2">Measurements</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Chest : <span>{{ meetingDetails.measurements.chest }} cm</span></h5>
                        <h5>Right Arm : <span>{{ meetingDetails.measurements.right_arm }} cm</span></h5>
                        <h5>Left Arm : <span>{{ meetingDetails.measurements.left_arm }} cm</span></h5>
                        <h5>Waist : <span>{{ meetingDetails.measurements.waist }} cm</span></h5>
                        <h5>Hip : <span>{{ meetingDetails.measurements.hip }} cm</span></h5>
                        <h5>Right Thigh : <span>{{ meetingDetails.measurements.right_thigh }} cm</span></h5>
                        <h5>Left Thigh : <span>{{ meetingDetails.measurements.left_thigh }} cm</span></h5>
                        <h5>Right Calf : <span>{{ meetingDetails.measurements.right_calf }} cm</span></h5>
                        <h5>Left Calf : <span>{{ meetingDetails.measurements.left_calf }} cm</span></h5>
                    </b-col>
                </b-row>
            </div>
        </div>
        <div class="pl-lg-6">
            <h6 class="heading-small text-muted mb-2">Diet Plan</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Diet Chart : <span><base-button size="small" class="table_button">view dietchart</base-button></span></h5>
                        <h5>Notes : <span>{{ meetingDetails.diet_details.notes }}</span></h5>
                        
                    </b-col>
                </b-row>
            </div>
        </div>
    </b-modal>
    <b-modal id="modal-4" title="Client Details" hide-footer v-if="modal_4">
        <b-form @submit.prevent="dietdataUpload">
            <h6 class="heading-small text-muted mb-2">Upload Diet Plan</h6>
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="file"
                        label="Diet Plan"
                        placeholder="Diet Plan"
                        v-model="scheduledata.diet_plan"
                        requied
                        @change="handleFileUpload($event, 'diet_plan')"
                        >
                        </base-input>
                        
                    </b-col>
                </b-row>
            </div>
            <div>
                <b-row>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="scheduledata.notes" required></textarea>
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
    <b-modal size="md" id="modal-5" title="Diet Plan Changes" hide-footer v-if="modal_5">

        <div class="pl-lg-6">
            <!-- <h6 class="heading-small text-muted mb-2">Diet Plan</h6> -->
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5 v-if="meetingDetails.change_dietplan == true">Diet Chart : <span><base-button size="small" class="table_button">view dietchart</base-button></span></h5>
                        <h5>Notes : <span>{{ meetingDetails.notes }}</span></h5>
                        <h5>Updated at : <span>{{ meetingDetails.diet_plan_uploaded_at }}</span></h5>
                        
                    </b-col>
                </b-row>
            </div>
        </div>
    </b-modal>
    <b-modal id="modal-6" title="Client Details" hide-footer v-if="modal_6">
        <b-form @submit.prevent="TDCdataUpload">
            <h6 class="heading-small text-muted mb-2">Upload Diet Plan</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <b-form-checkbox
                            id="checkbox-1"
                            v-model="showDietChart"
                            name="checkbox-1"
                            :value="true"
                            :unchecked-value="false"
                            >
                            Change in DietChart
                        </b-form-checkbox>
                    </b-col>
                    <b-col lg="12">
                        <base-input label="Notes">
                            <textarea class="form-control" id="notes" rows="3" col="5" v-model="scheduledata.notes" required></textarea>
                        </base-input>
                        
                    </b-col>
                    <br>
                    <b-col lg="12" v-if="showDietChart">
                        <base-input
                        type="file"
                        label="Diet Plan"
                        placeholder="Diet Plan"
                        v-model="scheduledata.diet_plan"
                        @change="handleFileUpload($event, 'diet_chart')"
                        >
                        </base-input>
                        
                    </b-col>
                </b-row>
                <div>
                        <b-button variant="secondary" @click="$bvModal.hide('modal-6')">Cancel</b-button>
                        <b-button type="submit" variant="primary">Save</b-button>
                    </div> 
            </div>
          
        </b-form>
    </b-modal>
    <b-modal id="modal-3-old" title="Schedule Next Consultation" hide-footer v-if="modal_1">
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
    watch: {
        showDietChart(val) {
            if (!val) {
            this.scheduledata.diet_plan = null;
            }
        }
    },
    data() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const yyyy = today.getFullYear();
      return {
        current_date: `${yyyy}-${mm}-${dd}`,
        modal_1: false,
        modal_2: false,
        modal_3: false,
        modal_4: false,
        modal_5: false,
        modal_6: false,
        showDietChart: false,
        consulat_schedule: false,
        consult_data: true,
        consultations: [],
        currentPage: 1,
        no_of_consultation: '',
        meeting_id: null,
        scheduledata:{
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
        selectedClientID: '',
        completed_consultation: 0,
        client: [],
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
        height: '',
        weight: '',
        bmi: '',
        notes: '',
        meetingDetails: [],
        clientId: this.$route.params.id
      };
    },
    watch: {
    'scheduledata.height': 'calculateBMI',
    'scheduledata.weight': 'calculateBMI'
    },
    methods:{
        handleFileUpload(event, field) {
            this.scheduledata[field] = event.target.files[0];
        },
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
        async consultationDetails(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}dietclientMeetingList/${this.$route.params.id}`, {
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
        dataUpload()
        {
            
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('chest', this.scheduledata.chest);
            formData.append('right_arm', this.scheduledata.right_arm);
            formData.append('left_arm', this.scheduledata.left_arm);
            formData.append('waist', this.scheduledata.waist);
            formData.append('hip', this.scheduledata.hip);
            formData.append('left_thigh', this.scheduledata.left_thigh);
            formData.append('right_thigh', this.scheduledata.right_thigh);
            formData.append('right_calf', this.scheduledata.right_calf);
            formData.append('left_calf', this.scheduledata.left_calf);
            formData.append('meeting_id', this.meeting_id);
            if (this.scheduledata.diet_chart) {
                formData.append('diet_chart', this.scheduledata.diet_chart);
            }
            
            axios.post(`${process.env.VUE_APP_API_BASE_URL}dietMeetingUpdations`, formData,{
                headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log('Consultation scheduled successfully:', response.data);
                this.modal_1 = false;
                this.clientDetails(clientId);
                this.resetForm();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        },
        dietdataUpload()
        {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('meeting_id', this.meeting_id);
            formData.append('notes', this.scheduledata.notes);
            if (this.scheduledata.diet_chart) {
                formData.append('diet_chart', this.scheduledata.diet_chart);
            }
            
            axios.post(`${process.env.VUE_APP_API_BASE_URL}dietOnlyMeetingUpdations`, formData,{
                headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log('Consultation scheduled successfully:', response.data);
                this.modal_4 = false;
                this.clientDetails(clientId);
                this.resetForm();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        },
        TDCdataUpload()
        {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('meeting_id', this.meeting_id);
            formData.append('notes', this.scheduledata.notes);
            formData.append('showDietChart', this.showDietChart);
            if (this.scheduledata.diet_chart) {
                formData.append('diet_chart', this.scheduledata.diet_chart);
            }
            
            axios.post(`${process.env.VUE_APP_API_BASE_URL}TDCMeetingUpdations`, formData,{
                headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log('Consultation scheduled successfully:', response.data);
                this.modal_6 = false;
                this.clientDetails(clientId);
                this.resetForm();
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
        },
        formatDate(datetime) {
            if (!datetime) return '';
            const date = new Date(datetime);
            return new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC'
            }).format(date);
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
            console.log(client);
            
            this.selectedClientID = this.$route.params.id;
            this.no_of_consultation = client.no_of_consultation + 1;
            this.completed_consultation = client.completed_consultations;
            console.log(this.selectedClientID);
            this.modal_1 = true;
        },
        updateDay3Modal(client)
        {
            console.log(client.id);
            this.meeting_id = client.id;
            this.modal_1 = true;
        },
        viewDay3Modal(client)
        {
            this.meeting_id = client.id;
            this.viewMeetingDetails(this.meeting_id)
            this.modal_3 = true;
        },
        updateDay10Modal(client)
        {
            this.meeting_id = client.id;
            this.modal_4 = true;
        },
        viewMeetingModal(client)
        {
            this.meeting_id = client.id;
            this.viewMeetingView(this.meeting_id)
            this.modal_5 = true;
        },
        viewTDCModal(client)
        {
            this.meeting_id = client.id;
            this.modal_6 = true;
        },
        viewMeetingView(meetingID)
        {
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}fetchMeetingDetails/${meetingID}`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.meetingDetails = response.data.meeting_details[0];
                    // console.log(this.meetingDetails);
                    
                })
                .catch(error => {
                    console.error('Error', error.response && error.response.data ? error.response.data : error);

                });
        },
        viewMeetingDetails(meetingID)
        {
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}getMeetingDetails/${meetingID}`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.meetingDetails = response.data;
                    console.log(this.meetingDetails);
                    
                })
                .catch(error => {
                    console.error('Error', error.response && error.response.data ? error.response.data : error);

                });
        },
        viewConsultDetails(client)
        {
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}dietfirstconsulationdetails/${this.$route.params.id}`,{
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                console.log(response);
                
                this.no_of_consultation = response.data.no_of_consultation;
                this.diet_preferences = response.data.diet_preferences;
                this.current_eating_pattern = response.data.current_eating_pattern;
                this.appetite_level = response.data.appetite_level;
                this.no_of_meals_per_day = response.data.no_of_meals_per_day;
                this.cook_at_home_out = response.data.cook_at_home_out;
                this.food_allergies = response.data.food_allergies;
                this.diet_before = response.data.diet_before;
                this.snacking_habits = response.data.snacking_habits;
                this.nutrient_deficiencies = response.data.nutrient_deficiencies;
                this.sleeping_duration = response.data.sleeping_duration;
                this.water_intake_per_day = response.data.water_intake_per_day;
                this.working_schedule = response.data.working_schedule;
                this.sleep_quality = response.data.sleep_quality;
                this.stress = response.data.stress;
                this.hobbies = response.data.hobbies;
                this.screen_time = response.data.screen_time;
                this.pre_existing_conditions = response.data.pre_existing_conditions;
                this.past_surgeries = response.data.past_surgeries
                this.medication = response.data.medication;
                this.menstrual_history = response.data.menstrual_history;
                this.pregnancy_history = response.data.pregnancy_history;
                this.breast_feeding = response.data.breast_feeding;
                this.supplements = response.data.supplements;
                this.medical_tests = response.data.medical_tests;
                this.modal_2 = true;
                // this.height = client.monthly_diet_consultation_details.height;
                // this.weight = client.monthly_diet_consultation_details.weight;
                // this.bmi = client.monthly_diet_consultation_details.bmi;
                // this.notes = client.monthly_diet_consultation_details.notes;
            })
            .catch(error => {
            console.error('Error:', error.response && error.response.data ? error.response.data : error);

            });
            this.modal_2 = true
            
        },
        async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}clientDetails/${id}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.client = response.data;
                    console.log(response.data);
                    
                    // console.log('programs fetched successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
    },
    mounted()
    {
        this.consultationDetails();
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
