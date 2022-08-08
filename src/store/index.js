import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {
  GET_CATEGORIES_LIST,
  UPDATE_CATEGORIES_INFO,
  DELETE_CATEGORIES_INFO,
  ADD_CATEGORIES_INFO,

  GET_BRAND_LIST,
  CLEAR_BRAND_LIST,
  ADD_BRAND_INFO,
  UPDATE_BRAND_INFO,
  DELETE_BRAND_INFO,

  GET_SPECIFICATION_LIST,
  CLEAR_SPECIFICATION_LIST,
  ADD_SPECIFICATION_INFO,
  UPDATE_SPECIFICATION_INFO,
  DELETE_SPECIFICATION_INFO,

  GET_PRODUCT_LIST, ADD_PRODUCT_INFO, UPDATE_PRODUCT_INFO, DELETE_PRODUCT_INFO
} from "@/store/mutation-types";

export default new Vuex.Store({
  state: {
  },

  getters: {
  },

  mutations: {
  },

  actions: {  // 用来同后端进行数据异步处理
  },

  modules: {
    // 商品管理模块
    categories: {
      state: {
        categoriesList: [],       // 商品分类列表
      },
      mutations: {
        [GET_CATEGORIES_LIST](state, data) {
          state.categoriesList = data.data;
        },
        [UPDATE_CATEGORIES_INFO](state, data) {

          /**
           * 一个通用的处理数的闭包
           * @param list 要修改的数据
           */
          let update = function (list) {
            list.forEach((value, index) => {
              if(value.id === data.id) {
                let l = list[index];
                Vue.set(l, "name", data.name);
                Vue.set(list, index, l);
              }
            });
          };


          // 根据级别做出不同逻辑操作
          let level = data.level;
          if (level === 1) {
            // 查找对应一级分类
            update(state.categoriesList);
          } else if (level === 2) {
            // 获取对应一级编号
            let oneId = Math.floor(data.id / 10000) * 10000;
            // 遍历一级分类的子集
            state.categoriesList.forEach((value, index) => {
              // 找到对应一级数据
              if(value.id === oneId) {
                // 修改对应的二级数据
                update(state.categoriesList[index].children);
              }
            });
          } else {
            // 获取对应一级编号
            let oneId = Math.floor(data.id / 10000) * 10000;
            // 遍历一级分类的子集
            state.categoriesList.forEach((value, index) => {
              // 找到对应一级数据
              if(value.id === oneId) {
                // 获取对应的二级数据
                let twoId = Math.floor(data.id / 100) * 100;
                let twoList = state.categoriesList[index].children;
                // 遍历二级子集
                twoList.forEach((value1, index1) => {
                  if(value1.id === twoId) {
                    // 修改三级数
                    update(twoList[index1].children);
                  }
                });
              }
            });
          }
        },
        [DELETE_CATEGORIES_INFO](state, data) {
          /**
           * 一个通用的处理数的闭包
           * @param list 要修改的数据
           */
          let del = function (list) {
            list.forEach((value, index) => {
              if(value.id === data.id) {
                list.splice(index, 1);
              }
            });
          };


          // 根据级别做出不同逻辑操作
          let level = data.level;
          if (level === 1) {
            // 查找对应一级分类
            del(state.categoriesList);
          } else if (level === 2) {
            // 获取对应一级编号
            let oneId = Math.floor(data.id / 10000) * 10000;
            // 遍历一级分类的子集
            state.categoriesList.forEach((value, index) => {
              // 找到对应一级数据
              if(value.id === oneId) {
                // 修改对应的二级数据
                del(state.categoriesList[index].children);
              }
            });
          } else {
            // 获取对应一级编号
            let oneId = Math.floor(data.id / 10000) * 10000;
            // 遍历一级分类的子集
            state.categoriesList.forEach((value, index) => {
              // 找到对应一级数据
              if(value.id === oneId) {
                // 获取对应的二级数据
                let twoId = Math.floor(data.id / 100) * 100;
                let twoList = state.categoriesList[index].children;
                // 遍历二级子集
                twoList.forEach((value1, index1) => {
                  if(value1.id === twoId) {
                    // 修改三级数
                    del(twoList[index1].children);
                  }
                });
              }
            });
          }
        },
        [ADD_CATEGORIES_INFO](state, data) {
          // 根据级别做出不同逻辑操作
          let level = data.level;

          /**
           * 一个通用的处理数的闭包
           * @param list 要增加的数据
           * @param increase 编号递增值
           * @param standById 备用编号
           */
          let add = function (list, increase, standById = null) {
            let id = 0;
            // 获取当前数组最大id
            if(standById === null) {
              let maxId = list[list.length - 1].id;
              id = maxId + increase;
            } else {
              id = standById + increase;
            }
            // 添加数据
            list.push({
              id,
              level,
              name: data.childName
            });
          };

          if (level === 1) {
            let stand = null;
            if(state.categoriesList.length === 0) stand = 0;
            // 查找对应一级分类
            add(state.categoriesList, 10000, stand);
          } else if (level === 2) {
            // 获取对应一级编号
            let oneId = Math.floor(data.id / 10000) * 10000;
            // 遍历一级分类的子集
            state.categoriesList.forEach((value, index) => {
              // 找到对应一级数据
              if(value.id === oneId) {
                // 增加指定数据
                if(state.categoriesList[index].children) {    // 子集存在
                  // 添加对应的二级数据
                  add(state.categoriesList[index].children, 100);
                } else {                                      // 子集不存在，需要新建子集
                  Vue.set(state.categoriesList[index], "children", []);
                  add(state.categoriesList[index].children, 100, value.id);
                }
              }
            });
          } else {
            // 获取对应一级编号
            let oneId = Math.floor(data.id / 10000) * 10000;
            // 遍历一级分类的子集
            state.categoriesList.forEach((value, index) => {
              // 找到对应一级数据
              if(value.id === oneId) {
                // 获取对应的二级数据
                let twoId = Math.floor(data.id / 100) * 100;
                let twoList = state.categoriesList[index].children;
                // 遍历二级子集
                twoList.forEach((value1, index1) => {
                  if(value1.id === twoId) {
                    // 增加指定数据
                    if(twoList[index1].children) {    // 子集存在
                      // 添加对应的二级数据
                      add(twoList[index1].children, 1);
                    } else {                                      // 子集不存在，需要新建子集
                      Vue.set(twoList[index1], "children", []);
                      add(twoList[index1].children, 1, value1.id);
                    }
                  }
                });
              }
            });
          }
        },
      },
      actions: {
        [GET_CATEGORIES_LIST](context, data) {
          // 发送令牌请求
          // Vue.prototype.$axios.post('categoriesList')
          //     .then(response => {
          //       // 提交 mutation
          //       context.commit(GET_CATEGORIES_LIST, {
          //         data: response.data
          //       });
          //     })
          //     .catch(error => {
          //       Vue.prototype.$message.error('网络连接错误！数据获取失败');
          //     });

          Vue.prototype.$axios("/categories")
              .then(response => {
                context.commit(GET_CATEGORIES_LIST, {
                  data: response.data.data,
              });
          });
        },
        [UPDATE_CATEGORIES_INFO](context, data) {
          // 向后端发送修改请求

          // 提交 mutation
          context.commit(UPDATE_CATEGORIES_INFO, {
            // 解耦表单数据 - 转换成数组，方便进行操作
            ...data.formData
          })
          Vue.prototype.$message.success("商品分类数据修改成功");
        },
        [DELETE_CATEGORIES_INFO](context, data) {
          // 向后端发送删除请求

          // 提交 mutation
          context.commit(DELETE_CATEGORIES_INFO, {
            ...data
          });
          Vue.prototype.$message.success("数据删除成功");
        },
        [ADD_CATEGORIES_INFO](context, data) {
          // 向后端发送新增请求

          // 提交 mutation
          context.commit(ADD_CATEGORIES_INFO, {
            ...data.formData,
          });
          Vue.prototype.$message.success("数据添加成功");
        },
      }
    },

    // 商品分类
    brand: {
      state: {
        dataList: [],             // 列表数据
        totalNumber: 0,           // 总条数
      },
      mutations: {
        [GET_BRAND_LIST](state, data) {
          state.dataList = data.list;
          state.totalNumber = data.totalNumber;
        },
        [CLEAR_BRAND_LIST](state, data) {
          state.dataList = [];
          state.totalNumber = 0;
        },
        [ADD_BRAND_INFO](state, data) {
          if(state.dataList.length >= 10) {
            // 先移除数组中的最后一个数据
            state.dataList.splice(state.dataList.length - 1, 1);
          }
          // 在数组第一位添加新数据 第二个参数为0为添加
          state.dataList.splice(0, 0, data);
        },
        [UPDATE_BRAND_INFO](state, data) {
          Vue.set(state.dataList, data.index, data.formData);
        },
        [DELETE_BRAND_INFO](state, data) {
          state.dataList.splice(data.index, 1);
        },
      },
      actions: {
        [GET_BRAND_LIST](context, data) {
          Vue.prototype.$axios.post('brandList', {
            ...data
          })
              .then(response => {
                // 提交mutation
                context.commit(GET_BRAND_LIST, {
                  // 根据上行数据来进行处理
                  list: response.data.data,
                  totalNumber: response.data.totalNumber
                });
              })
              .catch(error => {
                Vue.prototype.$message.error('网络连接错误，数据获取失败');
              });
        },
        [ADD_BRAND_INFO](context, data) {
          // 向后端发送新增请求 - 例如GET中

          let id = Date.now();   // 该 id从后端返回，这里是假数据
          // 提交 mutation
          context.commit(ADD_BRAND_INFO, {
            id,
            ...data.formData,
          });
          Vue.prototype.$message.success("新增数据成功!");
        },
        [UPDATE_BRAND_INFO](context, data) {
          // 向后端发送新增请求 - 例如GET中

          // 提交 mutation
          context.commit(UPDATE_BRAND_INFO, {
            ...data,
          });
          Vue.prototype.$message.success("修改数据成功!");
        },
        [DELETE_BRAND_INFO](context, data) {
          // 向后端发送请求
          // 提交mutation
          context.commit(DELETE_BRAND_INFO, {
            index: data.index
          });
          Vue.prototype.$message.success("数据删除成功");
        },
      }
    },

    // 商品规格
    specification: {
      state: {
        specificationList: [],        // 商品规格列表
      },
      mutations: {
        [GET_SPECIFICATION_LIST](state, data) {
          state.specificationList = data.data;
        },
        [CLEAR_SPECIFICATION_LIST](state, data) {
          state.specificationList = [];
        },
        [ADD_SPECIFICATION_INFO](state, data) {
          // 假数据id
          let maxId = 0;
          state.specificationList.forEach(value => {
            if(value.id > maxId) maxId = value.id;
          });
          data = {
            ...data,
            id: ++maxId
          };
          // 在数组第一位添加新的规格
          state.specificationList.splice(0, 0, data);
        },
        [UPDATE_SPECIFICATION_INFO](state, data) {
          Vue.set(state.specificationList, data.index, data.formData);
        },
        [DELETE_SPECIFICATION_INFO](state, data) {
          state.specificationList.splice(data.index, 1);
        },
      },
      actions: {
        [GET_SPECIFICATION_LIST](context, data) {
          Vue.prototype.$axios.post('specificationList', {
            ...data
          }).then(response => {
            // 提交mutation
            context.commit(GET_SPECIFICATION_LIST, {
              data: response.data
            });
          }).catch(error => {
            Vue.prototype.$message.error('数据获取失败');

          });
        },
        [ADD_SPECIFICATION_INFO](context, data) {
          // 向后端发送请求

          // 提交mutation
          context.commit(ADD_SPECIFICATION_INFO, {
            ...data.formData
          });
          Vue.prototype.$message.success("数据新增成功!");
        },
        [UPDATE_SPECIFICATION_INFO](context, data) {
          // 向后端

          // 提交mutation
          context.commit(UPDATE_SPECIFICATION_INFO, {
            ...data
          });
          Vue.prototype.$message.success("商品规格数据修改成功");
        },
        [DELETE_SPECIFICATION_INFO](context, data) {
          // 向后端

          // 提交mutation
          context.commit(DELETE_SPECIFICATION_INFO, {
            index: data.index
          });
          Vue.prototype.$message.success("商品规格数据删除成功");
        },
      }
    },

    // 商品列表
    productList: {
      state: {
        dataList: [],       // 列表数据
        totalNumber: 0, // 总条数
      },
      mutations: {
        [GET_PRODUCT_LIST](state, data) {
          state.dataList = data.dataList;
          state.totalNumber = data.totalNumber;
        },
        [ADD_PRODUCT_INFO](state, data) {
          if (state.dataList.length >= 10)
            // 先移除数组中最后一位
            state.dataList.splice(state.dataList.length - 1, 1);
          // 在数组第一位添新数据
          state.dataList.splice(0, 0, data);
        },
        [UPDATE_PRODUCT_INFO](state, data) {
          Vue.set(state.dataList, data.index, data)
          // console.log(data);
        },
        [DELETE_PRODUCT_INFO](state, data) {
          state.dataList.splice(data.index, 1);
        },
      },
      actions: {
        [GET_PRODUCT_LIST](context, data) {
          Vue.prototype.$axios.post('productList', {
            ...data
          }).then(response => {
            // 提交mutation
            // console.log(response.data);
            context.commit(GET_PRODUCT_LIST, {
              ...response.data
            });
          }).catch(error => {
            Vue.prototype.$message.error('数据获取失败');

          });
        },
        [ADD_PRODUCT_INFO](context, data) {
          // 从后端获取id

          let id = Date.now();

          context.commit(ADD_PRODUCT_INFO, {
            id,
            ...data
          });
          Vue.prototype.$message.success(" 新增商品成功!");
        },
        [UPDATE_PRODUCT_INFO](context, data) {
          // 在这里发送后端修改请求

          context.commit(UPDATE_PRODUCT_INFO, {
            ...data
          });
          Vue.prototype.$message.success(" 修改商品成功!");
        },
        [DELETE_PRODUCT_INFO](context, data) {
          // 在这里发送后端修改请求

          context.commit(DELETE_PRODUCT_INFO, {
            index: data.index
          });
          Vue.prototype.$message.success("商品删除成功!");
        },
      }
    }
  }
})
