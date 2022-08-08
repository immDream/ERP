<template>
    <el-dialog
            title="修改商品规格信息"
            :visible.sync="visible"
            width="30%"
            :before-close="onCancelBtnClick"
            :close-on-click-modal="false"
    >
        <!-- 模态框上的表单 -->
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px">
            <el-form-item label="商品分类" prop="categories">
                <el-cascader
                        v-model="ruleForm.categories"
                        :options="categoriesOptions"
                        disabled
                />
            </el-form-item>
            <el-form-item label="商品规格名称" prop="name">
                <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品规格状态" prop="state">
                <el-switch v-model="ruleForm.state" ></el-switch>
            </el-form-item>
            <el-form-item label="规格数据类型" prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择">
                    <el-option label="字符串" :value="1"/>
                    <el-option label="数值" :value="2"/>
                    <el-option label="列表选择" :value="3"/>
                    <el-option label="列表选择且可自定义" :value="4"/>
                </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.type === 2" label="单位" prop="unit">
                <el-input type="number" v-model="ruleForm.unit" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="ruleForm.type === 3 || ruleForm.type === 4" label="规格列表值" prop="values">
                <el-tag
                        :key="val"
                        v-for="val in ruleForm.values"
                        closable
                        :disable-transitions="false"
                        @close="handleTagClose(val)">
                    {{val}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleTagInputConfirm"
                        @blur="handleTagInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+新的值</el-button>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onCancelBtnClick">取 消</el-button>
            <el-button type="primary" @click="onOkBtnClick">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>


    import {UPDATE_SPECIFICATION_INFO} from "@/store/mutation-types";

    export default {
        name: "UpdateDialog",
        props: ["visible", "data"],
        data() {
            let validateValues = (rule, value, callback) => {
                if(value.length <= 1) {
                    callback(new Error("至少填写两个值"));
                } else {
                    callback();
                }
            };

            return {
                ruleForm: {
                    categories: [],
                    name: '',
                    state: true,
                    type: '',
                    unit: '',
                    values: []
                },
                rules: {
                    name: [
                        { required: true, message: '请输入商品规格名称', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 - 10个字符', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请输入商品规格数据类型', trigger: 'blur' },
                    ],
                    values: [
                        { required: true, message: '至少填写两个列表值', trigger: 'blur' },
                        { validator: validateValues, trigger: 'change' },
                    ],
                },
                categoriesOptions: [],
                inputVisible: false,
                inputValue: ''
            }
        },
        watch: {
            /**
             * 监听提示框显示状态
             * @param newVal
             * @param oldVal
             */
            "visible": function (newVal, oldVal) {
                if(newVal) {
                    // 深复制
                    // 循环引用 后续解决，存在parent引用父节点
                    // let updateData = JSON.parse(JSON.stringify(this.$props.data));
                    let updateData = this.$props.data;
                    if(updateData.row.values === null) updateData.row.values = [];
                    if(updateData.row.unit === null) updateData.row.unit = '';
                    this.ruleForm = {
                        ...updateData.row,
                        categories: updateData.categoriesIdList
                    }
                    // 将数据转为级联菜单可用的数据
                    let convertListData = function (list) {
                        let data = [];
                        // 将 data转换为node，便于在el-tree中使用node.label
                        list.forEach(value => {
                            let obj = {};
                            obj.label = value.label;
                            obj.value = value.id;
                            data.push(obj);
                            if(value.children) obj.children = convertListData(value.children);
                        });
                        return data;
                    }
                    this.categoriesOptions = convertListData(updateData.categoriesData);
                }
            }
        },
        methods: {
            // 取消按钮点击事件
             onCancelBtnClick: function () {
                // 关闭模态框  父组件监听
                this.$emit('update:visible', false);

                // // 重置data数据
                Object.assign(this.$data, this.$options.data());
                // this.ruleForm = {categories: [],
                //     name: '',
                //     state: true,
                //     type: '',
                //     unit: '',
                //     values: []};
                this.$nextTick(_ => {
                    this.$refs.ruleForm.clearValidate();
                });
            },
            // 确定按钮点击事件
            onOkBtnClick: function () {
                this.$refs.ruleForm.validate((valid) => {
                    if(valid) {
                        this.$store.dispatch(UPDATE_SPECIFICATION_INFO, {
                            formData: this.ruleForm,
                            index: this.$props.data.index
                        });
                        this.onCancelBtnClick();
                    } else {
                        Vue.prototype.$message.error('数据提交失败');
                    }
                });
            },
            /**
             * 标签值删除
             */
            handleTagClose: function (tag) {
                this.ruleForm.values.splice(this.ruleForm.values.indexOf(tag), 1);
                // 触发校验规则
                this.$nextTick(_ => {
                    this.$refs.ruleForm.validateField('values');
                });
            },

            /**
             * 输入框失去焦点事件
             */
            handleTagInputConfirm: function () {
                let inputValue = this.inputValue;
                if (inputValue) {
                    // 查重
                    if(this.ruleForm.values.indexOf(inputValue) !== -1) {
                        this.$message.warning("重复值！");
                        return;
                    }
                    this.ruleForm.values.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            /**
             * 显示列表值
             */
            showInput: function () {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

        }
    }
</script>

<style scoped lang="scss">
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
    }
    .input-new-tag {
        width: 60px;
        margin-left: 10px;
    }
</style>