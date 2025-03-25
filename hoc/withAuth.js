import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const user = useSelector((state) => state.user.user);
        const navigate = useNavigate();

        React.useEffect(() => {
            if (!user) {
                navigate("/login"); // Redirect if not logged in
            }
        }, [user, navigate]);

        return user ? <WrappedComponent {...props} /> : null;
    };
};

export default withAuth;
