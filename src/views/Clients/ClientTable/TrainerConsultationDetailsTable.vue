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
                    <span :style="{ color: scope.row.trainer_status ? 'green' : 'red' }">
                        {{ scope.row.trainer_status ? 'Completed' : 'Pending' }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="Action"
                             prop="completion"
                             min-width="115px">
                <template #default="scope">
                   
                    <!-- <b-button v-b-modal.modal-1 variant="primary">Launch demo modal</b-button> -->
                    <div v-if="current_date >= scope.row.meeting_date">
                        <base-button v-b-modal.modal-1
                        type="primary"
                        size="small"
                        @click="updateMeetingDetail(scope.row)" class="table_button" v-if="scope.row.trainer_status == false">
                        Update
                        </base-button>

                        <base-button v-b-modal.modal-2
                        type="warning"
                        size="small"
                        @click="viewMeetingDetail(scope.row)" class="table_button" v-else-if="scope.row.trainer_status == true">
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

                        <base-button v-b-modal.modal-2
                        type="warning"
                        size="small"
                        @click="viewMeetingDetail(scope.row)" class="table_button" v-else-if="scope.row.trainer_status == true">
                        View
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
            
            <h6 class="heading-small text-muted mb-2">Tests</h6>
            <div>
                <b-row>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Half Sit-Up"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.half_sit_up"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Modified Push ups"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.modified_push_ups"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Plank Hold"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.plank_hold"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Wall Squat Hold"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.wall_sqaut_hold"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Shoulder Flexibility(0-5 Scale)"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.shoulder_flexibility"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Sit and Reach(0-5 Scale)"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.sit_and_reach"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Hamstring Flexibility(0-5 Scale)"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.hamstring_flexibility"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Quadriceps Flexibility(0-5 Scale)"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.quadriceps_flexibility"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                </b-row>
            </div>

            <h6 class="heading-small text-muted mb-2">POSTURE ASSESSMENTS</h6>
            <div>
                <b-row>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Rounded Shoulder"
                        placeholder="Rounded Shoulder"
                        v-model="scheduledata.rounded_shoulder"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Kyphosis"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.kyphosis"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Lordosis"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.lordosis"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Scoliosis"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.scoliosis"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Bow Leg"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.bow_leg"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Knock Knees"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.knock_knees"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Winging of Scapula"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.winging_of_scapula"
                        required
                        >
                        </base-input>
                        
                    </b-col>
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Flat Foot"
                        placeholder="Time Held/Remarks/No.of Repetiotions"
                        v-model="scheduledata.flat_foot"
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
            <h6 class="heading-small text-muted mb-2">Tests</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Half Sit-Up : <span>{{ meetingDetails.half_sit_up }}</span></h5>
                        <h5>Modified Push ups : <span>{{ meetingDetails.modified_push_ups }}</span></h5>
                        <h5>Plank Hold : <span>{{ meetingDetails.plank_hold }}</span></h5>
                        <h5>Wall Squat Hold : <span>{{ meetingDetails.wall_sqaut_hold }}</span></h5>
                        <h5>Shoulder Flexibility(0-5 Scale) : <span>{{ meetingDetails.shoulder_flexibility }}</span></h5>
                        <h5>Sit and Reach(0-5 Scale) : <span>{{ meetingDetails.sit_and_reach }}</span></h5>
                        <h5>Hamstring Flexibility(0-5 Scale) : <span>{{ meetingDetails.hamstring_flexibility }}</span></h5>
                        <h5>Quadriceps Flexibility(0-5 Scale) : <span>{{ meetingDetails.quadriceps_flexibility }}</span></h5>
                        
                    </b-col>
                </b-row>
            </div>
        </div>
        <div class="pl-lg-6">
            <h6 class="heading-small text-muted mb-2">POSTURE ASSESSMENTS</h6>
            <div class="pl-lg-12">
                <b-row>
                    <b-col lg="12">
                        <h5>Rounded Shoulder : <span>{{ meetingDetails.rounded_shoulder }}</span></h5>
                        <h5>Kyphosis : <span>{{ meetingDetails.kyphosis }}</span></h5>
                        <h5>Lordosis : <span>{{ meetingDetails.lordosis }}</span></h5>
                        <h5>Scoliosis : <span>{{ meetingDetails.scoliosis }}</span></h5>
                        <h5>Bow Leg : <span>{{ meetingDetails.bow_leg }}</span></h5>
                        <h5>Knock Knees : <span>{{ meetingDetails.knock_knees }}</span></h5>
                        <h5>Winging of Scapula : <span>{{ meetingDetails.winging_of_scapula }}</span></h5>
                        <h5>Flat Foot : <span>{{ meetingDetails.flat_foot }}</span></h5>
                        <h5>Notes : <span>{{ meetingDetails.notes }}</span></h5>
                    </b-col>
                </b-row>
            </div>
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
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const yyyy = today.getFullYear();
      return {
        current_date: `${yyyy}-${mm}-${dd}`,
        modal_1: false,
        modal_2: false,
        showDietChart: false,
        consulat_schedule: false,
        consult_data: true,
        consultations: [],
        currentPage: 1,
        no_of_consultation: '',
        meeting_id: null,
        scheduledata:{
            half_sit_up : '',
            modified_push_ups : '',
            plank_hold : '',
            wall_sqaut_hold : '',
            shoulder_flexibility : '',
            sit_and_reach : '',
            hamstring_flexibility : '',
            quadriceps_flexibility : '',
            rounded_shoulder : '',
            kyphosis : '',
            lordosis : '',
            scoliosis : '',
            bow_leg : '',
            knock_knees : '',
            winging_of_scapula : '',
            flat_foot : '',
            notes: ''
        },
        selectedClientID: '',
        completed_consultation: 0,
        client: [],
        meetingDetails: [],
        clientId: this.$route.params.id
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
        
        async consultationDetails(){
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}trainerclientMeetingList/${this.$route.params.id}`, {
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

            formData.append('half_sit_up', this.scheduledata.half_sit_up);
            formData.append('modified_push_ups', this.scheduledata.modified_push_ups);
            formData.append('plank_hold', this.scheduledata.plank_hold);
            formData.append('wall_sqaut_hold', this.scheduledata.wall_sqaut_hold);
            formData.append('shoulder_flexibility', this.scheduledata.shoulder_flexibility);
            formData.append('sit_and_reach', this.scheduledata.sit_and_reach);
            formData.append('hamstring_flexibility', this.scheduledata.hamstring_flexibility);
            formData.append('quadriceps_flexibility', this.scheduledata.quadriceps_flexibility);
            formData.append('rounded_shoulder', this.scheduledata.rounded_shoulder);
            formData.append('kyphosis', this.scheduledata.kyphosis);
            formData.append('lordosis', this.scheduledata.lordosis);
            formData.append('scoliosis', this.scheduledata.scoliosis);
            formData.append('bow_leg', this.scheduledata.bow_leg);
            formData.append('knock_knees', this.scheduledata.knock_knees);
            formData.append('winging_of_scapula', this.scheduledata.winging_of_scapula);
            formData.append('flat_foot', this.scheduledata.flat_foot);
            formData.append('notes', this.scheduledata.notes);
            formData.append('meeting_id', this.meeting_id);
            
            axios.post(`${process.env.VUE_APP_API_BASE_URL}trainerMeetingUpdations`, formData,{
                headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' }
            })
            .then(response => {
                console.log('Consultation scheduled successfully:', response.data);
                this.modal_1 = false;
                this.consultationDetails();
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
            half_sit_up : '',
            modified_push_ups : '',
            plank_hold : '',
            wall_sqaut_hold : '',
            shoulder_flexibility : '',
            sit_and_reach : '',
            hamstring_flexibility : '',
            quadriceps_flexibility : '',
            rounded_shoulder : '',
            kyphosis : '',
            lordosis : '',
            scoliosis : '',
            bow_leg : '',
            knock_knees : '',
            winging_of_scapula : '',
            flat_foot : '',
            notes: ''
            };
        },
        
        updateMeetingDetail(client)
        {
            console.log(client.id);
            this.meeting_id = client.id;
            const token = localStorage.getItem('token');
            axios.get(`${process.env.VUE_APP_API_BASE_URL}prevMeetingDetails/${this.meeting_id}`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.scheduledata.half_sit_up = response.data.trainer_meeting_details[0].half_sit_up;
                    this.scheduledata.modified_push_ups = response.data.trainer_meeting_details[0].modified_push_ups;
                    this.scheduledata.plank_hold = response.data.trainer_meeting_details[0].plank_hold;
                    this.scheduledata.wall_sqaut_hold = response.data.trainer_meeting_details[0].wall_sqaut_hold;
                    this.scheduledata.shoulder_flexibility = response.data.trainer_meeting_details[0].shoulder_flexibility;
                    this.scheduledata.sit_and_reach = response.data.trainer_meeting_details[0].sit_and_reach;
                    this.scheduledata.hamstring_flexibility = response.data.trainer_meeting_details[0].hamstring_flexibility;
                    this.scheduledata.quadriceps_flexibility = response.data.trainer_meeting_details[0].quadriceps_flexibility;
                    this.scheduledata.rounded_shoulder = response.data.trainer_meeting_details[0].rounded_shoulder;
                    this.scheduledata.kyphosis = response.data.trainer_meeting_details[0].kyphosis;
                    this.scheduledata.lordosis = response.data.trainer_meeting_details[0].lordosis;
                    this.scheduledata.scoliosis = response.data.trainer_meeting_details[0].scoliosis;
                    this.scheduledata.bow_leg = response.data.trainer_meeting_details[0].bow_leg;
                    this.scheduledata.knock_knees = response.data.trainer_meeting_details[0].knock_knees;
                    this.scheduledata.winging_of_scapula = response.data.trainer_meeting_details[0].winging_of_scapula;
                    this.scheduledata.flat_foot = response.data.trainer_meeting_details[0].flat_foot;
                    this.scheduledata.notes = response.data.trainer_meeting_details[0].notes;

                    this.modal_1 = true;
                    
                })
                .catch(error => {
                    console.error('Error', error.response && error.response.data ? error.response.data : error);

                });
            this.modal_1 = true;
        },
        viewMeetingDetail(client)
        {
            this.meeting_id = client.id;
            this.viewMeetingDetails(this.meeting_id)
            this.modal_2 = true;
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
                    this.meetingDetails = response.data.trainer_details;
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
