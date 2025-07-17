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
                            <h5 class="h3 text-white mb-0">Leads Count</h5>
                            
                        </b-col>
                        <b-col>
                            
                        </b-col>
                    </b-row>
                    <div class="graph">
                        <canvas ref="leadsChart"></canvas>
                    </div>
                </card>
            </b-col>

            <b-col xl="12" class="mb-5 mb-xl-0">
                <card header-classes="bg-transparent">
                    <b-row align-v="center" slot="header">
                        <b-col>
                            <h6 class="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                            <h5 class="h3 mb-0">Total orders</h5>
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
                            <canvas ref="revenueChart"></canvas>
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
            async leadsCountgraph()
            {
                const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}fetchleadsgraph/${this.currentMonth}/${this.currentYear}/   `, {
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
                const ctx = this.$refs.leadsChart.getContext('2d')
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                    labels: labels,
                    datasets: [{
                        label: `Leads in ${this.month} ${this.year}`,
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
            async revenueChart()
            {
                const token = localStorage.getItem('token');
                axios.get(`${process.env.VUE_APP_API_BASE_URL}fetchrevenuegraph/${this.rev_currentYear}/`, {
                headers: { Authorization: `Token ${token}` }
                })
                .then(response => {
                    console.log(response.data);
                    // this.renderChart(response.data.days, response.data.counts)
                    this.renderRevenueChart(response.data.months, response.data.revenue)
                })
                .catch(error => {
                    console.error('Error fetching programs:', error.response && error.response.data ? error.response.data : error);

                });
            },
            renderRevenueChart(labels, data)
            {
                const ctx = this.$refs.revenueChart.getContext('2d')
                this.revenue_Chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                    labels: labels,
                    datasets: [{
                        label: `Revenue in ${this.year}`,
                        data: data,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
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
                            callback: function(value) {
                            return '₹' + value.toLocaleString()
                            }
                        }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                        label: function(tooltipItem) {
                            return '₹' + tooltipItem.yLabel.toLocaleString()
                        }
                        }
                    }
                    }
                })
                
                
            },
            onDataChange()
            {
                this.leadsCountgraph();
            },
            onrevenueDataChange()
            {
                this.revenueChart();
            },
        },
        mounted() {
            this.leadsCountgraph();
            this.revenueChart();
        }
    }
</script>

<style>
    .graph {
        height: 400px;
        width: 100%;
    }
</style>