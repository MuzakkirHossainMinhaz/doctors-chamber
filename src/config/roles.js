// Role-based access control configuration for Abdullah's Chamber
// This system ensures proper separation between general users and admin users
// Designed for single doctor practice with database-managed roles

export const USER_ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
};

// Role-based permissions configuration
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    // Full system access
    canAccessAdminDashboard: true,
    canManageServices: true,
    canManageBookings: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageSystemSettings: true,
    canManageBilling: true,
    canViewReports: true,
    canAssignRoles: true,
    canBookAppointments: false, // Admins don't book appointments
    canManageProfile: true,
  },
  [USER_ROLES.DOCTOR]: {
    // Doctor-specific permissions
    canAccessAdminDashboard: true,
    canManageServices: true,
    canManageBookings: true,
    canManageUsers: false, // Cannot manage other users
    canViewAnalytics: true,
    canManageSystemSettings: false,
    canManageBilling: true,
    canViewReports: true,
    canAssignRoles: false,
    canBookAppointments: false, // Doctor doesn't book own appointments
    canManageProfile: true,
  },
  [USER_ROLES.PATIENT]: {
    // Patient-specific permissions
    canAccessAdminDashboard: false,
    canManageServices: false,
    canManageBookings: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canManageSystemSettings: false,
    canManageBilling: false,
    canViewReports: false,
    canAssignRoles: false,
    canBookAppointments: true,
    canManageProfile: true,
  },
};

// Route access control
export const PROTECTED_ROUTES = {
  "/admin": {
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR],
    fallbackPath: "/signin",
  },
  "/doctor-dashboard": {
    requiredRoles: [USER_ROLES.DOCTOR],
    fallbackPath: "/signin",
  },
  "/profile": {
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.PATIENT],
    fallbackPath: "/signin",
  },
  "/my-bookings": {
    requiredRoles: [USER_ROLES.PATIENT],
    fallbackPath: "/signin",
  },
  "/checkout": {
    requiredRoles: [USER_ROLES.PATIENT],
    fallbackPath: "/signin",
  },
  "/chat": {
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.PATIENT],
    fallbackPath: "/signin",
  },
  "/analytics": {
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR],
    fallbackPath: "/signin",
  },
};

// Helper functions for role checking
export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions ? rolePermissions[permission] : false;
};

export const canAccessRoute = (userRole, routePath) => {
  const routeConfig = PROTECTED_ROUTES[routePath];
  if (!routeConfig) return true; // Public route

  return routeConfig.requiredRoles.includes(userRole);
};

export const getRoleDisplayName = (role) => {
  const roleNames = {
    [USER_ROLES.ADMIN]: "Administrator",
    [USER_ROLES.DOCTOR]: "Doctor",
    [USER_ROLES.PATIENT]: "Patient",
  };
  return roleNames[role] || "Unknown";
};

export const getRoleColor = (role) => {
  const roleColors = {
    [USER_ROLES.ADMIN]: "#dc3545", // Red
    [USER_ROLES.DOCTOR]: "#007bff", // Blue
    [USER_ROLES.PATIENT]: "#28a745", // Green
  };
  return roleColors[role] || "#6c757d"; // Gray
};

// Role assignment rules
export const ROLE_ASSIGNMENT_RULES = {
  // Only admins can assign roles
  canAssignRoles: [USER_ROLES.ADMIN],

  // Role hierarchy for assignment
  assignableRoles: {
    [USER_ROLES.ADMIN]: [
      USER_ROLES.ADMIN,
      USER_ROLES.DOCTOR,
      USER_ROLES.PATIENT,
    ],
    [USER_ROLES.DOCTOR]: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT],
    [USER_ROLES.PATIENT]: [USER_ROLES.PATIENT],
  },

  // Default role for new users
  defaultRole: USER_ROLES.PATIENT,
};
