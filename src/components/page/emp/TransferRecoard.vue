<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 个人转账记录
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-select v-model="queryScope" placeholder="查询范围">
              <el-option
                v-for="item in queryState"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="query.name" placeholder="相关人" class="handle-input mr10"></el-input>
            <el-date-picker
              v-model="query.beginDateScope"
              type="datetimerange"
              align="left"
              value-format="yyyy-MM-dd hh:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['06:00:00', '20:00:00']">
            </el-date-picker>
            <el-button style="margin-left:20px;" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </div>
        <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="transfers"
            border
            stripe
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
        >
            <el-table-column  prop="id" label="ID" width="100" align="center"></el-table-column>
            <el-table-column  prop="no" label="单号" width="180" align="center"></el-table-column>
            <el-table-column  prop="fromName" label="转账人" width="160" align="center"></el-table-column>
            <el-table-column  prop="toName" label="收款人" width="160" align="center"></el-table-column>
            <el-table-column  prop="amount" label="转账金额" width="160" align="center"></el-table-column>
            <el-table-column  prop="createTime" label="单据日期" width="160" align="center"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <el-button
                    style="margin-right:10px;color:red;"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelRec(scope.$index, scope.row)"
                  >删除记录</el-button>
                </template>
            </el-table-column>
        </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'transferRecoard',
  data() {
    return {
      loading: false,
      queryScope: 'all',
      queryState: [
        {
          value: 'in',
          label: '转入'
        },
        {
          value: 'out',
          label: '转出'
        },
        {
          value: 'all',
          label: '所有'
        }
      ],
      transfers: [],
      hr: {},
      query: {
        name: null,
        pageIndex: 1,
        pageSize: 10,
        beginDateScope: [],
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      pageTotal: 0,
    };
  },
  created() {
  },
  mounted() {
    this.initHr()
  },
  methods: {
    initHr() {
      this.loading = true
      this.getRequest('/emp/info').then(resp => {
        if (resp) {
          this.hr = resp;
        }
        this.getData()
        this.loading = false
      })
    },
    getData() {
      this.loading = true
      let url = '/emp/trsRed/page?page='+this.query.pageIndex+'&size='+this.query.pageSize;
      if (this.query.name) {
        if (this.queryScope === 'in') {
          // url += '&fromName=' + this.hr.name;
          url += '&toName=' + this.query.name;
        }else if(this.queryScope === 'out') {
          url += '&fromName=' + this.query.name;
          // url += '&toName=' + this.hr.name;
        }else if (this.queryScope === 'all'){
          url += '&fromName=' + this.query.name;
          url += '&toName=' + this.query.name;
        }
      }else {
        if (this.queryScope === 'in') {
          url += '&toName=' + this.hr.name;
        }else if(this.queryScope === 'out') {
          url += '&fromName=' + this.hr.name;
        }else if (this.queryScope === 'all'){
          url += '&fromName=' + this.hr.name;
          url += '&toName=' + this.hr.name;
        }
      }
      url += '&name=' + this.hr.name;
      if (this.query.beginDateScope) {
        url += '&beginDateScope=' + this.query.beginDateScope;
      }
      this.getRequest(url).then(resp => {
        this.transfers = resp.data
        this.pageTotal = resp.total
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.resetPage()
      this.getData()
    },
    handleDelRec(index, row){
      this.loading = true
      // 二次确认删除
      this.$confirm('确定要删除记录吗？', '提示', {
        type: 'warning'
      })
      .then(() => {
        this.deleteRequest('/emp/trsRed/del/'+row.id).then(resp => {
          this.getData()
          this.$message.success(e.msg)
          this.loading = true
        }).catch(()=> {
          this.loading = false
        })
      })
      .catch(() => {
        this.loading = false
      });
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getData();
    },
    resetPage() {
      this.query.pageIndex = 1
      this.query.pageSize = 10
    }
  }
}
</script>
<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.green {
  color: green;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
