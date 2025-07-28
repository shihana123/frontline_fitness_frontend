<template>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Programs List</h3>
            <b-button  variant="success" class="create_btn" v-b-modal.modal-1 @click="redirect()">Create Program</b-button>
        </b-card-header>
        <!-- {{ users }} -->
        <div class="search_bar d-flex justify-content-end">
            <base-input
            style="width: 35%"
            v-model="searchQuery"
            prepend-icon="fas fa-search"
            placeholder="Search Programs..."
            />
        </div>
        
        <el-table
        :data="paginatedData"
        style="width: 100%"
        class="table-responsive table"
        header-row-class-name="thead-light"
        @selection-change="selectedRows = $event"
        >
        <el-table-column label="#" min-width="90">
            <template slot-scope="scope">
                {{ (currentPage - 1) * perPage + scope.$index + 1 }}
            </template>
        </el-table-column>

        <el-table-column
            v-for="(col, index) in tableColumns"
            :key="index"
            :prop="col.prop"
            :label="col.label"
            :min-width="col.minWidth"
            :sortable="col.sortable"
            v-if="col.prop !== 'status'"
        >
        </el-table-column>

        <el-table-column
        label="Status"
        min-width="140"
        sortable
        >
        <template slot-scope="scope">
            <span>{{ scope.row.status ? 'Active' : 'Inactive' }}</span>
        </template>
        </el-table-column>

        <el-table-column label="Actions" min-width="180">
            <template slot-scope="scope">
                <!-- <a href="#" class="table-icons" data-toggle="tooltip" title="View">
                    <i class="ni ni-circle-08"></i>
                </a> -->
            
                <base-button size="sm" type="warning" v-b-modal.modal-1 @click="updateProgramModal(scope.row.id)">
                    <i class="ni ni-settings"></i>
                </base-button>

                <base-button size="sm" type="danger" @click="deleteProgram(scope.row.id)">
                    <i class="ni ni-fat-remove"></i>
                </base-button>
            </template>
        </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredPrograms.length"
            :page-size="perPage"
            :current-page.sync="currentPage"
            @current-change="paginationChanged"
            class="mt-3 d-flex justify-content-end"
            />
        </b-card-footer>
        <b-modal id="modal-1" title="Program Details" hide-footer v-if="modal_1">
        <b-form @submit.prevent="saveProgram">
            
            <div class="pl-lg-12">
                <b-row >
                    <b-col lg="12">
                        <base-input
                        type="text"
                        label="Program Name"
                        v-model="programData.name"
                        required
                        >
                        </base-input>
                    </b-col>

                    <b-col lg="12">
                        <base-input label="Status">
                            <select class="form-control" v-model="programData.status">
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
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
    </b-card>

    

</template>

<script>
import axios from 'axios';
import { Table, TableColumn, Pagination } from 'element-ui';


export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
  },
  data() {
    return {
      modal_1: false,
      programs: [],
      currentPage: 1,
      perPage: 10,
      selectedRows: [],
      searchQuery: '',   // For storing search input
    //   propsToSearch: ['name', 'email', 'user_id', 'phone'],  // Fields to search
      tableColumns: [
        { prop: 'name', label: 'Program', minWidth: 140, sortable: true },
        { prop: 'status', label: 'Status', minWidth: 140, sortable: true },
      ],
      programData:{
        name: '',
        status: 1
      },
      selectedId: ''
    };
  },
  computed: {
    filteredPrograms() {
        if (!this.searchQuery) return this.programs;

        const query = this.searchQuery.toLowerCase();

        return this.programs.filter(program => {
            const name = program.name || '';
            const statusText = program.status ? 'active' : 'inactive';
           

            return (
            name.toLowerCase().includes(query) ||
            statusText.includes(query)
            );
        });
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredPrograms.slice(start, end);
    }
  },
  watch: {
    searchQuery() {
        this.currentPage = 1;
    }
  },
  methods: {
    paginationChanged(page) {
      this.currentPage = page;
    },
    async programList() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}mainProgramList`);
        this.programs = response.data;
        console.log(this.programs);
        
        console.log('Users fetched:', this.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    redirect()
    {
        this.modal_1 = true;
    },
    saveProgram()
    {
        // alert(this.selectedId);
        if(this.selectedId)
        {
            const formData = new FormData();
            formData.append('name', this.programData.name);
            formData.append('status', this.programData.status);

            axios.post(`${process.env.VUE_APP_API_BASE_URL}mainprogramUpdate/${this.selectedId}/`, formData,{
            })
            .then(response => {
            console.log('Program updated successfully:', response.data);
            this.modal_1 = false;
            this.resetForm();
            this.selectedId = '';
            this.$swal.fire("Updated!", "Program has been updated.", "success");
            this.programList();
            })
            .catch(error => {
            console.error('Error updating program:', error.response && error.response.data ? error.response.data : error);

            });
        }
        else
        {
            const formData = new FormData();
            formData.append('name', this.programData.name);
            formData.append('status', this.programData.status);

            axios.post(`${process.env.VUE_APP_API_BASE_URL}mainprogramCreate`, formData,{
            })
            .then(response => {
            console.log('Program created successfully:', response.data);
            this.modal_1 = false;
            this.resetForm();
            this.$swal.fire("Created!", "Program has been created.", "success");
            this.programList();
            })
            .catch(error => {
            console.error('Error creating program:', error.response && error.response.data ? error.response.data : error);

            });
        }
        
    },
    resetForm() {
        this.programData = {
            name: '',
            status: 1
        };
    },
    deleteProgram(id) {
        this.$swal
        .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
        if (result.isConfirmed) {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}deleteMainProgram/${id}/`)
            .then(() => {
                this.$swal.fire("Deleted!", "Program has been deleted.", "success");
                this.programList(); // re-fetch or remove from array
            })
            .catch(err => {
                console.error(err);
                this.$swal.fire("Error!", "Could not delete program.", "error");
            });
        }
        });
    },
    updateProgramModal(id)
    {
        this.fetchProgram(id);
        this.modal_1 = true;
    },
    async fetchProgram(id)
    {
        try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}mainProgramDetail/${id}/`);
        this.programData.name = response.data[0].name;
        this.programData.status = response.data[0].status? 1 : 0;
        this.selectedId = id;
        console.log(response.data[0].status);
        
        console.log('Users fetched:', this.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  },
  mounted() {
    this.programList();
  }
};
</script>
<style scoped>
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
    .search_bar
    {
       
        margin-right: 5px;
    }
</style>