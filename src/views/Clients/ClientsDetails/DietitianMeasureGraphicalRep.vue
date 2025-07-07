<template>
    <b-container fluid class="mt--7">
        <b-row>
            
            <b-col xl="12" class="mb-5 mb-xl-0">
                <b-card class="mt-5">
                    <div >
                        <h4>Weekly Diet Progress - {{ client[0].name }}</h4>
                        <!-- <div style="position: relative; height: 400px;">
                            <canvas ref="measurementsChart" ></canvas>
                        </div> -->
                        <!-- <canvas ref="weeklyChart" height="120"></canvas> -->
                         <div v-for="field in measurementFields" :key="field" class="mb-4">
      <h5>{{ field.replace('_', ' ').toUpperCase() }}</h5>
      <canvas :ref="field" height="120"></canvas>
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
            client_id: this.$route.params.id,
            measureData: [],
            chart: null,
            client: [],
            measurementFields: [
      "chest",
      "right_arm",
      "left_arm",
      "waist",
      "hip",
      "left_thigh",
      "right_thigh",
      "right_calf",
      "left_calf"
    ]
        }
    },
    methods:{
        async measureprogressgraph()
        {
            const token = localStorage.getItem('token');
            await axios.get(`http://127.0.0.1:8000/api/user/measureProgressData/${this.client_id}/`, {
            headers: { Authorization: `Token ${token}` }
            })
            .then(response => {
            this.measureData = response.data;

            this.$nextTick(() => {
                this.measurementFields.forEach(field => {
          this.renderChart(field);
        });
            });
            })
            .catch(error => {
            console.error("Error fetching weekly data:", error.response && error.response.data ? error.response.data : error);
            });
            
        },
        renderChart(field) {
            // Get canvas element
  const canvasRef = this.$refs[field];
  const canvas = Array.isArray(canvasRef) ? canvasRef[0] : canvasRef;

  if (!canvas) {
    console.warn(`Canvas not found for ${field}`);
    return;
  }

  const ctx = canvas.getContext('2d');

  // Guard this.charts in case it's not ready
  if (!this.charts) {
    this.charts = {};
  }

  // Destroy old chart if exists
  if (this.charts[field]) {
    this.charts[field].destroy();
  }

  // Extract labels and data
  const labels = this.measureData.map(entry =>
    new Date(entry.meeting_date).toLocaleDateString()
  );
  const data = this.measureData.map(entry => entry[field]);

  // Create new chart
  this.charts[field] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: `${field.replace('_', ' ')} (cm)`,
        data,
        backgroundColor: '#42A5F5',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: tooltipItem =>
              `${tooltipItem.dataset.label}: ${tooltipItem.raw} cm`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Measurement (cm)'
          }
        }
      }
    }
  });
    },

        async clientDetails(id)
            {
                const token = localStorage.getItem('token');
                await axios.get(`http://127.0.0.1:8000/api/user/clientDetails/${id}/`, {
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
        this.measureprogressgraph();
    }
}

</script>