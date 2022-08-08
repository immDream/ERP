<template>
    <div class="specification">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品规格</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="20" style="margin-top: 20px">
            <!-- 左部 -->
            <el-col :span="6">
                <el-card class="box-card" body-style="height: calc(100% - 58px);box-sizing: border-box;overflow: auto">
                    <div slot="header" class="clearfix">
                        <span>选择商品分类查看对应规格模板</span>
                    </div>
                    <!-- 左部树形结构 -->
                    <el-tree
                            :data="categoriesData"
                            @node-click="onNodeClick"
                            node-key="id">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <!-- 图标渲染 -->
                                <span><i v-if="node.level === 1" class="fa fa-folder-o"></i></span>
                                <span><i v-if="node.level === 2" class="fa fa-folder-open-o"></i></span>
                                <span><i v-if="node.level === 3" class="fa fa-file-code-o"></i></span>
                                <!-- 结点名称 -->
                                <span class="node-text">{{ node.label }}</span>
                            </span>
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>规格模板列表</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="onAddBtnClick">添加规格模板</el-button>
                    </div>
                    <!-- 右部数据表格 -->
                    <el-table
                            :data="tableData"
                            border stripe
                            max-height="740"
                            row-key="id"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="规格名称">
                        </el-table-column>
                        <el-table-column
                                prop="type"
                                label="规格数据类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type === 1">字符串</span>
                                <span v-else-if="scope.row.type === 2">数值</span>
                                <span v-else-if="scope.row.type === 3">列表选择</span>
                                <span v-else-if="scope.row.type === 4">列表选择可自定义</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="state"
                                label="规格状态">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.state" disabled></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="160">
                            <template slot-scope="scope">
                                <el-button @click="onUpdateBtnClick(scope.row, scope.$index)" type="primary" size="small" plain>修改</el-button>
                                <el-button @click="onDeleteBtnClick(scope.row, scope.$index)" type="danger" size="small" plain>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <!-- 新增信息对挂框 -->
        <add-dialog :visible.sync="addDialog.visible" :data="addDialog.data"/>

        <!-- 修改信息对话框 -->
        <update-dialog :visible.sync="updateDialog.visible" :data="updateDialog.data"/>
    </div>
</template>

<script>
    import {
        CLEAR_SPECIFICATION_LIST,
        DELETE_SPECIFICATION_INFO,
        GET_CATEGORIES_LIST,
        GET_SPECIFICATION_LIST
    } from "@/store/mutation-types";
    import AddDialog from "@/views/product/specification/AddDialog";
    import UpdateDialog from "@/views/product/specification/UpdateDialog";

    export default {
        name: "Specification",
        components: {UpdateDialog, AddDialog},
        data() {
            return {
                categoriesIdList: [],        // 当前选择的分类编号集合
                // 新增信息模态框
                addDialog: {
                    visible: false,
                    data: null,
                },
                updateDialog: {
                    visible: false,
                    data: null,
                },
            }
        },
        computed: {
            // 商品分类树形结构数据
            categoriesData: function () {
                let list = this.$store.state.categories.categoriesList;
                if(list.length === 0) {
                    // 请求 action
                    this.$store.dispatch(GET_CATEGORIES_LIST);
                }

                // 转换 category数据以适应 el-tree
                /*let convertListData = function (list) {
                    let data = [];
                    // 将 data转换为node，便于在el-tree中使用node.label
                    list.forEach(value => {
                        let obj = {};
                        obj.id = value.id;
                        obj.label = value.name;
                        obj.level = value.level;
                        data.push(obj);
                        if(value.children) obj.children = convertListData(value.children);
                    });
                    return data;
                }*/

                // 为了使得能够在树形结构中快速获取相应节点的父节点，这里便采用记录的方式，记录下每一节点的父节点
                /**
                 * 将树形结构的对象进行转换以适应 el-tree
                 * @param parent    父节点
                 * @param node      要转换的结点
                 * @returns {[]}
                 */
                let convertListDataByRecordParentNode = function (parent, node) {
                    let data = [];
                    // 将 data转换为node，便于在el-tree中使用node.label
                    node.forEach(value => {
                        let obj = {};
                        obj.id = value.id;
                        obj.label = value.name;
                        obj.level = value.level;
                        obj.parent = parent;
                        data.push(obj);
                        if(value.children) obj.children = convertListDataByRecordParentNode(obj, value.children);
                    });
                    return data;
                }
                return convertListDataByRecordParentNode(null, list);
            },

            tableData: function () {
                return this.$store.state.specification.specificationList;
            }
        },
        beforeDestroy() {
            this.$store.commit(CLEAR_SPECIFICATION_LIST);
        },
        methods: {
            /**
             * 树形结构点击事件
             * @param data
             */
            onNodeClick: function (data) {
                // 获取父节点并存储在categoriesIdList中
                let getParentNode = (node) => {
                    if(node !== null) {
                        getParentNode(node.parent);
                        this.categoriesIdList.push(node.id);
                    }
                }

                if(data.level === 3) {
                    // 获取祖先结点列表
                    getParentNode(data);
                    this.$store.dispatch(GET_SPECIFICATION_LIST, {
                        id: data.id
                    });
                }
            },
            onAddBtnClick: function () {
                if(this.categoriesIdList.length === 0) {
                    this.$message.error("请先选择左侧商品分类!");
                } else {
                    this.addDialog = {
                        visible: true,
                        data: {
                            categoriesIdList: this.categoriesIdList,
                            categoriesData: this.categoriesData
                        }
                    }
                }
            },
            onUpdateBtnClick: function (row, index) {
                this.updateDialog = {
                    visible: true,
                    data: {
                        row,
                        index,
                        categoriesIdList: this.categoriesIdList,
                        categoriesData: this.categoriesData
                    }
                };
            },
            onDeleteBtnClick: function (row, index) {
                this.$confirm(`此操作将<span style="color: red">永久删除【${row.name}】</span>, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    // 请求 action
                    this.$store.dispatch(DELETE_SPECIFICATION_INFO, row);
                }).catch(() => {});
            }
        },
    }
</script>

<style scoped lang="scss">
    /* 为了解决深度样式 在class中__双下划线 */
    ::v-deep {
        .el-tree-node__content {
            padding: 5px 0;
        }
    }

    .box-card {
        /*header 60px + (padding上下 20px+20px) + breadcrumb 14px + card上下边框2px + 行的上外间距20px*/
        height: calc(100vh - 136px);
    }

    .custom-tree-node {
        font-size: 14px;
        .node-text {
            padding-left: 10px;
        }
    }
</style>