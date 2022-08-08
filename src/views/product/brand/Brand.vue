<template>
   <div class="brand">
       <el-breadcrumb separator="/">
           <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>商品管理</el-breadcrumb-item>
       </el-breadcrumb>

       <el-card class="box-card">
           <!-- 操作栏 -->
           <el-row :gutter="20">
               <el-col :span="8">
                   <el-cascader
                        v-model="categoriesVal"
                        :options="categoriesOptions"
                        @change="onCategoriesChange"
                        class="select-box"
                   />
               </el-col>
               <el-col :span="4">
                   <el-button type="primary" @click="onAddBrandBtnClick">添加品牌</el-button>
               </el-col>
           </el-row>

           <!-- 数据列表 -->
           <el-table
                   :data="brandDataList"
                   stripe border
                   row-key="id"
                   max-height="520px"
                   class="table-list">
               <el-table-column prop="name" label="名称"></el-table-column>
               <!-- logo名称即为id，所以不需要prop 下行数据中也不存在logo的字段 -->
               <el-table-column label="图标logo">
                   <template slot-scope="scope">
                        <img :src="`${$axios.defaults.baseURL}${scope.row.logo}`"
                             :alt="scope.row.name" class="logo"
                        />
                   </template>
               </el-table-column>
               <el-table-column prop="nickname" label="别名"></el-table-column>
               <el-table-column
                       label="操作"
                       width="240">
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

       <!-- 添加品牌模态框  -->
       <add-dialog :visible.sync="addDialog.visible" :data="addDialog.data"/>

       <!-- 修改模态框 -->
       <update-dialog :visible.sync="updateDialog.visible" :data="updateDialog.data"/>
   </div>
</template>

<script>
    import {
        CLEAR_BRAND_LIST, DELETE_BRAND_INFO,
        GET_BRAND_LIST,
        GET_CATEGORIES_LIST
    } from "@/store/mutation-types";
    import AddDialog from "@/views/product/brand/AddDialog";
    import UpdateDialog from "@/views/product/brand/UpdateDialog";

    export default {
        name: "Brand",
        components: {UpdateDialog, AddDialog},
        data() {
            return {
                categoriesVal: [],      // 级联框选择的值
                currPage: 1,            // 当前页码
                // 添加模态框
                addDialog: {
                    visible: false,     // 显示数据
                    data: null
                },
                // 修改模态框
                updateDialog: {
                    visible: false,
                    data: null
                }
            }
        },
        // 生命周期函数，组件销毁前
        beforeDestroy() {
            // 调教mutation，清空列表数据
            this.$store.commit(CLEAR_BRAND_LIST);
        },
        /*mounted() {
            /!*this.brandDataList = [
                {
                    id: 1,
                    name: '天梭',
                    nickname: 'TISSOT',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 2,
                    name: '天梭2',
                    nickname: 'SSSS',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 3,
                    name: '天梭3',
                    nickname: 'RRRR',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 4,
                    name: '天梭4',
                    nickname: 'TTTT',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 5,
                    name: '5',
                    nickname: '阿萨达',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 6,
                    name: '6',
                    nickname: '捱三顶五群',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 7,
                    name: '7',
                    nickname: '阿下次再玩',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 8,
                    name: '8',
                    nickname: '双打',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 9,
                    name: '12',
                    nickname: 'TISSOT',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 10,
                    name: '13',
                    nickname: '嗷嗷',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 11,
                    name: '141',
                    nickname: 'RRRR',
                    logo: 'static/brand-logo/1.jpg'
                },
                {
                    id: 12,
                    name: '阿萨达',
                    nickname: 'TTTT',
                    logo: 'static/brand-logo/1.jpg'
                },

            ];*!/
        },*/
        computed: {
            /**
             * 级联框数据
             */
            categoriesOptions: function () {
                // 级联菜单的数组
                let data = [];
                // 将store中的数据转换为级联菜单可用的数据
                let list = this.$store.state.categories.categoriesList;
                if(list.length === 0) // 请求 action
                    this.$store.dispatch(GET_CATEGORIES_LIST);

                list.forEach(item => {
                    let obj = {};
                    obj.value = item.id;
                    obj.label = item.name;
                    data.push(obj);
                    // 获取二级数据
                    let twoDataList = item.children;
                    if(twoDataList) {
                        let data2 = [];
                        obj.children = data2;
                        twoDataList.forEach(childItem => {
                            let obj2 = {};
                            obj2.value = childItem.id;
                            obj2.label = childItem.name;
                            data2.push(obj2);

                            // 获取三级数据
                            let threeDataList = childItem.children;
                            if(threeDataList) {
                                let data3 = [];
                                obj2.children = data3;
                                threeDataList.forEach(sonItem => {
                                    let obj3 = {};
                                    obj3.value = sonItem.id;
                                    obj3.label = sonItem.name;
                                    data3.push(obj3);
                                });
                            } else {
                                obj2.disabled = true;
                            }
                        });
                    } else {
                        // 没有二级数据则禁用
                        obj.disabled = true;
                    }
                });
                return data;
            },
            // 商品品牌列表数据
            brandDataList: function () {
                return this.$store.state.brand.dataList;
            },
            // 总条数
            totalNumber: function () {
                return this.$store.state.brand.totalNumber;
            }
        },
        methods: {

            /**
             * 级联菜单变更事件
             * @param value
             */
            onCategoriesChange: function (value) {
                // 每次搜索都从第一页显示
                this.currPage = 1;
                this.getDataByPageNumber(value[2], 1);
            },

            /**
             * 新增品牌点击事件
             */
            onAddBrandBtnClick: function () {
                if(this.categoriesVal.length === 0) {
                    this.$message.warning("请先选择商品");
                } else {
                    this.addDialog = {
                        visible: true,
                        data: {
                            categoriesVal: this.categoriesVal,
                            categoriesOptions: this.categoriesOptions,
                        }
                    }
                }
            },

            onDeleteBtnClick: function (row, index) {
                this.$confirm(`此操作将<span style="color: red">永久删除【${row.name}】</span>, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    // 请求 action
                    this.$store.dispatch(DELETE_BRAND_INFO, {
                        ...row,
                        index
                    });
                }).catch(() => {});
            },

            onUpdateBtnClick: function (row, index) {
                this.updateDialog = {
                    visible: true,
                    data: {
                        categories: this.categoriesVal,
                        categoriesOptions: this.categoriesOptions,
                        row,
                        index
                    }
                };
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
             * @param id
             * @param pageNumber
             */
            getDataByPageNumber: function (id, pageNumber) {
                if(this.categoriesVal.length === 0) {
                    this.$message.warning("请选择商品分类！");
                } else {
                    // 请求action
                    this.$store.dispatch(GET_BRAND_LIST, {
                        id,
                        currPage: pageNumber
                    });

                }
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

    .logo {
        height: 60px;
    }
</style>