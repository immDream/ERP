import Vue from 'vue'

/**
 * 科学计数法
 * @param num
 */
function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

Vue.prototype.$toThousands = toThousands;