<template>
    <b-card no-body>
        <b-card-header class="border-0 header-sec">
            <h3 class="mb-0">Users List</h3>
            <b-button  variant="success" class="create_btn" @click="redirect()">Create User</b-button>
        </b-card-header>
        <!-- {{ users }} -->
        <div class="search_bar d-flex justify-content-end">
            <base-input
            style="width: 35%"
            v-model="searchQuery"
            prepend-icon="fas fa-search"
            placeholder="Search users..."
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
        >
        </el-table-column>

        <el-table-column label="Actions" min-width="180">
            <template slot-scope="scope">
            <a href="#" class="table-icons" data-toggle="tooltip" title="View">
                <i class="ni ni-circle-08"></i>
            </a>
            <a href="#" class="table-icons" data-toggle="tooltip" title="Edit">
                <i class="ni ni-settings text-yellow"></i>
            </a>
            <a href="#" class="table-icons" data-toggle="tooltip" title="Delete">
                <i class="ni ni-fat-remove text-red"></i>
            </a>
            </template>
        </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
            <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredUsers.length"
            :page-size="perPage"
            :current-page.sync="currentPage"
            @current-change="paginationChanged"
            class="mt-3 d-flex justify-content-end"
            />
        </b-card-footer>
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
      users: [],
      currentPage: 1,
      perPage: 10,
      selectedRows: [],
      searchQuery: '',   // For storing search input
    //   propsToSearch: ['name', 'email', 'user_id', 'phone'],  // Fields to search
      tableColumns: [
        { prop: 'user_id', label: 'User ID', minWidth: 140, sortable: true },
        { prop: 'name', label: 'Name', minWidth: 140, sortable: true },
        { prop: 'roles[0].role.rolename', label: 'Role', minWidth: 140 },
        { prop: 'email', label: 'Email', minWidth: 170 },
        { prop: 'phone', label: 'Phone', minWidth: 190 }
      ],
    };
  },
  computed: {
    filteredUsers() {
        if (!this.searchQuery) return this.users;

        const query = this.searchQuery.toLowerCase();

        return this.users.filter(user => {
            const name = user.name || '';
            const email = user.email || '';
            const phone = user.phone || '';
            const userId = user.user_id || '';
            const roleName = (user.roles && user.roles.length > 0 && user.roles[0].role && user.roles[0].role.rolename) || '';

            return (
            name.toLowerCase().includes(query) ||
            email.toLowerCase().includes(query) ||
            phone.toLowerCase().includes(query) ||
            userId.toLowerCase().includes(query) ||
            roleName.toLowerCase().includes(query)
            );
        });
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredUsers.slice(start, end);
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
    async userList() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}userList`);
        this.users = response.data;
        console.log('Users fetched:', this.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    redirect()
        {
            this.$router.push('/users/create');
        }
  },
  mounted() {
    this.userList();
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