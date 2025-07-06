<template>
    <base-header class=" pb-8 pt-5 pt-md-8">
        <b-row>
            
            <b-col xl="12" md="12" v-for="upcoming_diet_reminder in upcoming_diet_reminders">
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
            }
        },
        mounted(){
            this.reminderList();
        }
    }
</script>
