const authorization = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role || req.user.role === "admin" )){
            return res.status(401).json({message:"Unauthorized"})
        }
        next()
    }
}

export default authorization