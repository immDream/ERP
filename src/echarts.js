import Vue from 'vue'
import ECharts from 'vue-echarts'

import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

import 'echarts/lib/chart/line'         // 折线图
import 'echarts/lib/chart/bar'          // 柱状图
import 'echarts/lib/chart/radar'        // 雷达图
import 'echarts/lib/chart/pie'          // 饼图


Vue.component('v-chart', ECharts);

Vue.prototype.$echarts = ECharts;