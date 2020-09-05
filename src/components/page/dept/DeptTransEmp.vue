<template>
  <div>
    <el-card style="margin-top: 40px;">
      <div slot="header" class="clearfix">
        <span>员工调动</span>
      </div>
      <el-form 
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="margin-left: 30px;margin-top: 40px;"
        label-width="100px" :inline="true" :model="formInline" class="demo-form-inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-form-item label="待调员工">
                <template v-if="formInline.name">
                  <el-tag>{{formInline.name}}</el-tag>
                </template>
                <template v-else>
                  <el-tag style="color: red;">暂未选择</el-tag>
                </template>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="当前部门">
                <template v-if="Hr.empDetails.department.name">
                  <el-tag>{{Hr.empDetails.department.name}}</el-tag>
                </template>
                <template v-else>
                  <el-tag style="color: red;">暂无部门</el-tag>
                </template>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-form-item>
                <el-select @change="selectChange" v-model="Hr.empDetails.id" placeholder="选择待调人">
                  <el-option
                    v-for="h in hrs"
                    :key="h.id"
                    :label="h.name"
                    :value="h.edId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="formInline.param" placeholder="请输入姓名或工号..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button type="primary" @click="selectHr">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="角色列表">
          <el-tree
            accordion
            @node-click="confirm"
            :data="deps"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree">
            <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%;"
              slot-scope="{ node, data }">
              <span>{{data.name }}</span>
            </span>
          </el-tree>
        </el-form-item>
        <br/>
        <el-form-item style="margin-left: 200px;margin-top:10px;">
          <el-button type="primary" @click="onSubmit">确认调动</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'deptTransEmp',
  data() {
    return {
      loading: false,
      hrs: [],
      Hr: {
        empDetails: {
          department: {
            name: null
          }
        }
      },
      deps: [],
      formInline: {
        param: '',
        name: null,
        deptment: null
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    selectHr() {
      this.loading = true
      this.getRequest("/dept/trans/getDeptInfo/" + this.formInline.param).then(resp => {
        if (resp) {
          this.Hr = resp.obj
          this.formInline.name = this.Hr.name
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    initDeps() {
      this.loading = true
      this.getRequest("/dept/struc").then(resp => {
        if (resp) {
          this.deps = resp;
        }
        this.getRequest(" /dept/trans/getAllDeptInfo").then(resp => {
          this.hrs = resp
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      }).catch(err => {
        this.loading = false
      })
    },
    onSubmit() {
      if (!this.Hr.id || !this.Hr.empDetails.department.id){
        this.$message.error('请先选择待调员工和部门')
        return
      }
      this.$confirm('此操作将调动【' + this.Hr.name + '】到部门【'+ this.Hr.empDetails.department.name+'】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.postRequest("/dept/trans/",{
          edId: this.Hr.empDetails.id,
          deptId: this.Hr.empDetails.department.id
        }).then(resp=>{
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消调动'
        });
        this.loading = false
      });
    },
    confirm(data) {
      this.Hr.empDetails.department.name = data.name
      this.Hr.empDetails.department.id = data.id
    },
    selectChange(edId) {
      let result = this.hrs.filter(f => f.edId === edId)[0]
      this.formInline.name = result.name
      this.Hr.empDetails.department.name = result.empDetails.department.name
      this.Hr.empDetails.department.id = result.empDetails.department.id
      this.Hr.id = result.id
      this.Hr.name = result.name
    }
  }
}
</script>
<style scoped>

</style>