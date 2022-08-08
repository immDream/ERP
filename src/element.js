import Vue from 'vue';

import {
  Card,
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Header,
  Aside,
  Main,
  Container,
  Menu,
  Submenu,
  MenuItem,
  Dialog,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  MessageBox,
  Cascader,
  Pagination,
  Upload,
  Tree,
  Switch,
  Select,
  Option,
  Tag,
  Step,
  Steps,
  Autocomplete,
} from "element-ui";

Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Container);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Dialog);
Vue.use(Row);
Vue.use(Col);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Cascader);
Vue.use(Pagination);
Vue.use(Upload);
Vue.use(Tree);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tag);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Autocomplete);


Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;