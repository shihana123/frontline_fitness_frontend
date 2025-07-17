<template>
    <b-card no-body class="card-profile" alt="Image placeholder" img-top>
         <b-row class="justify-content-center">
            <b-col lg="7" class="order-lg-2">
                <b-card no-body class="lead_details">
                    <b-card-header class="border-0 header-sec">
                        <h5 class="mb-0">Lead Details</h5>
                    </b-card-header>
                    

                    <b-card-body class="pt-0">
                        <b-row>
                            <b-col lg="6" class="order-lg-2">
                                <h5>Name : <span class="font-weight-light"> {{ lead.name }} </span></h5>
                            </b-col>

                            <b-col lg="6" class="order-lg-2">
                                <h5> Source : <span class="font-weight-light"> {{ lead.source }} </span></h5>
                            </b-col>

                            
                        </b-row>
                        <b-row class="mt-4">
                            <b-col lg="6" class="order-lg-2">
                                <h5>Phone : <span class="font-weight-light"> {{ lead.phone }} </span></h5>
                            </b-col>
                            <b-col lg="6" class="order-lg-2">
                                <h5>Email : <span class="font-weight-light"> {{ lead.email }} </span></h5>
                            </b-col>
                            
                        </b-row>
                        <b-row class="mt-4">
                            <b-col lg="6" class="order-lg-2">
                                <h5>Program Type : <span class="font-weight-light"> {{ lead.program_type }} </span></h5>
                            </b-col>
                            <b-col lg="6" class="order-lg-2">
                                <h5>Program : <span class="font-weight-light"> {{ lead.program_details.name }} </span></h5>
                            </b-col>
                            
                        </b-row>

                        <b-row class="mt-4">
                            <b-col lg="6" class="order-lg-2">
                                <h5>Preferred Days : <span class="font-weight-light"> {{ formatPreferredDays(lead.preferred_days) }} </span></h5>
                            </b-col>
                            <b-col lg="6" class="order-lg-2">
                                <h5>Preferred Time : <span class="font-weight-light"> {{ formatPreferredTime(lead.preferred_time) }} </span></h5>
                            </b-col>
                        </b-row>
                        
                    </b-card-body>
                </b-card>
            </b-col>

            <b-col lg="5" class="order-lg-2">
                <card class="followup_details">
                    <b-card-header class="border-0">
                        <h5 class="mb-0">Followups</h5>
                    </b-card-header>
                    <!-- Card body -->
                    <b-row align-v="center" class="followup_card" v-for="follow_up in follow_ups">
                        
                        <b-col class="ml--2">
                            <p class="text-sm mt-2">Followup Date: {{ follow_up.follow_up_date }}</p>
                            <span class="text-success">Status:  </span>
                            <small v-if="follow_up.status">{{ lead.status }}</small>
                            <small v-else>-</small><br>
                            <span class="text-success">Notes:  </span>
                            <small v-if="follow_up.status">{{ follow_up.notes }}</small>
                            <small v-else>-</small>
                        </b-col>
                        <b-col md="auto">
                            <base-button v-if="!follow_up.status" type="primary" size="sm" v-b-modal.modal-1 @click="handleFollowup(follow_up.follow_up_date, follow_up.id)">Mark as Done</base-button>
                            <base-button v-else type="success" size="sm">Done</base-button>
                        </b-col>
                    
                    </b-row>
                </card>
            </b-col>

         </b-row>
         
        <b-modal id="modal-1" size="lg" title="Follow up Schedule" hide-footer v-if="showModal_followupdone" @close="showModal_followupdone = false">
            <b-form @submit.prevent="followupDone">
                <h6 class="heading-small text-muted mb-2">Follow Up Schedule</h6>
                <div class="pl-lg-12">
                    
                    <b-row >
                        <b-col lg="6">
                            <label class="form-control-label">Status</label>
                            <select class="form-control" v-model="lead_status" @change="statusChange">
                                <option v-for="stat in status" :value="stat">{{ stat }}</option>
                            </select>
                        </b-col>
                        <b-col lg="6">
                            <label class="form-control-label">Activity Type</label>
                            <select class="form-control" v-model="activity_type" :disabled="isStatusDisabled" required>
                                <option v-for="activity_type in activity_types" :value="activity_type">{{ activity_type }}</option>
                            </select>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col lg="6">
                            <base-input
                            type="date"
                            label="Followup Date"
                            v-model="scheduled_followupdate"
                            :disabled="isStatusDisabled"
                            required
                            >
                            </base-input>
                        </b-col>
                        <b-col lg="6">
                            <base-input label="Notes">
                                <textarea class="form-control" id="notes" rows="3" col="5" v-model="notes" required :disabled="isStatusDisabled"></textarea>
                            </base-input>
                        </b-col>
                    </b-row>
                </div>
                <!-- Custom buttons -->
                <div>
                    <b-button variant="secondary" @click="$bvModal.hide('modal-1')" size="sm">Cancel</b-button>
                    <b-button type="submit" variant="primary" size="sm">Done</b-button>
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
                showModal_followupdone: false,
                lead: [],
                follow_ups: [],
                followup_date: '',
                selectedFollowup: '',
                isStatusDisabled: false,
                status: ['New Lead', 'Interested', 'Not Interested', 'Follow-up scheduled', 'CLosed/Lost', 'Converted', 'pending Payment'],
                activity_types: ['Call', 'Email', 'Meeting', 'To-Do'],
                activity_type: 'Call',
                scheduled_followupdate: '',
                notes: '',
                lead_status: ''
            }
        },
        methods:{
            async leadDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}fetchLead/${id}`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.lead = response.data[0];
                    this.follow_ups = response.data[0].followups;
                    this.lead_status = response.data[0].status;
                    console.log(response.data[0].status);
                    
                    // console.log('programs fetched successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            handleFollowup(followup_date, id)
            {
                this.showModal_followupdone = true;
                this.followup_date = followup_date;
                this.selectedFollowup = id;
                // console.log(id);
                
            },
            formatPreferredDays(days) {
                if (!Array.isArray(days)) return '';
                return days
                .map(day => day.charAt(0).toUpperCase() + day.slice(1))
                .join(', ');
            },
            formatTimeTo12Hour(timeStr) {
                const [hour, minute] = timeStr.split(':');
                const h = parseInt(hour);
                const ampm = h >= 12 ? 'PM' : 'AM';
                const formattedHour = h % 12 === 0 ? 12 : h % 12;
                return `${formattedHour}:${minute} ${ampm}`;
            },

            formatPreferredTime(times) {
                if (!Array.isArray(times) || times.length === 0) return '';
                
                const timeRange = times[0]; // assuming first element is [start, end]
                if (!Array.isArray(timeRange) || timeRange.length !== 2) return '';
                
                const [start, end] = timeRange;
                return `${this.formatTimeTo12Hour(start)} to ${this.formatTimeTo12Hour(end)}`;
            },
            followupDone()
            {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('followup_id', this.selectedFollowup);
                formData.append('notes', this.notes);
                formData.append('lead_status', this.lead_status);
                formData.append('activity_type', this.activity_type);
                formData.append('followup_date', this.scheduled_followupdate);
                
                axios.post('${process.env.VUE_APP_API_BASE_URL}followupStatusUpdate', formData,{
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    this.showModal_followupdone = false;
                    const id = this.$route.params.id;
                    this.leadDetails(id);
                    console.log('Mark as done successfully:', response.data);
                })
                .catch(error => {
                console.error('Error:', error.response && error.response.data ? error.response.data : error);

                });
            },
            statusChange()
            {
                if(this.lead_status == 'Converted')
                {
                    this.isStatusDisabled = true;
                }
                else{
                    this.isStatusDisabled = false;
                }
                
            }
        },
       
        mounted(){
            const id = this.$route.params.id;
            this.leadDetails(id);
        }
    }
</script>
<style>
    .markas_done
    {
        cursor: pointer;
    }
    .followup_card
    {
        border-bottom: 1px solid #2dcebb;
    }
    .lead_details
    {
        /* border: 0px solid #2dce91 !important; */
        border-right: 1px solid #2dce91;
        padding: 22px;
        border-radius: 0px;
        
    }
    .followup_details
    {
        border: 0px solid #2dce91 !important;
    }
    
</style>