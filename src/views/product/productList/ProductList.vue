<template>
    <div class="productList">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <!-- 操作栏 -->
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input placeholder="请输入商品名称" v-model="searchNameVal"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-cascader
                            v-model="searchCategoriesVal"
                            :options="categoriesOptions"
                            @change="(val) => onCategoriesChange(val, categoriesOptions)"
                            placeholder="请选择商品分类"
                            class="select-box"
                    />
                </el-col>
                <el-col :span="4">
                    <el-input placeholder="请输入商品品牌" v-model="searchBrandVal"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="onSearchBtnClick">查询</el-button>
                    <el-button type="primary" @click="onResetBtnClick">重置条件</el-button>
                    <el-button type="primary" @click="onAddProductBtnClick">新增商品</el-button>
                </el-col>
            </el-row>

            <el-table
                    :data="productDataList"
                    border stripe
                    max-height="740"
                    row-key="id"
                    class="table-list"
                    style="width: 100%">
                <el-table-column prop="productName" label="商品名称"></el-table-column>
                <el-table-column prop="categories" label="分类">
                    <template v-slot="scope">
                        <span>{{getCategoriesName(scope.row.categories)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="brandName" label="品牌"></el-table-column>
                <el-table-column label="操作" width="240">
                    <template slot-scope="scope">
                        <el-button @click="onUpdateBtnClick(scope.row, scope.$index)" type="primary" size="small" plain>修改</el-button>
                        <el-button @click="onDeleteBtnClick(scope.row, scope.$index)" type="danger" size="small" plain>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    layout="total, prev, pager, next, jumper"
                    :total="totalNumber"
                    @current-changer="onPageChange"
            ></el-pagination>
        </el-card>

        <!-- 新增商品对话框 -->
        <add-dialog :visible.sync="addDialog.visible" :data="addDialog.data" />
        <update-dialog :visible.sync="updateDialog.visible" :data="updateDialog.data" />
    </div>
</template>

<script>
    import {
        DELETE_PRODUCT_INFO,
        GET_CATEGORIES_LIST,
        GET_PRODUCT_LIST
    } from "@/store/mutation-types";
    import AddDialog from "@/views/product/productList/AddDialog";
    import UpdateDialog from "@/views/product/productList/UpdateDialog";

    export default {
        name: "ProductList",
        components: {UpdateDialog, AddDialog},
        data() {
            return {
                searchNameVal: '',          // 查询商品名称
                searchCategoriesVal: [],    // 查询商品种类
                searchBrandVal: '',         // 查询商品品牌
                // productDataList: [],        // 商品列表
                // totalNumber: 0,             // 数据总数
                currPage: 1,                // 当前页数

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
            // 获取级联框数据
            categoriesOptions: function ()  {
                let list = this.$store.state.categories.categoriesList;
                if(list.length === 0) {
                    // 请求 action
                    this.$store.dispatch(GET_CATEGORIES_LIST);
                }

                // 为了使得能够在树形结构中快速获取相应节点的父节点，这里便采用记录的方式，记录下每一节点的父节点
                /**
                 * 将树形结构的对象进行转换以适应 el-tree
                 * @param parent    父节点
                 * @param node      要转换的结点
                 * @param level     层级
                 * @returns {[]}
                 */
                let convertListDataByRecordParentNode = function (parent, node, level) {
                    let data = [];
                    // 将 data转换为node，便于在el-tree中使用node.label
                    node.forEach(value => {
                        let obj = {};
                        obj.value = value.id;
                        obj.label = value.name;
                        obj.level = value.level;
                        data.push(obj);
                        if(value.children) obj.children = convertListDataByRecordParentNode(obj, value.children, ++level);
                        else {
                            if(level !== 3) {
                                obj.disabled = true;
                            }
                        }
                    });
                    return data;
                }
                list = convertListDataByRecordParentNode(null, list, 1);
                return list;
            },
            // 列表数据
            productDataList: function () {
                return this.$store.state.productList.dataList;
            },
            totalNumber: function () {
                return this.$store.state.productList.totalNumber;
            }
        },
        methods: {
            /**
             * 级联菜单变更事件
             * @param value
             */
            onCategoriesChange: function (value) {

            },
            /**
             * 获取商品名称
             **/
            getCategoriesName: function(categoryVal) {
                return this.categoriesOptions[categoryVal[0] / 10000 - 1]
                            .children[categoryVal[1] / 100 % 100 - 1]
                            .children[categoryVal[2] % 100 - 1]
                            .label;
            },
            /**
             * 查询按钮点击事件
             */
            onSearchBtnClick: function () {
                this.getDataByPageNumber(1);
            },
            /**
             * 重置按钮点击事件
             */
            onResetBtnClick: function () {
                this.searchBrandVal = '';
                this.searchNameVal = '';
                this.searchCategoriesVal = [];
            },
            /**
             *  新增商品点击事件
             */
            onAddProductBtnClick: function () {
                this.addDialog = {
                    visible: true,
                    data: {
                        categoriesOptions: this.categoriesOptions,
                    }
                };
            },
            /**
             * 修改事件
             * @param row
             * @param index
             */
            onUpdateBtnClick: function (row, index) {
                this.updateDialog = {
                    visible: true,
                    data: {
                        ...row,
                        categoriesOptions: this.categoriesOptions,
                        index
                    }
                };
                console.log(index);
                console.log(row);
            },
            /**
             * delete
             * @param row
             * @param index
             */
            onDeleteBtnClick: function (row, index) {
                this.$confirm(`此操作将<span style="color: red">永久删除【${row.name}】</span>, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    // 请求 action
                    this.$store.dispatch(DELETE_PRODUCT_INFO, {
                       ...row,
                       index
                    });
                }).catch(() => {});
            },
            /**
             * 页码变更事件
             */
            onPageChange: function (pageNumber) {
                this.currPage = pageNumber;
                this.getDataByPageNumber(this.categoriesVal[2], pageNumber);
            },

            /**
             * 通过页码获取表格数据
             * @param pageNumber
             */
            getDataByPageNumber: function (pageNumber) {
                this.$store.dispatch(GET_PRODUCT_LIST, {
                    name: this.searchNameVal,
                    categories: this.searchCategoriesVal,
                    brand: this.searchBrandVal,
                    pageNumber
                });
                // this.productDataList = [
                //     {
                //         id: 1,
                //         productName: '测试aaaa',
                //         categories: [10000, 10100, 10101],
                //         brandId: 1,
                //         brandName: '康去吧',
                //         description: '<p>asdasdasd</p>',
                //         spu: {
                //             s1: '1231',
                //             s2: '真皮',
                //             s3: '12',
                //         },
                //         sku: {
                //             list: [
                //                 {
                //                     id: 1,
                //                     name: '颜色'
                //                 },
                //                 {
                //                     id: 2,
                //                     name: '钻石个数'
                //                 }
                //             ],
                //             data: {
                //                 s1: ['天蓝色', '深蓝色', '蓝色'],
                //                 s2: ['1', '3'],
                //             }
                //         },
                //         prices: [
                //             {
                //                 s1: '天蓝色',
                //                 s2: '1',
                //                 original: "3000",
                //                 price:'6000'
                //             },
                //             {
                //                 s1: '黑色',
                //                 s2: '2',
                //                 original: "2000",
                //                 price:'3000'
                //             },
                //         ],
                //     }
                // ]
            },
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
        margin: 20px 0;
    }

    .select-box {
        width: 100%;
    }
</style>