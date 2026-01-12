// Role-based authorization middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // Check if req.user exists and its role is included in allowedRoles
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Your role is not authorized to perform this action.",
      });
    }
    next();
  };
}

module.exports = authorizeRoles;