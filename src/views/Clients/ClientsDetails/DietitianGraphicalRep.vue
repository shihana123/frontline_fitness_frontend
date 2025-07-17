<template>
    <b-container fluid class="mt--7">
        <b-row>
            
            <b-col xl="12" class="mb-5 mb-xl-0">
                <b-card class="mt-5">
                    <div >
                        <h4>Weekly Diet Progress - {{ client[0].name }}</h4>
                        <div style="position: relative; height: 400px;">
                            <canvas ref="weeklyChart" ></canvas>
                        </div>
                        <!-- <canvas ref="weeklyChart" height="120"></canvas> -->
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
            client_id: this.$route.params.id,
            weeklyData: [],
            chart: null,
            client: []
        }
    },
    methods:{
        async weeklyprogressgraph()
        {
            const token = localStorage.getItem('token');
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}weeklyMeetingList/${this.client_id}`, {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
            this.weeklyData = response.data;

            this.$nextTick(() => {
                this.renderChart();
            });
            })
            .catch(error => {
            console.error("Error fetching weekly data:", error.response && error.response.data ? error.response.data : error);
            });
            
        },
        renderChart() {
  const canvas = this.$refs.weeklyChart;
  if (!canvas) {
    console.error('Canvas not found!');
    return;
  }

  const ctx = canvas.getContext('2d');

  const weekLabels = this.weeklyData.map(entry => `Week ${entry.week_no}`);
  const weightData = this.weeklyData.map(entry => entry.weight);
  const bmiData = this.weeklyData.map(entry => entry.bmi);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weekLabels,
      datasets: [
        {
          label: 'Weight (kg)',
          data: weightData,
          backgroundColor: '#42A5F5',
        },
        {
          label: 'BMI',
          data: bmiData,
          backgroundColor: '#66BB6A',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const index = tooltipItem.dataIndex;
              const entry = this.weeklyData[index];
              return [
                `Height: ${entry.height} cm`,
                `Weight: ${entry.weight} kg`,
                `BMI: ${entry.bmi}`,
              ];
            },
          },
        },
      },
    },
  });
},
        async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                await axios.get(`${process.env.VUE_APP_API_BASE_URL}clientDetails/${id}/`, {
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
        
        const id = this.$route.params.id;
        this.clientDetails(id);
        this.weeklyprogressgraph();
    }
}

</script>