import React from 'react';
import {Redirect} from 'react-router-dom';
import DashboardRoute from "./dashboard-route/dashboard-route";

export const APP_ROUTES = () => [
    {
        path: "/",
        exact: true,
        auth: false,
        component: () => ( <Redirect to="/dashboard" /> ),
    }, {
        path: "/dashboard",
        exact: false,
        auth: true,
        component: DashboardRoute,
    }
];
