<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 账号信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
        <div class="handle-box" style="margin-bottom: 50px;">
            <el-button @click="handleInsert" style="float: right;margin-right:13px;" type="primary" icon="el-icon-search">新增员工</el-button>
        </div>
        <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="accs"
            border
            stripe
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column fixed prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column fixed prop="empDetails.jobNum" label="工号" width="100" align="center"></el-table-column>
            <el-table-column fixed prop="name" label="姓名" width="100" align="center"></el-table-column>
            <!-- <el-table-column fixed prop="username" label="账号" width="100" align="center"></el-table-column> -->
            <el-table-column fixed prop="account.number" label="账户号码" width="100" align="center"></el-table-column>
            <el-table-column fixed prop="account.money" label="账户余额" width="100" align="center"></el-table-column>
            <el-table-column fixed prop="account.createTime" label="开户日期" width="100" align="center"></el-table-column>
            <el-table-column label="账户状态" width="100" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.account">
                      <el-tag
                        :type="scope.row.account.state===true?'success':(scope.row.account.state===false?'danger':'')"
                      >
                      <span v-if="scope.row.account.state">启用</span>
                      <span v-else>冻结</span>
                      </el-tag>
                    </template>
                    <template v-else>
                      <el-tag :type="'danger'">
                      <span>暂未开户</span>
                      </el-tag>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="用户状态" width="100" align="center">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.enable===true?'success':(scope.row.enable===false?'danger':'')"
                  >
                  <span v-if="scope.row.enable">启用</span>
                  <span v-else>停用</span>
                  </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="empDetails.hireDate" label="入职时间" width="100" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleAddAcc(scope.$index, scope.row)"
                  >开户</el-button>
                  <el-button
                    style="margin-right:10px;color:red;"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleDelAcc(scope.$index, scope.row)"
                  >销户</el-button>
                  <el-dropdown >
                    <span style="font-size:10px;" class="el-dropdown-link">
                      状态<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        class="green"
                        @click="handlEnable(scope.$index, scope.row)"
                      >启用</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        class="red"
                        @click="handleDisable(scope.$index, scope.row)"
                      >禁用</el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>  
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
      <!-- 开户弹出框 -->
      <el-dialog title="开户" :visible.sync="addVisible" width="30%">
        <el-form ref="addform" :model="addform" label-width="70px"
          style="text-align-last:justify;text-align:justify;">
          <el-form-item label="账 号">
            <el-input v-model="addform.username"></el-input>
          </el-form-item>
          <el-form-item label="账号状态"> 
            <el-switch
              v-model="addform.enable"
              active-text="启用"
              inactive-text="禁用"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addform.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveInsert">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: 'accInfo',
  data() {
    return {
      loading: false,
      accs: [],
      hr: {},
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      pageTotal: 0,
      addVisible: false,
      addform: {
        username: '',
        enable: true,
        remark: ''
      },
      idx: -1,
      id: -1
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.getRequest('/acc/info/page').then(resp => {
        this.accs = resp.data;
        this.pageTotal = resp.total
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    // 禁用操作
    handleDisable(index, row) {
      if (row.account == null || row.account.id == null) {
        this.$message.error("暂无账号，请先开户!")
        return
      }
      // 二次确认删除
      this.$confirm('确定要禁用吗？', '提示', {
        type: 'warning'
      })
      .then(() => {
        this.loading = true
        this.getRequest('/acc/info/disableAcc/'+row.account.id).then(resp => {
          this.getData()
          this.$message.success(e.msg)
          this.loading = false
        }).catch(()=> {
          this.loading = false
        })
      })
      .catch(() => {
        this.loading = false
      });
    },
    handlEnable(index,row){
      if (row.account == null || row.account.id == null) {
        this.$message.error("暂无账号，请先开户!")
        return
      }
      // 二次确认启用
      this.$confirm('确定要启用吗？', '提示', {
        type: 'warning'
      })
      .then(() => {
        this.loading = true
        this.getRequest('/acc/info/enableAcc/'+row.account.id).then(resp => {
          this.getData()
          this.$message.success(e.msg)
        }).catch(()=> {
          this.loading = false
        })
      })
      .catch(() => {
        this.loading = false
      });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = '';
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' ';
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.editform = row;
      this.editVisible = true;
    },
    handleAddAcc(index, row) {
      this.loading = true
      // 二次确认开户
      this.$confirm('确定要开户吗？', '提示', {
        type: 'warning'
      })
      .then(() => {
        this.getRequest('/acc/info/addAccount/'+row.id).then(resp => {
          this.getData()
          this.$message.success(e.msg)
          this.loading = false
        }).catch(()=> {
            this.loading = false
        })
      })
      .catch(() => {
        this.loading = false
      });
    },
    handleDelAcc(index, row){
      // 二次确认销户
      this.$confirm('确定要销户吗？', '提示', {
        type: 'warning'
      })
      .then(() => {
        this.loading = true
        this.getRequest('/acc/info/delAcc/'+row.id).then(resp => {
          this.getData()
          this.$message.success(e.msg)
          this.loading = false
        }).catch(()=> {
          this.loading = false
        })
      })
      .catch(() => {
        this.loading = false 
      });
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.loading = true
      this.putRequest('/emps/updateBaseInfo',this.editform).then(resp => {
        this.getData()
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    //保存新增
    saveInsert() {            
      this.addVisible = false;
      this.loading = true
      this.postRequest('/emps/addBaseInfo',this.addform).then(resp => {
        this.getData()
        this.loading = false
      })
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val);
      this.getData();
    },
    handleInsert() {
      this.addVisible = true;
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
