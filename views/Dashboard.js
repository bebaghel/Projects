import React from "react";
import withAuth from "../hoc/withAuth";

const Dashboard = () => {
    return <h1>Dashboard - Protected Page</h1>;
};

export default withAuth(Dashboard);
