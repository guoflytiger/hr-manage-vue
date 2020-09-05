<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box">
            <el-button
              type="primary"
              icon="el-icon-delete"
              class="handle-del mr10"
              @click="delAllSelection"
            >批量删除</el-button>
            <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
            <el-date-picker
              v-model="query.beginDateScope"
              type="datetimerange"
              align="left"
              value-format="yyyy-MM-dd hh:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              >
            </el-date-picker>
            <el-button style="margin-left:15px;" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </div>
        <el-table
            :data="transfers"
            border
            stripe
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="70" align="center"></el-table-column>
            <el-table-column  prop="id" label="ID" width="100" align="center"></el-table-column>
            <el-table-column  prop="no" label="单号" width="160" align="center"></el-table-column>
            <el-table-column  prop="fromName" label="转账人" width="120" align="center"></el-table-column>
            <el-table-column  prop="toName" label="收款人" width="140" align="center"></el-table-column>
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
  name: 'accRecoard',
  data() {
    return {
      transfers: [],
      hr: {},
      query: {
        name: '',
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
    this.getData()
  },
  methods: {
    getData() {
      let url = '/acc/recoard/page?page='+this.query.pageIndex+'&size='+this.query.pageSize;
      if (this.query.name) {
        url += '&name=' + this.query.name
      }
      if (this.query.beginDateScope) {
        url += '&beginDateScope=' + this.query.beginDateScope;
      }
      this.getRequest(url).then(resp => {
        this.transfers = resp.data
        this.pageTotal = resp.total
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.resetPage()
      this.getData()
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = '';
      this.multipleSelection.forEach(e => {
        this.delList.push(e.id)
      })
      console.log(this.delList)
      this.$confirm('确定要删除这些记录吗？', '提示', {
        type: 'warning'
      })
      .then(() => {
        this.getRequest('/acc/recoard/delByIds?delList=' + this.delList).then(resp => {
          this.getData()
          this.$message.success(e.msg)
          this.multipleSelection = [];
        }).catch(()=> {})
      })
      .catch(() => {});
      
    },
    handleDelRec(index, row){
      // 二次确认删除
      this.$confirm('确定要删除记录吗？', '提示', {
        type: 'warning'
      })
      .then(() => {
        this.deleteRequest('/acc/recoard/del/'+row.id).then(resp => {
          this.getData()
          this.$message.success(e.msg)
        }).catch(()=> {})
      })
      .catch(() => {});
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
