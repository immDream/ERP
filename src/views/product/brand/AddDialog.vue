<template>
    <el-dialog
            title="新增商品品牌信息"
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
            <el-form-item label="商品品牌名称" prop="name">
                <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品品牌昵称" prop="nickname">
                <el-input type="text" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品品牌图标" prop="logo">
<!--                <el-input type="text" v-model="ruleForm.logo" autocomplete="off" readonly></el-input>-->
                <!-- 上传图片 -->
                <el-upload
                        :action="`${$axios.defaults.baseURL}uploadLogo`"
                        list-type="picture-card"
                        :on-success="onSuccess"
                        :on-error="onError"
                        :disabled="isUpload"
                        ref="upload"
                >
                    <i slot="default" class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onCancelBtnClick">取 消</el-button>
            <el-button type="primary" @click="onOkBtnClick">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {ADD_BRAND_INFO} from "@/store/mutation-types";

    export default {
        name: "AddDialog",
        props: ["visible", "data"],
        data() {
            return {
                ruleForm: {},
                rules: {
                    name: [
                        { required: true, message: '请输入商品分类名称', trigger: 'blur' },
                        { min: 2, max: 6, message: '长度在 2 - 6个字符', trigger: 'change' }
                    ],
                    logo: [
                        {required: true, message: '请上传logo', trigger: 'change'}
                    ]
                },
                categoriesOptions: [],
                isUpload: false,
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
                    this.ruleForm.categories = this.$props.data.categoriesVal;
                    this.categoriesOptions = this.$props.data.categoriesOptions;
                }
            }
        },
        methods: {
            // 取消按钮点击事件
            onCancelBtnClick: function () {
                // 关闭模态框  父组件监听
                this.$emit('update:visible', false);
                // 清除校验结果
                // this.$refs.ruleForm.clearValidate();
                this.$nextTick(_ => {
                    this.$refs.ruleForm.clearValidate();
                });

                // 清除表单
                // this.ruleForm = {};
                // 重置上传状态
                // this.isUpload = false;
                // 以上更改为重置data
                Object.assign(this.$data, this.$options.data());

                // 清除上传头像
                this.$refs.upload.clearFiles();
            },
            // 确定按钮点击事件
            onOkBtnClick: function () {
                this.$refs.ruleForm.validate((valid) => {
                    if(valid) {
                        this.$store.dispatch(ADD_BRAND_INFO, {
                            categoriesId: this.ruleForm.categories[2],
                            formData: this.ruleForm,
                        });
                        this.onCancelBtnClick();
                    }
                });
            },
            /**
             * 文件上传成功
             * @param response
             * @param file
             * @param fileList
             */
            onSuccess: function (response, file, fileList) {
                if(response.status === -1) {
                    this.$message.error("图片上传失败!");
                } else {
                    // 禁止上传多张图片
                    this.isUpload = true;
                    // 设置数据
                    this.ruleForm.logo = response.url;
                    // 清空logo验证
                    this.$refs.ruleForm.clearValidate('logo');
                    this.$message.success("图片上传成功");
                }
            },
            /**
             * 图片上传失败
             * @param err
             * @param file
             * @param fileList
             */
            onError: function (err, file, fileList) {
                this.$message.error("图片上传失败");
            },
        }
    }
</script>

<style scoped>

</style>