<template>
    <el-dialog
        title="新增商品"
        :visible.sync="visible"
        width="50%"
        :before-close="onCancelBtnClick"
        :close-on-click-modal="false"
    >
        <!-- 步骤条 -->
        <el-steps :active="step" finish-status="success" simple class="step-box">
            <el-step title="基本信息" icon="fa fa-id-card-o"></el-step>
            <el-step title="规格参数SPU" icon="fa fa-tags"></el-step>
            <el-step title="SKU属性" icon="fa fa-tasks"></el-step>
            <el-step title="库存价格" icon="fa fa-money"></el-step>
        </el-steps>

        <!-- 基本信息表单 -->
        <el-form
                :model="ruleForm0"
                status-icon
                :rules="rules.baseInfoValidate"
                ref="ruleForm0"
                :hidden="step !== 0"
                label-width="160px">
            <el-form-item label="商品分类" prop="categories">
                <el-cascader
                        v-model="ruleForm0.categories"
                        :options="categoriesOptions"
                        placeholder="请选择"
                        @change="onCategoriesChange"
                />
            </el-form-item>
            <el-form-item label="商品品牌名称" prop="brandName">
                <el-select v-model="ruleForm0.brandName" placeholder="请选择">
                    <el-option
                            v-for="b in brandList"
                            :key="b.id"
                            :label="b.name"
                            :value="b.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品昵称" prop="productName">
                <el-input type="text" v-model="ruleForm0.productName" autocomplete="off" placeholder="请填写商品名称"/>
            </el-form-item>

            <el-form-item label="商品描述" prop="description" class="description">
                <!-- 富文本编辑框 -->
                <quill-editor v-model="ruleForm0.description"
                              :options="editorDescriptionOption"
                              @blur="onDescriptionBlur($event)">
                </quill-editor>
            </el-form-item>
        </el-form>

        <!-- 规格参数表单 -->
        <el-form
                class="specification-Info-form"
                :model="ruleForm1"
                status-icon
                :rules="rules.specificationInfoValidate"
                ref="ruleForm1"
                :hidden="step !== 1"
                label-width="160px">
            <el-form-item
                    v-for="s in specificationList"
                    :key="s.id"
                    :label="s.name"
                    :prop="`s${s.id}`">
                <!-- 根据规格类型 -->
                <!-- 字符串 -->
                <el-input
                        class="specification-Info-form-item"
                        type="text"
                        v-model="ruleForm1[`s${s.id}`]"
                        :placeholder="`请输入${s.name}`"
                        v-if="s.type === 1"
                        autocomplete="off"/>

                <!-- 数值 -->
                <el-input
                        class="specification-Info-form-item"
                        type="number"
                        v-model="ruleForm1[`s${s.id}`]"
                        :placeholder="`请输入${s.name}的值`"
                        v-if="s.type === 2"
                        autocomplete="off">
                    <template slot="append">{{s.unit}}</template>
                </el-input>

                <!-- 列表选择 -->
                <el-select
                        class="specification-Info-form-item"
                        v-model="ruleForm1[`s${s.id}`]"
                        :placeholder="`请选择一个${s.name}`"
                        v-if="s.type === 3">
                    <el-option
                            v-for="(v, index) in s.values"
                            :key="index"
                            :label="v"
                            :value="v">
                    </el-option>
                </el-select>

                <!-- 列表选择且可自定义 -->
                <el-autocomplete
                        class="specification-Info-form-item"
                        v-model="ruleForm1[`s${s.id}`]"
                        :fetch-suggestions="(queryString, cb) => {autoList(queryString, cb, s.values)}"
                        :placeholder="`请输入或选择一个${s.name}`"
                        v-if="s.type === 4">

                </el-autocomplete>
            </el-form-item>
        </el-form>

        <!-- SKU属性 -->
        <el-form
                class="sku-Info-form"
                :model="ruleForm2"
                status-icon
                :rules="rules.sku"
                ref="ruleForm2"
                :hidden="step !== 2"
                label-width="100px">
            <el-row :gutter="20" class="operation">
                <el-col :span="12">
                    <el-input type="text" v-model="skuName" placeholder="请填写SKU名称" autocomplete="off" />
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="onAddSKUAttributeBtnClick">新增一条SKU属性</el-button>
                </el-col>
            </el-row>
            <el-form-item
                    v-for="s in skuList"
                    :key="s.id"
                    :label="s.name"
                    :prop="`s${s.id}`">
                <my-tag :form.sync="ruleForm2" :s="s" :ref-form="$refs.ruleForm2" @delete="deleteTagById" />
            </el-form-item>
        </el-form>

        <!-- 库存/价格 -->
        <div class="price" :hidden="this.step !== 3">
            <div class="operation">
                <el-button type="primary" @click="onResetBtnClick">重置组合</el-button>
            </div>
            <!-- 组合列表 -->
            <el-table
                :data="skuGroupList"
                max-height="400"
                style="width: 100%">
                <!-- 自定义的SKU -->
                <el-table-column
                        v-for="s in skuList"
                        :key="s.id"
                        :prop="`s${s.id}`"
                        :label="s.name">
                </el-table-column>
                <el-table-column
                        prop="original"
                        label="原价">
                    <template v-slot="scope">
                        <el-input
                            type="number"
                            v-model="scope.row.original"
                            autocomplete="=off"
                            size="small"
                            aria-placeholder="请输入原价"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="售价">
                    <template v-slot="scope">
                        <el-input
                            type="number"
                            v-model="scope.row.price"
                            autocomplete="=off"
                            size="small"
                            aria-placeholder="请输入售价"/>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="onDeleteBtnClick(scope.row, scope.$index)" type="danger" size="small" plain>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onPrevBtnClick" :disabled="this.step <= 0">上一步</el-button>
            <el-button :type="step === 3 ? 'success' : 'primary'"
                       @click="onNextBtnClick" >{{step === 3 ? '确认新增' : '下一步'}}
            </el-button>
        </span>
    </el-dialog>
