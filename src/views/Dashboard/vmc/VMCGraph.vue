<template>
    <b-container fluid class="mt--7">
        <b-row>
            
            <b-col xl="12" class="mb-5 mb-xl-0">
                <card type="default" header-classes="bg-transparent">
                    <template>
                        <div class="month_year_block">
                            <select class="form-control monthSelector mr-2" v-model="currentYear"  @change="onDataChange">
                                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                            </select>
                            <select class="form-control monthSelector" v-model="currentMonth"  @change="onDataChange">
                                <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                            </select>
                        </div>
                    </template>
                    <br>
                    <b-row align-v="center" slot="header">
                        
                        <b-col>
                            <h6 class="text-light text-uppercase ls-1 mb-1">Overview</h6>
                            <h5 class="h3 text-white mb-0">Active Client Count - Monthly</h5>
                        </b-col>
                        <b-col>
                            
                        </b-col>
                    </b-row>
                    <div class="graph">
                        <canvas ref="clientChart"></canvas>
                    </div>
                </card>
            </b-col>

            <b-col xl="12" class="mb-5 mb-xl-0">
                <card header-classes="bg-transparent">
                    <b-row align-v="center" slot="header">
                        <b-col>
                            <h6 class="text-uppercase text-muted ls-1 mb-1">Overview</h6>
                            <h5 class="h3 mb-0">Active Client Count - Yearly</h5>
                        </b-col>
                        <b-col>
                            <template>
                                <div class="month_year_block">
                                    <select class="form-control monthSelector mr-2" v-model="rev_currentYear"  @change="onrevenueDataChange">
                                        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                    </select>
                                </div>
                            </template>
                        </b-col>
                        <div class="graph">
                            <canvas ref="yearlyClientChart"></canvas>
                        </div>
                    </b-row>
                </card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import axios from 'axios'
    import Chart from 'chart.js'

    export default {
        props: ['month', 'year'],
        data() {
            const today = new Date();
            const monthNames = [
            'January', 'Februray', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const years = [2025]
            return{
                currentYear: today.getFullYear().toString(),  // "2025"
                currentMonth: monthNames[today.getMonth()], 
                months: monthNames,
                years: years,
                chart: null,
                revenue_Chart: null,
                rev_currentYear: today.getFullYear().toString()
            }
        },
        methods: {
            async ClientCountgraph()
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/fetchActiveClientsgraph/${this.currentMonth}/${this.currentYear}/   `, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.renderChart(response.data.days, response.data.counts)
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            renderChart (labels, data) {
                const ctx = this.$refs.clientChart.getContext('2d')
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                    labels: labels,
                    datasets: [{
                        label: `Leads in ${this.currentMonth} ${this.currentYear}`,
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: true
                    }]
                    },
                    options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            precision: 0
                        }
                        }]
                    }
                    }
                })
            },
            async YearlyClientCountgraph()
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/fetchYearlyActiveClientsgraph/${this.currentYear}/   `, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    this.renderYearlyChart(response.data.months, response.data.counts)
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            renderYearlyChart(months, counts) {
                const ctx = this.$refs.yearlyClientChart.getContext('2d');
                this.chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [{
                            label: `Active Clients in ${this.year}`,
                            data: counts,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    precision: 0
                                }
                            }]
                        }
                    }
                });
            },
            
            onDataChange()
            {
                this.ClientCountgraph();
            },
        },
        mounted() {
            this.ClientCountgraph();
            this.YearlyClientCountgraph();
        }
    }
</script>

<style>
    .graph {
        height: 400px;
        width: 100%;
    }
</style>