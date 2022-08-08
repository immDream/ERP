<template>
    <el-dialog
            title="修改商品品牌信息"
            :visible.sync="visible"
            width="40%"
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
                        :file-list="fileList"
                        ref="upload"
                >
                    <!-- 自定义文件缩略图 -->
<!--                    <div slot="file" slot-scope="{file}">-->
<!--                        <img-->
<!--                            class="el-upload-list__item-thumbnail"-->
<!--                            :src="file.url" alt=""-->
<!--                        >-->
<!--                    </div>-->
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

    import {UPDATE_BRAND_INFO} from "@/store/mutation-types";

    export default {
        name: "UpdateDialog",
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
                fileList: [],   // 文件上传列表
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
                    // 设置级联菜单数据
                    this.categoriesOptions = this.$props.data.categoriesOptions;
                    // 设置表单数据
                    this.ruleForm = {
                        categories: this.$props.data.categories,
                        ...JSON.parse(JSON.stringify(this.$props.data.row))
                    };
                    // 设置当前品牌图片
                    this.fileList = [
                        {
                            name: this.ruleForm.name,
                            url: `${this.$axios.defaults.baseURL}${this.ruleForm.logo}`
                        }
                    ];
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
                Object.assign(this.$data, this.$options.data());
                // 清除上传头像
                this.$refs.upload.clearFiles();
                this.isUpload = false;
            },
            // 确定按钮点击事件
            onOkBtnClick: function () {
                // 请求action
                this.$refs.ruleForm.validate((valid) => {
                    if(valid) {
                        this.$store.dispatch(UPDATE_BRAND_INFO, {
                            index: this.$props.data.index,
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
                    // 先清除原本列表中的数据
                    this.fileList = [];
                    this.$nextTick(() =>{
                        // 设置数据
                        this.ruleForm.logo = response.url;
                        this.fileList.push(file);
                        // 清空logo验证
                        this.$refs.ruleForm.clearValidate('logo');
                        this.$message.success("图片上传成功");
                    });
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

            /**
             * 文件移除回调
             * @param file
             * @param fileList
             */
            onRemove: function (file, fileList) {
                // 清除图片记录
                this.ruleForm.logo = null;
            },
        }
    }
</script>

<style scoped>

</style>