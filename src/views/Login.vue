<template>
    <div class="login">
        <el-card class="login-box" :body-style="{display: 'flex', justifyContent: 'space-between', padding: 0}">

            <!-- 左侧表单 -->
            <div class="left">
                <!-- logo -->
                <i class="logo"></i>
                <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                    <h1 class="title">电商ERP管理系统</h1>
                    <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="loginForm.account" autocomplete="off">
                            <i slot="suffix" class="fa fa-user"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="登录密码" prop="pwd">
                        <el-input type="password" v-model="loginForm.pwd" autocomplete="off" show-password>
                            <i slot="suffix" class="fa fa-lock"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="login-btn" @click="submitForm('loginForm')">提交</el-button>
                        <el-button class="login-btn" @click="resetForm('loginForm')">重置</el-button>
                    </el-form-item>
                </el-form>

                <!-- 底部信息 -->
                <div class="info">
                    <span>ver 0.1 beta</span>
                    <span>by immDream</span>
                    <span>Copyright &copy; 2022-2023 Extreme Academy</span>
                </div>
            </div>

            <!-- 右侧图片 -->
            <div class="right"></div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            // 账号自定义验证
            var validateAccount = (rule, value, callback) => {
                let reg = /^[a-zA-z0-9]{4,12}$/;
                if (!reg.test(value)) {
                    callback(new Error('账号格式错误，4~12位英文或数字'));
                } else {
                    callback();
                }
            };
            // 密码验证
            var validatePwd = (rule, value, callback) => {
                let reg = /^\w{4,12}$/;
                if (!reg.test(value)) {
                    callback(new Error('密码格式错误，4~12位英文、数字或_!'));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    account: '',
                    pwd: ''
                },
                loginRules: {
                    account: [
                        { required: true, message: '账号不能为空', trigger: 'blur' },
                        { validator: validateAccount, trigger: 'change' }
                    ],
                    pwd: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { validator: validatePwd, trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {    // 发送登录请求
                        this.$axios.post('/login', {
                            ...this.loginForm
                        })
                            .then(response => {
                                let data = response.data;
                                if(data.status === -1) {
                                    this.$message.error("账号或密码错误，登陆失败");
                                } else {
                                    // 存储 session数据
                                    sessionStorage.setItem("isLogin", "true");
                                    sessionStorage.setItem("userName", data.userName);
                                    sessionStorage.setItem("roleName", data.roleName);
                                    this.$message({
                                        message: '登录成功',
                                        type: 'success'
                                    });
                                    this.$router.replace('/home');  // 跳转主页
                                }
                            })
                            .catch(error => {
                                this.$message.error(error);
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped lang="scss">
    i.fa {
        height: 100%;
        width: 25px;
        text-align: center;
        transition: all .3s;
        line-height: 40px;
        font-size: 16px;
    }

    .login {
        width: 100vw;
        height: 100vh;
        background-image: url("../assets/bg.png");
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-box {
        width: 1500px;
        border: none;
        overflow: visible;
        .left {
            padding-left: 20px;
            padding-top: 100px;
            width: 660px;
            position: relative;

            .logo {
                position: absolute;
                background-image: url("../assets/logo.png");
                background-size: 118px;
                width: 118px;
                height: 118px;
                top: -59px;
                left: calc(50% - 59px);
            }
            .title {
                color: #575757;
                font-size: 47px;
                text-align: center;
                font-weight: normal;
                margin-bottom: 100px;
            }

            .login-btn {
                width: 100%;
                margin: 0 0 20px 0;
            }
            .info > span {
                &:first-child {
                    margin-top: 140px;
                }
                display: block;
                text-align: center;
                color: #898989;
                font-size: 18px;
                line-height: 1.8em;
            }
        }
        .right {
            background-image: url("../assets/login-img.png");
            width: 779px;
            height: 831px;
            border-radius: 0 4px 4px 0;
        }
    }
</style>