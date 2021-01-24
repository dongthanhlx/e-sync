// import React from 'react';
import NewProduct from './containers/new-product/new-product';
import MyProducts from './containers/my-products/my-products';
import EditProduct from './containers/my-products/edit-product/edit-product';

export const DASHBOARD_ANALYTIC_ROUTES = () => [
    // // This is an example for usage of child route
    // {
    //     isNavItem: true,
    //     title: 'Test route',
    //     children: [
    //         {
    //             isNavItem: true,
    //             title: 'Subroute 1',
    //             path: "/dashboard/test-route/sub-route-1",
    //             exact: true,
    //             component: () => <div>This is test route 1</div>,
    //         }, {
    //             isNavItem: true,
    //             title: 'Subroute 2',
    //             path: "/dashboard/test-route/sub-route-2",
    //             exact: true,
    //             component: () => <div>This is test route 2</div>,
    //         }
    //     ],
    // },
    {
        isNavItem: true,
        title: "Thêm sản phẩm",
        icon: "fa-cube",
        htmlTitle: 'E-sync - Thêm sản phẩm',
        path: "/dashboard/new-product",
        component: NewProduct,
        exact: true
    }, {
        isNavItem: true,
        title: "Danh sách sản phẩm",
        icon: "fa-cubes",
        htmlTitle: 'E-sync - Danh sách sản phẩm',
        path: "/dashboard/my-products",
        component: MyProducts,
        exact: true
    }, {
        isNavItem: false,
        title: "Sửa chi tiết",
        // icon: "fa-cubes",
        htmlTitle: 'E-sync - Sửa chi tiết',
        path: "/dashboard/my-products/edit-product",
        component: EditProduct,
        exact: true
    }
];