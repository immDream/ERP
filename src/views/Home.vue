<template>
    <el-container>
        <el-aside width="200px">
            <!-- 菜单栏 -->
            <el-menu
                    default-active="/home/index"
                    background-color="#3b3755"
                    text-color="#938fad"
                    active-text-color="#fff"
                    unique-opened
                    router
                    >
                <el-menu-item index="index">
                    <i class="el-icon-location"></i>
<!--                    <i class="fa fa-home"></i>-->
                    <span slot="title">首页</span>
                </el-menu-item>
                <!-- 商品 -->
                <el-submenu index="2">
                    <template slot="title">
                        <i class="fa fa-suitcase"></i>
                        <span>商品管理</span>
                    </template>
                    <!-- url -->
                    <el-menu-item index="categories">
                        <i class="fa fa-cubes"></i>
                        <span slot="title">商品分类</span>
                    </el-menu-item>
                    <el-menu-item index="/home/brand">
                        <i class="fa fa-diamond"></i>
                        <span slot="title">商品品牌</span>
                    </el-menu-item>
                    <el-menu-item index="/home/specification">
                        <i class="fa fa-tags"></i>
                        <span slot="title">商品规格</span>
                    </el-menu-item>
                    <el-menu-item index="/home/productList">
                        <i class="fa fa-navicon"></i>
                        <span slot="title">商品列表</span>
                    </el-menu-item>
                </el-submenu>

                <!-- 销售 -->
                <el-submenu index="3">
                    <template slot="title">
                        <i class="fa fa-shopping-bag"></i>
                        <span>销售管理</span>
                    </template>
                    <el-menu-item index="/home/counter">
                        <i class="fa fa-gavel"></i>
                        <span slot="title">销售上柜</span>
                    </el-menu-item>
                    <el-menu-item index="/home/outOfStorage">
                        <i class="fa fa-paper-plane"></i>
                        <span slot="title">销售出库</span>
                    </el-menu-item>
                    <el-menu-item index="/home/returnGoods">
                        <i class="fa fa-paper-plane-o"></i>
                        <span slot="title">销售退货</span>
                    </el-menu-item>
                </el-submenu>

                <!-- 仓库管理 -->
                <el-submenu index="4">
                    <template slot="title">
                        <i class="fa fa-database"></i>
                        <span>仓库管理</span>
                    </template>
                    <el-menu-item index="/home/putIntoStorage">
                        <i class="fa fa-sign-in"></i>
                        <span slot="title">商品入库</span>
                    </el-menu-item>
                    <el-menu-item index="/home/leave">
                        <i class="fa fa-sign-out"></i>
                        <span slot="title">商品出库</span>
                    </el-menu-item>
                </el-submenu>

                <!-- 报表 -->
                <el-submenu index="5">
                    <template slot="title">
                        <i class="fa fa-area-chart"></i>
                        <span>报表查询</span>
                    </template>
                    <el-menu-item index="/home/sale">
                        <i class="fa fa-line-chart"></i>
                        <span slot="title">销售报表</span>
                    </el-menu-item>
                    <el-menu-item index="/home/purchase">
                        <i class="fa fa-bar-chart"></i>
                        <span slot="title">购进报表</span>
                    </el-menu-item>
                    <el-menu-item index="/home/inventoryStatistics">
                        <i class="fa fa-pie-chart"></i>
                        <span slot="title">库存统计</span>
                    </el-menu-item>
                </el-submenu>

                <!-- 系统 -->
                <el-submenu index="6">
                    <template slot="title">
                        <i class="fa fa-cog"></i>
                        <span>系统设置</span>
                    </template>
                    <el-menu-item index="/home/resources">
                        <i class="fa fa-sitemap"></i>
                        <span slot="title">资源管理</span>
                    </el-menu-item>
                    <el-menu-item index="/home/department">
                        <i class="fa fa-building"></i>
                        <span slot="title">部门管理</span>
                    </el-menu-item>
                    <el-menu-item index="/home/positions">
                        <i class="fa fa-mortar-board"></i>
                        <span slot="title">职位管理</span>
                    </el-menu-item>
                    <el-menu-item index="/home/employees">
                        <i class="fa fa-users"></i>
                        <span slot="title">员工管理</span>
                    </el-menu-item>
                    <el-menu-item index="/home/role">
                        <i class="fa fa-user-secret"></i>
                        <span slot="title">角色管理</span>
                    </el-menu-item>
                    <el-menu-item index="/home/user">
                        <i class="fa fa-user"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="/home/log">
                        <i class="fa fa-file-text"></i>
                        <span slot="title">日志管理</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-container>
            <!-- 头部内容 -->
            <el-header>
                <div class="left">
                    <img src="../assets/logo.png" alt="logo-header" />
                    <span>电商ERP管理系统</span>
                </div>
                <div class="right">
                    <span class="name">{{userName}},你好</span>
                    <span class="role">{{roleName}}</span>
                    <i class="el-icon-switch-button" @click="onLogoutClick"></i>
                </div>
            </el-header>
            <!-- 核心内容 -->
            <el-main>
                <router-view />
            </el-main>
        </el-container>
        <el-dialog
                title="提示"
                :visible.sync="logoutVisible"
                width="30vw"
        >
            <span>确定要登出账号吗？</span>
            <span slot="footer">
                <el-button @click="onCancelClick">取 消</el-button>
                <el-button type="primary" @click="onOkClick">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                userName: '',   // 用户
                roleName: '',   // 角色
                logoutVisible: false,   // 注销对话框显示
            }
        },
        mounted() { // 钩子
            // 判断是否登录
            if(!sessionStorage.getItem("isLogin")) {
                this.$message.warning("请先登录");
                this.$router.replace("/");
                return false;
            }
            this.userName = sessionStorage.getItem("userName");
            this.roleName = sessionStorage.getItem("roleName");

            // 初始 打开首页
            if(this.$router.history.current.fullPath !== '/home/index')
                this.$router.replace("/home/index");
        },
        methods: {
            // 注销点击事件
            onLogoutClick: function () {
                this.logoutVisible = true;
            },
            // 注销对话框取消
            onCancelClick: function () {
                this.logoutVisible = false;
            },
            // 注销对话框确定
            onOkClick: function () {
                this.onCancelClick();
                sessionStorage.removeItem("isLogin");
                sessionStorage.removeItem("userName");
                sessionStorage.removeItem("roleName");
                this.$router.replace("/");

            }
        }
    }
</script>

<style scoped lang="scss">
    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #5c5877;
        .left {
            img {
                font-size: 24px;
                width: 40px;
                vertical-align: middle;
                margin-right: 20px;
            }
        }
        .right {
            span {
                margin-right: 20px;
            }
            .role {
                color:#67c23a;
            }
            .el-icon-switch-button {
                cursor: pointer;
            }
        }
    }

    .el-aside {
        background-color: #D3DCE6;
        /*overflow: hidden;*/
        min-height: 100vh;
        /* 解决菜单子项超出1像素问题 */
        > .el-menu {
            border: none;
            min-height: 100%;
        }
        // 自定义图标
        .fa {
            margin-right: 5px;
            width: 24px;
            text-align: center;
            font-size: 18px;
            vertical-align: middle;
            color: #938fad;
        }
    }

    .el-menu-item.is-active {
        background-color: #534f71!important;    // 强制操作，禁止滥用
    }


    .el-main {
        background-color: #f5f6f9;
    }
</style>