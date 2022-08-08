<template>
    <div class="my-tag">
        <el-tag
                :key="val"
                v-for="val in formData[`s${s.id}`]"
                closable
                :disable-transitions="false"
                @close="handleTagClose(val, `s${s.id}`)">
            {{val}}
        </el-tag>
        <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleTagInputConfirm(`s${s.id}`)"
                @blur="handleTagInputConfirm(`s${s.id}`)"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+新的值</el-button>
        <el-button type="danger" plain size="small" @click="onDeleteSelfBtnClick">删除</el-button>
    </div>
</template>

<script>
    export default {
        name: "MyTag",
        props: ["form", "s", "refForm"],
        data() {
             return {
                inputVisible: false,
                inputValue: '',
            }
        },
        computed: {
            formData: function () {
                return JSON.parse(JSON.stringify(this.$props.form));
            }
        },
        methods: {
            /**
             * 标签值删除
             */
            handleTagClose: function (tag, name) {
                // 移除对应数据
                let data = this.formData;
                data[name].splice(data[name].indexOf(tag), 1);
                // 刷新父级数据
                this.$emit("update:form", data);
                // 触发校验规则
                this.$nextTick(_ => {
                    this.refForm.validateField(name);
                });
            },

            /**
             * 输入框失去焦点事件
             */
            handleTagInputConfirm: function (name) {
                let inputValue = this.inputValue;
                if (inputValue) {
                    let data = this.formData;
                    // 查重
                    if(data[name].indexOf(inputValue) !== -1) {
                        this.$message.warning("重复值！");
                    } else {
                        data[name].push(inputValue);
                        this.$emit("update:form", data);
                        // 表单验证
                        this.$nextTick(_ => {
                            this.refForm.validateField(name);
                        });
                    }
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
            //删除自身按钮事件
            onDeleteSelfBtnClick: function () {
                // 消除对应规格
                this.$emit("delete", this.$props.s.id);
            }
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