</template>

<script>

    import MyTag from "@/components/MyTag";
    import {ADD_PRODUCT_INFO, DELETE_BRAND_INFO} from "@/store/mutation-types";
    export default {
        name: "AddDialog",
        components: {MyTag},
        props: ["visible", "data"],
        data() {
            return {
                step: 0,                    // 步骤条初始
                categoriesOptions: [],      // 级联菜单数据
                brandList: [],              // 商品品牌列表
                specificationList: [],      // 商品规格列表
                skuList: [],                // 自定义的sku列表
                skuGroupList:[],            // sku组合列表
                resetGroupList: [],         // 记录重置初始数据

                ruleForm0: {},              // 基本信息
                ruleForm1: {},              // 规格参数表单数据
                ruleForm2: {},              // SKU参数表单数据

                rules: {
                    // 基本信息
                    baseInfoValidate: {
                        categories: [
                            { required: true, message: '请选择商品分类', trigger: 'change' },
                        ],
                        brandName: [
                            { required: true, message: '请选择商品品牌', trigger: 'change' },
                        ],
                        productName: [
                            { required: true, message: '请输入商品名称', trigger: 'blur' },
                            { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur'}
                        ],
                        description: [  // 由于不是elementui中的控件，需要手动校验
                            { required: false, message: '请填写商品描述', trigger: 'blur' },
                        ]
                    },
                    specificationInfoValidate: {},
                    sku: {},
                },
                editorDescriptionOption: {  // 富文本框编辑数据
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike', 'link'],        // toggled buttons
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],               // 标题 custom button values
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                            [{ 'direction': 'rtl' }],                         // text direction
                            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                            ['clean']                                         // remove formatting button
                            ['image'], ['video'],
                        ],
                    },
                    placeholder: '请输入商品详细信息',
                },
                skuName: '',                // 填写的sku名称
                currSkuId: 0,               // 当前sku属性id
            }
        },
        watch: {
            "visible": function (visible) {
                if(visible) {
                    this.categoriesOptions = this.$props.data.categoriesOptions;
                    // console.log(this.categoriesOptions);
                }
            },
            /**
             * 监听sku属性变化
             */
            "ruleForm2": function (newVal, oldVal) {
                // 每次sku属性变更，重新刷新sku组合列表数据
                if(Object.keys(newVal).length !== 0) {
                    this.createSkuGroupList();
                }
            }
        },
        methods: {
            // 取消按钮点击事件
            onCancelBtnClick: function () {
                // 关闭模态框  父组件监听
                this.$emit('update:visible', false);
                // 重置data
                let oData = JSON.parse(JSON.stringify(this.$options.data()));
                delete oData.categoriesOptions;
                Object.assign(this.$data, oData);
                this.$nextTick(_ => {
                   this.$refs.ruleForm0.clearValidate();
                });
            },
            // 上一步按钮点击事件
            onPrevBtnClick: function() {
                this.step--;
            },
            // 下一步/确定按钮点击事件
            onNextBtnClick: function () {
                let status = true;
                if(this.step === 0) {
                    this.$refs.ruleForm0.validate((valid) => {
                        if(!valid) {
                            status = false;
                        } else {    // 校验通过
                            this.$nextTick(_ => {
                                this.$refs.ruleForm1.clearValidate();
                            });
                        }
                    });
                } else if(this.step === 1) {
                    this.$refs.ruleForm1.validate((valid) => {
                        if(!valid) status = false;
                    });
                } else if(this.step === 2) {
                    if(this.skuList.length === 0) {
                        this.$message.error('请至少添加一个SKU属性');
                        status = false;
                    } else {
                        this.$refs.ruleForm2.validate((valid) => {
                            if(!valid) status = false;
                        });
                    }
                } else if(this.step === 3) {
                    status = false;
                    let validate = true;
                    this.skuGroupList.forEach((value, index) => {
                        // 为空或者undefined都不通过
                        if(!value.original || !value.price) {
                            validate = false;
                        }
                    });
                    if(!validate) {
                        this.$message.error("请先将所有数据填写完毕!")
                    } else {

                        // 获取品牌名
                        let brandName = '';
                        this.brandList.forEach(value => {
                            if(value.id === this.ruleForm0.brandName) {
                                // console.log (value);
                                return brandName = value.name;
                            }
                        });
                        // 执行添加逻辑
                        this.$store.dispatch(ADD_PRODUCT_INFO, {
                            ...this.ruleForm0,
                            brandName,
                            spu: this.ruleForm1,
                            sku: {
                                skuList: this.skuList,
                                data: this.ruleForm2
                            },
                            prices: this.skuGroupList
                        });
                        console.log(brandName);
                        console.log(this.brandList);
                        console.log(this.ruleForm0);
                        console.log(this.ruleForm1);
                        console.log(this.ruleForm2);
                        console.log(this.skuList);
                        console.log(this.skuGroupList);
                        this.onCancelBtnClick();
                    }
                }
                if(status) ++this.step;
            },
            /**
             * 级联菜单变更事件
             * @param value
             */
            onCategoriesChange: function (value) {
                if(value === undefined) return;
                this.$axios.post('/allBrandNameList', {
                    id: value[2]
                })
                    .then(response => {
                        this.brandList = response.data;
                        this.getSpecificationList(value);
                    })
                    .catch(error => {
                        this.$message.error('网络连接失败，获取品牌列表数据失败!');
                    });
            },
            /**
             * 富文本框失去焦点事件
             * @param quill
             */
            onDescriptionBlur: function (quill) {
                // 手动验证
                this.$refs.ruleForm0.validateField('description');
            },
            /**
             * 列表提示
             * @param queryString
             * @param cb
             * @param values
             */
            autoList(queryString, cb, values) {
                // 调用callback返回建议列表数据
                cb(values.map(v => ({value: v})));
            },

            /**
             * 获取规格列表
             * @param value
             */
            getSpecificationList: function (value) {
                // 清空原本的ruleForm1表单数据
                this.ruleForm1 = {};
                this.$axios.post("/specificationList", {
                    id: value[2]
                })
                    .then(response => {
                        // 将state为false的屏蔽掉 -- 不允许修改
                        let list = response.data.filter(value => {
                            return value.state;     // state=true则返回value对象
                        });
                        // 置空规则
                        this.$set(this.rules, 'specificationInfoValidate', {});
                        this.specificationList = list;
                        list.forEach((value, index) => {
                            // 动态生成表单属性和验证规则
                            let [curVal, message] =['', ''];
                            // 生成message
                            switch (value.type) {
                                case 1:
                                case 2:
                                    message = "请填写该数据";
                                    break;
                                case 3:
                                    message = "请选择一项值"
                                    break;
                                case 4:
                                    message = "请选择或填写一项值"
                                    break;
                            }
                            // 动态生成表单属性 curVal 初始值
                            this.$set(this.ruleForm1, [`s${value.id}`], curVal);
                            // 生成验证规格
                            this.$set(this.rules.specificationInfoValidate, [`s${value.id}`], [
                                {required: true, message, trigger: 'change'}
                            ]);
                        });
                    })
                    .catch(error => {
                        this.$message.error("网络连接失败，获取规格列表数据失败！");
                    });
            },

            /**
             *  新增 SKU属性按钮点击事件
             */
            onAddSKUAttributeBtnClick: function () {
                if(this.skuName === '') {
                    this.$message.warning('请先填写SKU名称');
                } else {
                    // 去重
                    let repeat = false;
                    this.skuList.forEach((value, index) => {
                        if(value.name === this.skuName) {
                            repeat = true;
                            this.$message.error('SKU名称重复，添加失败！');
                        }
                    });
                    if(!repeat) {
                        let id = ++this.currSkuId;
                        this.skuList.push({
                            id,
                            name: this.skuName
                        });
                        // 动态添加表单属性
                        this.$set(this.ruleForm2, [`s${id}`], []);  // 置空
                        // 添加表单验证规则
                        this.$set(this.rules.sku, [`s${id}`], [
                            { required: true, message: '请至少填写一个值', trigger: 'blur' }
                        ]);
                        // 清空输入框的值skuName
                        this.skuName = '';
                    }
                }
            },
            /**
             * 消除 Tag逻辑
             * @param id
             */
            deleteTagById: function (id) {
                // 移除相应规则
                delete this.rules.sku[`s${id}`];
                // 移除对应属性
                delete this.ruleForm2[`s${id}`];
                // 从SKU列表中一出数据
                this.skuList.forEach((value, index) => {
                    if(value.id === id) this.skuList.splice(index, 1);
                });
                // 删除tag时
                // 重新刷新SKU组合列表数据
                this.createSkuGroupList();
            },
            /**
             * sku组合删除按钮点击事件
             * @param row
             * @param index
             */
            onDeleteBtnClick: function (row, index) {
                this.$confirm(`确定删除该组合？（删除后可重置组合）`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    this.skuGroupList.splice(index, 1);
                }).catch(() => {});
            },

            // 重置组合按钮事件
            onResetBtnClick: function () {
                this.$confirm(`确定重置该组合？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    this.skuGroupList = JSON.parse(JSON.stringify(this.resetGroupList));
                }).catch(() => {});
            },
            /**
             * 生成 sku组合数组
             */
            createSkuGroupList: function () {
                // 将自定义的SKU数据转换为二维数组
                let data = [];
                for(let s in this.ruleForm2) {
                    data.push(this.ruleForm2[s]);
                }

                // 定义SKU属性组合闭包
                function skuGroup() {
                    /**
                     * 使用reduce模拟笛卡尔乘积算法
                     * reduce会自动的一次将上一个处理的结果ret作为下一个逻辑的计算值 arr1
                     * @param arguments 待处理的二维数组
                     * @param function 执行的逻辑函数
                     * @param [[]] 初始值
                     */
                    return Array.prototype.reduce.call(arguments, function(arr1, arr2) {
                        let ret = [];
                        // 将arr1和arr2进行笛卡尔积，需要concat
                        arr1.forEach(a => {
                            arr2.forEach(b => {
                                // 【】 是因为合并后是数组
                                ret.push(a.concat([b]));
                            });
                        });
                        return ret;
                    }, [[]]);
                }

                // 将组合好的数据调整为表格所需的数据
                let endSkuList = [];
                skuGroup(...data).forEach(val => {
                    let obj = {};
                    val.forEach((value, index) => {
                        obj[`s${this.skuList[index].id}`] = value;
                    });
                    endSkuList.push(obj);
                });
                this.skuGroupList = endSkuList;
                this.resetGroupList = JSON.parse(JSON.stringify(endSkuList));       // 记录初始值
            },

        }
    }
</script>

<style scoped lang="scss">
    .step-box {
        margin: 20px 0;
        ::v-deep .el-step__icon {
            font-size: 18px;
        }
    }

    ::v-deep {

        .description {
            .ql-toolbar.ql-snow, .ql-container.ql-snow {
                border-color: #dcdfe6;
                &:hover {
                    border-color: #c0c4cc;
                }
            }
            &.is-error {
                .ql-toolbar.ql-snow, .ql-container.ql-snow {
                    border-color: #f56c6c;
                }
            }
            /* 对齐操作栏 */
            .ql-picker-label {
                display: flex;
                align-content: center;
            }
            .ql-color, .ql-background, .ql-align {
                .ql-picker-label {
                    line-height: 24px;
                }
            }

            .ql-editor {
                height: 20vh;
                ::before {
                    font-style: normal;
                    color: #c4c9d8;
                }
            }
        }
    }

    .specification-Info-form {
        max-height: 500px;
        overflow: auto;
        .specification-Info-form-item {
            width: 60%;
        }
    }

    .sku-Info-form {
        .operation {
            padding-left: 100px;
            margin-bottom: 20px;
        }
    }

    .price {
        padding: 0 100px;
        .operation {
            margin-bottom: 20px;
        }
    }
</style>