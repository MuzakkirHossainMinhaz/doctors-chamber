import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase.init";

// Define role constants
export const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
};

const useAuthRole = () => {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const determineRole = async () => {
      if (!user) {
        setUserRole(null);
        setRoleLoading(false);
        return;
      }

      try {
        // Check if user has role stored in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists() && userDoc.data().role) {
          // Use stored role if available
          setUserRole(userDoc.data().role);
        } else {
          // Default to patient for all new users
          // Roles will be assigned manually by admin from database
          const defaultRole = ROLES.PATIENT;

          // Store default role in Firestore
          await setDoc(
            doc(db, "users", user.uid),
            {
              role: defaultRole,
              email: user.email,
              displayName: user.displayName || user.email.split("@")[0],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { merge: true },
          );

          setUserRole(defaultRole);
        }
      } catch (error) {
        console.error("Error determining user role:", error);
        // Fallback to patient role
        setUserRole(ROLES.PATIENT);
      } finally {
        setRoleLoading(false);
      }
    };

    determineRole();
  }, [user]);

  // Permission checking functions
  const hasRole = (role) => {
    return userRole === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };

  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isDoctor = () => hasRole(ROLES.DOCTOR);
  const isPatient = () => hasRole(ROLES.PATIENT);

  // Feature access permissions
  const canAccessAdminDashboard = () => isAdmin() || isDoctor();
  const canManageServices = () => isAdmin() || isDoctor();
  const canManageBookings = () => isAdmin() || isDoctor();
  const canManageUsers = () => isAdmin();
  const canViewAnalytics = () => isAdmin() || isDoctor();
  const canBookAppointments = () => isPatient();
  const canManageProfile = () => true; // All authenticated users
  const canAssignRoles = () => isAdmin(); // Only admins can assign roles

  // Get user permissions object
  const getPermissions = () => ({
    accessAdminDashboard: canAccessAdminDashboard(),
    manageServices: canManageServices(),
    manageBookings: canManageBookings(),
    manageUsers: canManageUsers(),
    viewAnalytics: canViewAnalytics(),
    bookAppointments: canBookAppointments(),
    manageProfile: canManageProfile(),
    assignRoles: canAssignRoles(),
  });

  // Function to update user role (admin only)
  const updateUserRole = async (targetUserId, newRole) => {
    if (!isAdmin()) {
      throw new Error("Only administrators can assign roles");
    }

    try {
      await setDoc(
        doc(db, "users", targetUserId),
        {
          role: newRole,
          updatedAt: new Date(),
          roleAssignedBy: user.uid,
          roleAssignedAt: new Date(),
        },
        { merge: true },
      );

      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  };

  return {
    user,
    userRole,
    loading: loading || roleLoading,
    isAdmin,
    isDoctor,
    isPatient,
    hasRole,
    hasAnyRole,
    canAccessAdminDashboard,
    canManageServices,
    canManageBookings,
    canManageUsers,
    canViewAnalytics,
    canBookAppointments,
    canManageProfile,
    canAssignRoles,
    updateUserRole,
    getPermissions,
    ROLES,
  };
};

export default useAuthRole;
