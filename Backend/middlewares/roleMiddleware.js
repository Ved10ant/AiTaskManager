const authorization = (...roles)=>{
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            if (req.user?.role !== "admin") {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }
        }
        next();
    };
}

export default authorization