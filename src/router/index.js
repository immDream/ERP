import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home'),
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('../views/index'),
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/product/categories/Categories'),
      },
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('../views/product/brand/Brand'),
      },
      {
        path: 'productList',
        name: 'ProductList',
        component: () => import('../views/product/productList/ProductList'),
      },
      {
        path: 'specification',
        name: 'Specification',
        component: () => import('../views/product/specification/Specification'),
      },
      {
        path: 'counter',
        name: 'Counter',
        component: () => import('../views/sale/Counter'),
      },
      {
        path: 'outOfStorage',
        name: 'OutOfStorage',
        component: () => import('../views/sale/OutOfStorage'),
      },
      {
        path: 'returnGoods',
        name: 'ReturnGoods',
        component: () => import('../views/sale/ReturnGoods'),
      },
      {
        path: 'sale',
        name: 'Sale',
        component: () => import('../views/statement/Sale'),
      },
      {
        path: 'purchase',
        name: 'Purchase',
        component: () => import('../views/statement/Purchase'),
      },
      {
        path: 'inventoryStatistics',
        name: 'InventoryStatistics',
        component: () => import('../views/statement/InventoryStatistics'),
      },
      {
        path: 'leave',
        name: 'Leave',
        component: () => import('../views/warehouse/Leave'),
      },
      {
        path: 'putIntoStorage',
        name: 'PutIntoStorage',
        component: () => import('../views/warehouse/PutIntoStorage'),
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('../views/system-setting/Department'),
      },
      {
        path: 'employees',
        name: 'Employees',
        component: () => import('../views/system-setting/Employees'),
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('../views/system-setting/Log'),
      },
      {
        path: 'positions',
        name: 'Positions',
        component: () => import('../views/system-setting/Positions'),
      },
      {
        path: 'resources',
        name: 'Resources',
        component: () => import('../views/system-setting/Resource'),
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('../views/system-setting/Role'),
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/system-setting/User'),
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
