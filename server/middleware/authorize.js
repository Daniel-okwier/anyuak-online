module.exports = (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      if (roles.length === 0 || roles.includes(req.user.role)) {
        next();
      } else {
        return res.status(403).json({ msg: 'Not authorized for this role' });
      }
    };
  };