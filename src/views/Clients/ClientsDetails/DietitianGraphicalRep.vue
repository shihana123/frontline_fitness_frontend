<template>
    <b-container fluid class="mt--7">
        <b-row>
            
            <b-col xl="12" class="mb-5 mb-xl-0">
                <b-card class="mt-5">
                    <div >
                        <h4>Monthly Diet Progress - {{ client[0].name }}</h4>
                        <div style="position: relative; height: 400px;">
                            <canvas ref="dietChart"></canvas>
                        </div>
                    </div>
                </b-card>
                
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js'

export default {
    data() {
        return{
            dietChart: null,
            client_id: this.$route.params.id,
            client: [],
        }
    },
    methods:{
        async monthlyprogressgraph()
        {
             const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/diet_chart_graph/${this.client_id}/`, {
                headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
                const { months, weight, bmi, height } = response.data;
                this.renderChart(months, weight, bmi, height);
                console.log(response);
                
            })
            .catch(error => {
                console.error('Error fetching diet chart:', error.response ? error.response.data : error);
            });
            
        },
        renderChart(labels, weight, bmi, height)
        {
            
            const ctx = this.$refs.dietChart.getContext('2d');
            if (this.diet_Chart) {
                console.log(labels);
                this.diet_Chart.destroy(); // destroy old chart if exists
            } 
            this.diet_Chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Weight (kg)',
                            data: weight,
                            borderColor: '#36A2EB',
                            backgroundColor: 'rgba(54,162,235,0.2)',
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'BMI',
                            data: bmi,
                            borderColor: '#FF6384',
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Height (cm)',
                            data: height,
                            borderColor: '#ffd600',
                            backgroundColor: '#ffd600',
                            fill: false,
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });  

        },
        async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                axios.get(`http://127.0.0.1:8000/api/user/clientDetails/${id}/`, {
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
    mounted() {
        this.monthlyprogressgraph();
        const id = this.$route.params.id;
        this.clientDetails(id);
    }
}

</script>