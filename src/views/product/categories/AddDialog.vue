<template>
    <el-dialog
            title="新增商品分类信息"
            :visible.sync="visible"
            width="30%"
            :before-close="onCancelBtnClick"
            :close-on-click-modal="false"
    >
        <!-- 模态框上的表单 -->
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px">
            <el-form-item v-if="ruleForm.level > 1" label="父级商品分类名称" prop="name">
                <el-input type="text" v-model="ruleForm.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="新增子商品分类名称" prop="childName">
                <el-input type="text" v-model="ruleForm.childName" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onCancelBtnClick">取 消</el-button>
            <el-button type="primary" @click="onOkBtnClick">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {ADD_CATEGORIES_INFO} from "@/store/mutation-types";

    export default {
        name: "AddDialog",
        props: ["visible", "data"],
        data() {
            return {
                ruleForm: {},
                rules: {
                    childName: [
                        { required: true, message: '请输入商品分类名称', trigger: 'blur' },
                        { min: 2, max: 6, message: '长度在 2 - 6个字符', trigger: 'change' }
                    ]
                }
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
                    this.ruleForm = {
                        ...JSON.parse(JSON.stringify(this.$props.data))
                    };
                }
            }
        },
        methods: {
            // 取消按钮点击事件
            onCancelBtnClick: function () {
                // 关闭模态框  父组件监听
                this.$emit('update:visible', false);
                this.$nextTick(_ => {
                    this.$refs.ruleForm.clearValidate();
                });
            },
            // 确定按钮点击事件
            onOkBtnClick: function () {
                this.$refs.ruleForm.validate((valid) => {
                    if(valid) {
                        // 请求action
                        this.$store.dispatch(ADD_CATEGORIES_INFO, {
                            formData: this.ruleForm
                        });
                        this.onCancelBtnClick();
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>