<template>
    <base-header class=" pb-8 pt-5 pt-md-8">
        <b-row>
            
            <!-- <b-col xl="12" md="12" v-for="upcoming_diet_reminder in upcoming_diet_reminders">
                <b-alert show variant="info">
                    <strong>Default!</strong> This is a default alert—check it out!
                </b-alert>
            </b-col>

            <b-col xl="12" md="12" v-for="upcoming_dietition_reminder in upcoming_dietition_reminders">
                <b-alert show variant="primary">
                    <strong>You have Meeting with {{ upcoming_dietition_reminder.client }} on {{ upcoming_dietition_reminder.meeting_date}}, Day 10</strong>
                    <h5 v-if="upcoming_dietition_reminder.need_meeting == 1">Do you want to conduct the meeting </h5>
                    <div v-if="upcoming_dietition_reminder.need_meeting == 1">
                        <base-button size="sm" @click="meetingUpdate('yes', upcoming_dietition_reminder.id)">yes</base-button>
                        <base-button size="sm" @click="meetingUpdate('no', upcoming_dietition_reminder.id)">no</base-button>
                    </div>
                     
                </b-alert>
            </b-col>

            <b-col xl="12" md="12" v-for="upcoming_tdc_reminder in upcoming_tdc_reminders">
                <b-alert show variant="warning">
                    <strong>Default!</strong> This is a default alert—check it out!
                </b-alert>
            </b-col>

            <b-col xl="12" md="12" v-for="upcoming_renewal_reminder in upcoming_renewal_reminders">
                <b-alert show variant="warning">
                    <strong>Default!</strong> This is a default alert—check it out!
                </b-alert>
            </b-col> -->

            <!-- <h2>Upcoming Meetings</h2>
            <div v-if="reminders.upcoming">
                <div
                    v-for="(meetings, type) in reminders.upcoming"
                    :key="type"
                    class="mb-3"
                >
                    <h4>{{ type }}</h4>
                    <div v-for="meeting in meetings" :key="meeting.id" :class="['card', getCardClass(type)]">
                    <div class="card-body">
                        <p><strong>Client:</strong> {{ meeting.client }}</p>
                        <p><strong>Date:</strong> {{ meeting.meeting_date }}</p>
                        <p v-if="meeting.week_no"><strong>Week:</strong> {{ meeting.week_no }}</p>
                        <p v-if="meeting.day_no"><strong>Day:</strong> {{ meeting.day_no }}</p>
                        <p><strong>Type:</strong> {{ meeting.meeting_model }}</p>
                    </div>
                    </div>
                </div>
            </div> -->
            <b-col xl="12" md="12">
                <h4 class="text-white">Upcoming Meetings</h4>
                <div v-if="reminders.upcoming">
                    <div
                        v-for="(meetings, type) in reminders.upcoming"
                        :key="type"
                    >
                        <div v-for="meeting in meetings" :key="meeting.id" class="text-white">
                            <b-col xl="12" md="12">
                                <b-alert show variant="secondary" v-if="type == 'TDC'">
                                    <span>You have TDC meeting with {{ meeting.client }} on {{ meeting.meeting_date }}</span>
                                </b-alert>

                                <b-alert show variant="secondary" v-if="type == 'Measurements'">
                                    <span>Upload the measurements of {{ meeting.client }} for the meeting date {{ meeting.meeting_date }}</span>
                                </b-alert>

                                <b-alert show variant="secondary" v-if="type == 'dietition_only'">
                                    <strong>You have Meeting with {{ meeting.client }} on {{ meeting.meeting_date}}, Day 10</strong>
                                    <h5 v-if="meeting.need_meeting == 1">Do you want to conduct the meeting </h5>
                                    <div v-if="meeting.need_meeting == 1">
                                        <base-button size="sm" @click="meetingUpdate('yes', meeting.id)">yes</base-button>
                                        <base-button size="sm" @click="meetingUpdate('no', meeting.id)">no</base-button>
                                    </div>
                                </b-alert>

                                <b-alert show variant="danger" v-if="type == 'Renewal'">
                                    <span>You have  renewal meeting with {{ meeting.client }} on {{ meeting.meeting_date }}</span>
                                </b-alert>

                                <b-alert show variant="secondary" v-if="type == 'Weekly'">
                                    <span>You have weekly meeting with {{ meeting.client }} of week no. {{ meeting.week_no}}, on {{ meeting.meeting_date }} </span>
                                </b-alert>
                            </b-col>
                        </div>
                    </div>
                </div>
            </b-col>
            

            <b-col xl="12" md="12">
                <h4 class="text-white">Expired Meetings</h4>
                <div v-if="reminders.expired">
                    <div
                        v-for="(meetings, type) in reminders.expired"
                        :key="type"
                    >
                        <!-- <h4>{{ type }}</h4> -->
                        <div v-for="meeting in meetings" :key="meeting.id" class="text-red">
                            <b-col xl="12" md="12">
                                <b-alert show variant="secondary" v-if="type == 'dietchart'">
                                    <span>You need to upload the dietchart of {{ meeting.client }}, which is planned on the meeting {{ meeting.meeting_date }} </span>
                                </b-alert>

                                <b-alert show variant="secondary" v-if="type == 'dietition_only'">
                                    <span>You have missed the meeting with {{ meeting.client }}, on {{ meeting.meeting_date }} </span>
                                </b-alert>

                                <b-alert show variant="secondary" v-if="type == 'Weekly'">
                                    <span>You missed your weekly meeting with {{ meeting.client }} of week no. {{ meeting.week_no}}, which is planned on {{ meeting.meeting_date }} </span>
                                </b-alert>

                                <b-alert show variant="secondary" v-if="type == 'Measurements'">
                                    <span>You didin't upload the measurements of {{ meeting.client }} for the meeting date {{ meeting.meeting_date }}</span>
                                </b-alert>

                                <b-alert show variant="secondary" v-if="type == 'Renewal'">
                                    <span>You have missed the renewal meeting with {{ meeting.client }} on {{ meeting.meeting_date }}</span>
                                </b-alert>

                                <b-alert show variant="secondary" v-if="type == 'TDC'">
                                    <span>You have missed the TDC meeting with {{ meeting.client }} on {{ meeting.meeting_date }}</span>
                                </b-alert>
                            </b-col>
                        </div>
                    </div>
                    </div>
                </div>
            </b-col>   
        </b-row>
    </base-header>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                expired_diet_reminders : [],
                expired_dietition_reminders : [],
                expired_tdc_reminders : [],
                expired_renewal_reminders : [],
                upcoming_diet_reminders : [],
                upcoming_dietition_reminders : [],
                upcoming_tdc_reminders : [],
                upcoming_renewal_reminders : [],
                expired_weekly_meetings: [],
                upcoming_weekly_meetings: [],
                reminders: {
                    upcoming: {},
                    expired: {}
                }
            };
        },
        methods:{
            async reminderList()
            {
                const token = localStorage.getItem('token');
                await axios.get(`http://127.0.0.1:8000/api/user/fetchReminders/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.upcoming_dietition_reminders = response.data.expired.dietition_only;
                    this.upcoming_diet_reminders = response.data.expired.diet_chart;
                    this.upcoming_tdc_reminders = response.data.expired.TDC;
                    this.upcoming_renewal_reminders = response.data.expired.Renewal;

                    this.upcoming_dietition_reminders = response.data.upcoming.dietition_only;
                    this.upcoming_diet_reminders = response.data.upcoming.diet_chart;
                    this.upcoming_tdc_reminders = response.data.upcoming.TDC;
                    this.upcoming_renewal_reminders = response.data.upcoming.Renewal;
                    this.reminders = response.data;
                    
                })
                .catch(error => {
                    console.error('Error:', error.response && error.response.data ? error.response.data : error);

                });
            },
            meetingUpdate(update, meetingId)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/updateMeeting/${update}/${meetingId}`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error:', error.response && error.response.data ? error.response.data : error);

                });
            },
            getCardClass(type) {
                switch (type.toLowerCase()) {
                    case "dietchart":
                    return "bg-success text-white";
                    case "renewal":
                    return "bg-warning text-dark";
                    case "weekly":
                    return "bg-primary text-white";
                    case "measurements":
                    return "bg-info text-white";
                    default:
                    return "bg-light";
                }
            }
        },
        mounted(){
            this.reminderList();
        }
    }
</script>
<style>
    .text-red span
    {
        color: red;
    }
</style>