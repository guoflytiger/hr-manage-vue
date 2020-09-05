<template>
    <div class="sidebar">
        <el-menu router unique-opened class="sidebar-el-menu" :default-active="onRoutes" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff">
            <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
                <template slot="title">
                    <i style="color: #409eff;margin-right: 5px" :class="item.iconCls"></i>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                    {{child.name}}
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        },
        routes() {
            return this.$store.state.routes;
        },
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
