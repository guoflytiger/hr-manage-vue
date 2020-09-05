<template>
  <div v-if="hr">
    <el-card class="box-card" style="margin: auto;position: absolute;
  top: 0px;bottom: 0px;left: 0px;right: 0px;width: 860px;height: 610px;"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
      <div slot="header" class="clearfix">
        <span>{{hr.name}}</span>
      </div>
      <div>
        <div style="display: flex;justify-content: center">
          <el-upload
              :show-file-list="false"
              :on-success="onSuccess"
              :data="hr"
              action="/hr/userface">
            <img title="点击修改用户图像" :src="hr.userFace" style="margin-top:15px;width: 100px;height: 100px;border-radius: 50px"
                alt="">
          </el-upload>
        </div>
        <div style="display: flex;justify-content: center;flex-direction: column;">
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">账号：
                <el-tag>{{hr.username}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">性别：
                <el-tag>{{hr.empDetails.sex}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">员工工号：
                <el-tag>{{hr.empDetails.jobNum}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">身份证号：
                <el-tag>{{hr.empDetails.idCard}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">电话号码：
                <el-tag>{{hr.telephone}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">邮箱：
                <el-tag>{{hr.empDetails.email}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">部门
                <el-tag>{{hr.empDetails.department.name}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">民族：
                <el-tag>{{hr.empDetails.nation}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">职称
                <el-tag>{{hr.empDetails.jobLevel.name}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">岗位级别：
                <el-tag>{{hr.empDetails.jobLevel.titleLevel}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">居住地址：
                <el-tag>{{hr.address}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">最高学历：
                <el-tag>{{hr.empDetails.tiptopDegree}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">学校：
                <el-tag>{{hr.empDetails.school}}</el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 20%;margin-top: 10px;">专业：
                <el-tag>{{hr.empDetails.specialty}}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div style="margin-left: 10%;margin-top: 10px;">用户标签：
                <el-tag type="success" style="margin-right: 5px" v-for="(r,index) in hr.roles" :key="index">
                  {{r.nameZh}}
                </el-tag>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="display: flex;justify-content: space-around;margin-top: 20px">
          <el-button type="primary" @click="showUpdateHrInfoView">修改信息</el-button>
          <el-button type="danger" @click="showUpdatePasswdView">修改密码</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogVisible"
      width="50%">
      <div  style="display: flex;justify-content: center;flex-direction: column;">
        <table>
          <tr>
            <td>
              <el-tag>姓名：</el-tag>
            </td>
            <td>
              <el-input v-model="hr2.name"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>性别：</el-tag>
            </td>
            <td>
              <el-input v-model="hr2.empDetails.sex"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>身份证号：</el-tag>
            </td>
            <td>
              <el-input v-model="hr2.empDetails.idCard"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>电话号码：</el-tag>
            </td>
            <td>
              <el-input v-model="hr2.telephone"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>邮箱：</el-tag>
            </td>
            <td>
              <el-input v-model="hr2.empDetails.email"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>民族：</el-tag>
            </td>
            <td>
              <el-input v-model="hr2.empDetails.nation"></el-input>
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>居住地址：</el-tag>
            </td>
            <td>
              <el-input v-model="hr2.address"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <div style="display: flex;justify-content: space-around;">
          <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateHrInfo">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog
        title="修改密码"
        :visible.sync="passwdDialogVisible"
        width="30%">
      <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                class="demo-ruleForm">
          <el-form-item label="请输入旧密码" prop="oldpass">
            <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="请输入新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "empInfo",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      ruleForm: {
        oldpass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldpass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      hr: {
        id: null,
        name: null,
        phone: null,
        telephone: null,
        address: null,
        enabled: true,
        username: null,
        password: null,
        userFace: null,
        remark: null,
        roles: null,
        account: {
          id: null,
          money: null,
          number: null,
          password: null,
          state: null,
          createTime: null,
          deadLine: null
        },
        empDetails: {
          id: null,
          jobLevel: {
            id: null,
            name: null,
            titleLevel: null,
            enabled: null,
            createDate: null
          },
          department: {
            id: null,
            depPath: null,
            enable: null,
            name: null,
            parent: null,
            parentId: null
          },
          idCard: null,
          nation: null,
          school: null,
          tiptopDegree: null,
          specialty: null,
          sex: null,
          email: null,
          birthDay: null,
        },
        accountNonExpired:true,
        credentialsNonExpired:true,
        accountNonLocked:true
      },
      hr2: {
            id: null,
            name: null,
            phone: null,
            telephone: null,
            address: null,
            enabled: true,
            username: null,
            password: null,
            userFace: null,
            remark: null,
            roles: null,
            account: {
              id: null,
              money: null,
              number: null,
              password: null,
              state: null,
              createTime: null,
              deadLine: null
            },
            empDetails: {
              id: null,
              jobLevel: {
                id: null,
                name: null,
                titleLevel: null,
                enabled: null,
                createDate: null
              },
              department: {
                id: null,
                depPath: null,
                enable: null,
                name: null,
                parent: null,
                parentId: null
              },
              idCard: null,
              nation: null,
              school: null,
              tiptopDegree: null,
              specialty: null,
              sex: null,
              email: null,
              birthDay: null,
            },
            accountNonExpired:true,
            credentialsNonExpired:true,
            accountNonLocked:true
          },
      dialogVisible: false,
      passwdDialogVisible: false
    }
  },
  mounted() {
    this.initHr();
  },
  methods: {
    onSuccess() {
      this.initHr();
    },
    updateHrInfo() {
      this.loading = true
      this.putRequest("/hr/info", this.hr2).then(resp => {
        if (resp) {
          this.dialogVisible = false;
          this.initHr();
        }
        this.loading = false
      })
    },
    showUpdateHrInfoView() {
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.ruleForm.hrid = this.hr.id;
          this.putRequest("/hr/pass", this.ruleForm).then(resp => {
            if (resp) {
              this.getRequest("/logout");
              window.sessionStorage.removeItem("user")
              this.$store.commit('initRoutes', []);
              this.$router.replace("/");
            }
            this.loading = false
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    showUpdatePasswdView() {
      this.passwdDialogVisible = true;
    },
    initHr() {
      this.loading = true
      this.getRequest('/emp/info').then(resp => {
        if (resp) {
          this.hr = resp;
          this.hr2 = Object.assign({}, this.hr);
          window.sessionStorage.setItem("user", JSON.stringify(resp));
          this.$store.commit('INIT_CURRENTHR', resp);
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
