<template>
  <b-card no-body class="card-profile" alt="Image placeholder" img-top>
    <b-row class="justify-content-center">
      <b-col lg="3" class="order-lg-2">
        <div class="card-profile-image">
          <a href="#">
            <!-- <b-img src="img/theme/team-4.jpg" rounded="circle" /> -->
          </a>
        </div>
      </b-col>
    </b-row>

    <b-card-header class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
      <div class="d-flex justify-content-between">
        <a href="#" class="btn btn-sm btn-info mr-4">Weekly Workout Updates</a>
      </div>
    </b-card-header>
    <b-card-header class="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
      <div class="d-flex justify-content-between">
        <a href="#" v-b-toggle.collapse-2 class="btn btn-sm btn-info mr-4">Week1</a>
        
      </div>
    </b-card-header>

    <b-card-body class="pt-0">
        <b-row>
            <b-collapse id="collapse-2">
                
                <el-table class="table-responsive table"
                  header-row-class-name="thead-light"
                  :data="client">
                    <el-table-column label="Workout type"
                             
                             min-width="140px">
                    </el-table-column>
                </el-table>
                <b-card>  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.</b-card>
            </b-collapse>
        </b-row>
      <b-row>
        <b-col >
          <div class="card-profile-stats d-flex justify-content-center mt-md-5">
            <div class="d-flex justify-content-between">
                <a href="#" class="btn btn-sm btn-warning mr-4">Add Updates</a>
            </div>
          </div>
        </b-col>
      </b-row>
      <!-- <div class="text-center">
        <base-button
            type="primary"
            size="small"
            class="table_button" @click="workoutView(client[0].id)">
            Weekly Workout Plan
        </base-button>
      </div> -->
    </b-card-body>
  </b-card>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                client: []
            }
        },
        methods:{
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
        mounted(){
            const id = this.$route.params.id;
            this.clientDetails(id);
        }
    };
</script>
<style></style>
