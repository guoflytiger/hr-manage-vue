import {getRequest} from "./api"

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return
    }
    getRequest("/system/config/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data)
            router.addRoutes(fmtRoutes)
            store.commit('initRoutes', fmtRoutes)
        }
    })
}
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children)
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            component(resolve) {
                if (component.startsWith("Home")) {
                    // require(['../views/' + component + '.vue'], resolve);
                    require(['../components/common/' + component + '.vue'], resolve)
                } else if (component.startsWith("Emps")) {
                    require(['../components/page/emps/' + component + '.vue'], resolve)
                } else if (component.startsWith("Dept")) {
                    require(['../components/page/dept/' + component + '.vue'], resolve)
                } else if (component.startsWith("Emp")) {
                    require(['../components/page/emp/' + component + '.vue'], resolve)
                } else if (component.startsWith("Acc")) {
                    require(['../components/page/acc/' + component + '.vue'], resolve)
                } else if (component.startsWith("Per")||component.startsWith("Auth")) {
                    require(['../components/page/per/' + component + '.vue'], resolve)
                } else if (component.startsWith("Tran")) {
                    require(['../components/page/emp/' + component + '.vue'], resolve)
                }
            }
        }
        fmRoutes.push(fmRouter)
    })
    return fmRoutes
}