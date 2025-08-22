import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div>
            <h1>🌐 My App Layout</h1>
            <Outlet />
        </div>
    );
};

export default AppLayout;
