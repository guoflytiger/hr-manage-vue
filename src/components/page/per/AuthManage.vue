<template>
  <div>
    <el-card style="margin-top: 40px;">
      <div slot="header" class="clearfix">
        <span>角色授权</span>
      </div>
      <el-form label-width="160px" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="授予人">
          <el-tag>{{formInline.name}}</el-tag>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input v-model="formInline.param" placeholder="请输入姓名或工号..."></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectHr">搜索</el-button>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-transfer :titles="['所有角色', '当前角色']" v-model="authArray" :data="rolesData"></el-transfer>
        </el-form-item>
        <br/>
        <el-form-item style="margin-left: 200px;">
          <el-button type="primary" @click="onSubmit">确认授权</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'authManage',
  data() {
    return {
      Hr: null,
      formInline: {
        param: '',
        money: 100,
        name: '暂无'
      },
      Auth: {
        hrId: null,
        rIds: []
      },
      roles: [],
      rolesData: [],
      authArray: []
    }
  },
  mounted() {
    this.initRoles()
  },
  methods: {
    initRoles() {
      this.getRequest("/per/auth/roles").then(resp => {
        if (resp) {
          this.roles = resp
          this.rolesData = []
          this.roles.forEach(e => {
            this.rolesData.push({key: e.id,label: e.nameZh})
          })
        }
      })
    },
    onSubmit() {
      this.Auth.hrId = this.Hr.id
      this.Auth.rIds = this.authArray
      this.putRequest("/per/auth/",{hrId: this.Auth.hrId,rIds: this.Auth.rIds}).then(resp => {
        
      }).catch(err => {
        this.$message.error(err)
      })
    },
    selectHr() {
      this.getRequest("/emp/account/getHr/" + this.formInline.param).then(resp => {
        if (resp) {
          this.Hr = resp.obj
          this.formInline.name = this.Hr.name

          this.getRequest("/per/auth/roles/"+this.Hr.id).then(resp => {
            if (resp) {
              this.authArray = []
              resp.forEach(e => {
                this.authArray.push(e.id)
              })
            }
          })
        }
      })
    },
  }
}
</script>
<style scoped>

</style>