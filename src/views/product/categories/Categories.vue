<template>
    <div class="categories">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 操作栏 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="searchVal">
                        <el-button slot="append" icon="el-icon-search" @click="onSearchBtnClick"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="onAddCategoryBtnClick">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 数据列表 -->
            <el-table
                    :data="list"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="id"
                    border
                    stripe
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    class="table-list"
                    max-height="560"
            >
                <el-table-column prop="name" label="名称" />
                <el-table-column
                        label="操作"
                        width="240">
                    <template slot-scope="scope">
                        <el-button
                                @click="onAddBtnClick(scope.row)"
                                type="success"
                                size="small"
                                plain
                                v-if="scope.row.id % 100 === 0"
                        >新增</el-button>
                        <el-button @click="onUpdateBtnClick(scope.row)" type="primary" size="small" plain>修改</el-button>
                        <el-button @click="onDeleteBtnClick(scope.row)" type="danger" size="small" plain>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 修改为树形结构 -->
            <el-tree
                    :data="list"
                    :props="treeProps">

            </el-tree>
        </el-card>

        <!-- 修改信息模态框 -->
        <update-dialog :visible.sync="updateDialog.visible" :data="updateDialog.data" />

        <!-- 添加信息模态框 -->
        <add-dialog :visible.sync="addDialog.visible" :data="addDialog.data"/>
    </div>
</template>

<script>
    import {
        DELETE_CATEGORIES_INFO,
        GET_CATEGORIES_LIST,
    } from "@/store/mutation-types";
    import UpdateDialog from "@/views/product/categories/UpdateDialog";
    import AddDialog from "@/views/product/categories/AddDialog";

    export default {
        name: "Categories",
        components: {AddDialog, UpdateDialog},
        data() {
            return {
                // 树形数据显示的配置
                treeProps: {
                    label: 'text',
                    children: 'children'
                },
                searchVal: '',
                // 修改信息模态框
                updateDialog: {
                    visible: false,     // 显示数据
                    data: null
                },

                // 添加信息模态框
                addDialog: {
                    visible: false,     // 显示数据
                    data: null
                }
                // list: [{
                //     id: 10000,
                //     name: '钟表',
                //     children: [
                //         {
                //             id: 10100,
                //             name: '腕表',
                //             children: [
                //                 {
                //                     id:10101,
                //                     name: '瑞士腕表'
                //                 },
                //                 {
                //                     id:10102,
                //                     name: '国产腕表'
                //                 },
                //                 {
                //                     id:10103,
                //                     name: '日韩腕表'
                //                 },
                //                 {
                //                     id:10104,
                //                     name: '欧美腕表'
                //                 }
                //             ]
                //         },
                //         {
                //             id: 10200,
                //             name: '时钟',
                //             children: [
                //                 {
                //                     id: 10201,
                //                     name: '挂钟',
                //                 },
                //                 {
                //                     id: 10202,
                //                     name: '座钟',
                //                 },
                //                 {
                //                     id: 10203,
                //                     name: '闹钟',
                //                 }
                //             ]
                //         }
                //     ]
                // }, {
                //     id: 20000,
                //     name: '饰品',
                //     children: [
                //         {
                //             id: 20100,
                //             name: '潮搭',
                //             children: [
                //                 {
                //                     id: 20101,
                //                     name: '仅是仙林你'
                //                 }
                //             ]
                //         }
                //     ]
                // }]
            }
        },
        mounted() {
            // 请求action
            this.$store.dispatch(GET_CATEGORIES_LIST);
        },
        computed: {
            list: function () {
                console.log(this.$store.state.categories.categoriesList);
                return this.$store.state.categories.categoriesList;
            }
        },
        methods: {
            /**
             * 搜索按钮点击事件
             */
            onSearchBtnClick: function () {

            },

            /**
             * 添加分类
             */
            onAddCategoryBtnClick: function () {
                this.addDialog = {
                    visible: true,
                    data: {
                        level: 1
                    }
                }
            },

            /**
             * 添加信息按钮
             * @param row
             */
            onAddBtnClick: function (row) {
                this.addDialog = {
                    visible: true,
                    data: {
                        ...row,
                        level: row.level + 1          // 加一级，表示为子集
                    }
                }
            },

            /**
             * 更改信息按钮
             * @param row
             */
            onUpdateBtnClick: function (row) {
                this.updateDialog = {
                    visible: true,
                    data: row
                }
            },

            /**
             * 删除信息按钮
             * @param row
             */
            onDeleteBtnClick: function (row) {
                this.$confirm(`此操作将<span style="color: red">永久删除【${row.name}】</span>, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    // 请求 action
                    this.$store.dispatch(DELETE_CATEGORIES_INFO, row);
                }).catch(() => {});
            }
        }
    }
</script>

<style scoped lang="scss">
    .box-card {
        margin-top: 20px;
        /* 头部 60px + main上下内间距 20*2=40px + 面包屑 14px + card上下内间距 20*2=40px
         + card边框 1*2=2px */
        height: calc(100vh - 136px);
    }

    .table-list {
        margin-top: 20px;
    }
</style>