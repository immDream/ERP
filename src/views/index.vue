<template>
    <el-row :gutter="40">
        <el-col :span="14">
            <el-card class="m-d">
                <v-chart :options="monthlySalesLineOption" theme="light"/>
            </el-card>

            <el-row :gutter="40">
                <el-col :span="12">
                    <el-card>
                        <v-chart :options="todaySalesBarOption"/>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card >
                        <v-chart :options="regionalSalesRadarOption"/>
                    </el-card>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="10">
            <!-- 数量统计 -->
            <el-card class="m-d">
                <span class="number-title">数量统计</span>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <div class="number-box put-into-storage">
                            <div class="left">
                                <span class="name">今日入库数</span>
                                <span>{{numberData.putIntoStorage}}</span>
                            </div>
                            <i class="fa fa-sign-in"></i>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="number-box out-of-storage">
                            <div class="left">
                                <span class="name">今日出库数</span>
                                <span>{{numberData.outOfStorage}}</span>
                            </div>
                            <i class="fa fa-sign-out"></i>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="number-box sale">
                            <div class="left">
                                <span class="name">今日销售额</span>
                                <span>￥{{sellNumber(numberData.sale)}}.00</span>
                            </div>
                            <i class="fa fa-shopping-bag"></i>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="number-box return-goods">
                            <div class="left">
                                <span class="name">今日销售额</span>
                                <span>{{numberData.returnGoods}}</span>
                            </div>
                            <i class="fa fa-send-o"></i>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
            <el-card>
                <v-chart :options="inventoryPieOption"/>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                monthlySalesLineOption: {},         // 月销量
                todaySalesBarOption: {},            // 今日销量
                regionalSalesRadarOption: {},       // 地区销量
                inventoryPieOption: {},             // 库存统计
                numberData: {
                    putIntoStorage: 2350,           // 入库数
                    outOfStorage: 1147,             // 出库数
                    sale: 11452.0,                  // 销售额
                    returnGoods: 15                 // 退货数
                }
            }
        },
        mounted() {
            this.monthlySalesLineOption = {
                title: {
                    text: '月销量曲线',
                    textStyle: {
                        color: '#5a6173'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['邮件营销', '广告']
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '邮件营销',
                        data: [150, 230, 224, 218, 135, 147, 260],
                        type: 'line'
                    },
                    {
                        name: '广告',
                        data: [20, 78, 455, 123, 254, 213, 151],
                        type: 'line',
                        areaStyle: {        // 渐变色
                            color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[{
                                offset: 0,
                                color: 'rgb(228, 116, 183)'
                            }, {
                                offset: 1,
                                color: 'rgba(228, 116, 183, 0)'
                            }]),
                        },  // 区域颜色
                        smooth: true
                    }
                ]
            };

            this.todaySalesBarOption = {
                title: {
                    text: '今日销量',
                    textStyle: {
                        color: '#5a6173'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: ['电脑', '珠宝首饰', '钟表', '家用电器', '服饰']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [120, 200, 150, 80, 70],
                        type: 'bar'
                    }
                ]
            };

            this.regionalSalesRadarOption = {
                title: {
                    text: '前三地区销量分布',
                    textStyle: {
                        color: '#5a6173'
                    }
                },
                tooltip: {},
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        { name: '电脑', max: 6500},
                        { name: '珠宝首饰', max: 16000},
                        { name: '钟表', max: 30000},
                        { name: '家用电器', max: 38000},
                        { name: '服饰', max: 52000}
                    ]
                },
                series: [{
                    type: 'radar',
                    areaStyle: {normal: {}},
                    data: [
                        {
                            value: [4300, 10000, 28000, 35000, 50000],
                            name: '北京'
                        },
                        {
                            value: [5000, 14000, 28000, 31000, 42000, 21000],
                            name: '上海'
                        },
                        {
                            value: [3500, 8951, 18500, 38000, 30000, 16700],
                            name: '广州'
                        }
                    ]
                }]
            };

            this.inventoryPieOption = {
                title: {
                    text: '库存统计',
                    textStyle: {
                        color: '#5a6173'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            { value: 335, name: '电脑' },
                            { value: 310, name: '服饰' },
                            { value: 274, name: '珠宝收拾' },
                            { value: 235, name: '钟表' },
                            { value: 400, name: '家用电器' }
                        ].sort(function (a, b) {
                            return a.value - b.value;
                        }),
                        roseType: 'radius',
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
            }
        },
        methods: {
            sellNumber: function (num) {
                return this.$toThousands(num);
            }
        }
    }
</script>

<style scoped lang="scss">

    .el-card {
        height: 400px;
        &.m-d {
            margin-bottom: 20px;
        }
    }

    .echarts {
        width: 100%;
    }

    .number-title {
        color: #5a6173;
        font-size: 18px;
        font-weight: 700;
        display: block;
        margin-bottom: 30px;
    }

    .number-box {
        height: 150px;
        background: #67c23a;
        border-radius: 10px;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;

        span {
            display: block;
            line-height: 1.6em;

            &.name {
                font-size: 24px;
            }
            + span {
                font-size: 32px;
            }
        }
        i {
            font-size: 36px;
        }

        &.put-into-storage {
            background: linear-gradient(to top, #37a2da, #32c5e9);
            margin-bottom: 20px;
        }

        &.out-of-storage {
            background: linear-gradient(to top, #fb7293, #ff9f7f);
            margin-bottom: 20px;
        }

        &.sale {
            background: linear-gradient(to top, #e062ae, #e690d1);
        }

        &.return-goods {
            background: linear-gradient(to top, #8378ea, #9d96f5);
        }
    }
</style>