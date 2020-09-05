<template>
  <div v-if="hr" >
    <el-card class="box-card" style="margin: auto;position: absolute;
  top: 0px;bottom: 0px;left: 0px;right: 0px;width: 860px;height: 610px;"
      v-loading="loading">
      <div slot="header" class="clearfix">
        <span>{{hr.name}}</span>
      </div>
      <div>
        <div style="display: flex;justify-content: center;flex-direction: column;">
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">账户：
                <el-tag>{{hr.account.number}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">员工工号：
                <el-tag>{{hr.empDetails.jobNum}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">用户状态：
                <el-tag>{{hr.enable}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">账户状态：
                <el-tag>{{hr.account.state}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">账户余额：
                <el-tag>{{hr.account.money}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">开户时间：
                <el-tag>{{hr.account.createTime}}</el-tag>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-card style="margin-top: 40px;">
        <div slot="header" class="clearfix">
          <span>转账</span>
        </div>
        <el-form label-width="160px" :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="收款人">
            <template v-if="formInline.name">
              <el-tag>{{formInline.name}}</el-tag>
            </template>
            <template v-else>
              <el-tag style="color: red;">暂无</el-tag>
            </template>
          </el-form-item>
          <el-form-item label="查询收款人">
            <el-input v-model="formInline.param" placeholder="请输入用户名或工号..."></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="selectHr">搜索</el-button>
          </el-form-item>
          <el-form-item label="转账金额">
            <el-input-number v-model="formInline.money" :min="1" :max="10000" :step="100" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-select @change="selectChange" v-model="transferInfo.toAccId" placeholder="请选择">
              <el-option
                v-for="h in hrs"
                :key="h.id"
                :label="h.name"
                :value="h.accId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 200px;">
            <el-button type="primary" @click="onSubmit">确认转账</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "empAccount",
  data() {
    return {
      loading: true,
      hrs: [],
      hr: null,
      formInline: {
        param: null,
        region: '',
        money: 100,
        name: null
      },
      toHr: {
        id: null
      },
      transferInfo: {
        fromAccId: null,
        toAccId: null,
        money: null
      },
      dialogVisible: false,
    }
  },
  mounted() {
    this.initHr();
  },
  methods: {
    onSubmit() {
      this.loading = true
      if (this.hr == null || this.hr.accId == null){
        this.$message.error('用户未开户，请先开户')
        return
      }
      if (this.toHr == null || this.toHr.accId == null){
        this.$message.error('请选择用户')
        return
      }
      this.transferInfo.fromAccId = this.hr.accId
      this.transferInfo.toAccId = this.toHr.accId
      this.transferInfo.money = this.formInline.money
      this.postRequest('/emp/info/transferTo',this.transferInfo).then(resp => {
        this.initHr();
        this.loading = false
      })
    },
    selectHr() {
      this.loading = true
      this.getRequest("/emp/account/getHr/" + this.formInline.param).then(resp => {
        if (resp) {
          this.toHr = resp.obj
          this.formInline.name = this.toHr.name
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    onSuccess() {
      this.initHr();
    },
    initHr() {
      this.loading = true
      this.getRequest('/emp/info/getAccInfo/').then(resp => {
        if (resp) {
          this.hr = resp;
        }
        this.getRequest('/emp/account/getHrs').then(resp => {
          if (resp) {
            this.hrs = resp;
          }
           this.loading = false
        }).catch(err => {
          this.$message.error(err)
          this.loading = false
        })
      }).catch(err => {
        this.$message.error(err)
        this.loading = false
      })
    },
    selectChange(accId) {
      let result = this.hrs.filter(f => f.accId === accId)[0]
      this.formInline.name = result.name
      this.toHr.accId = result.accId
      this.formInline.param = result.name
    }
  }
}
</script>

<style scoped>

</style>
