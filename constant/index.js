const data = {
    data:[
        {
            id: 125,
            authName: '用户管理',
            children: [
                {
                    authName: '用户列表',
                    id: 521,
                    path: '/users'
                }
            ],
            path: 'users'
        },
        {
            id: 103,
            authName: '权限管理',
            path: 'rights',
            children: [
                {
                    authName: '角色列表',
                    id: 301,
                    path: '/roles'
                },
                {
                    authName: '权限列表',
                    id: 302,
                    path: '/rights'
                }
            ]
        },
        {
            id: 101,
            path: 'goods',
            authName: '商品管理',
            children: [
                {
                    authName: '商品列表',
                    id: 1,
                    path: '/goods'
                }
            ]
        },
        {
            id: 102,
            path: 'orders',
            authName: '订单管理',
            children: [
                {
                    id:'201',
                    authName:'订单列表',
                    path: '/orders'
                }
            ]
        },
        {
            id: 145,
            path: 'reports',
            authName: '数据统计',
            children: [
                {
                    id: 541,
                    authName: '数据报表',
                    path: '/reports'
                }
            ]
        }
    ],
    code: 200
}
exports.permission = data