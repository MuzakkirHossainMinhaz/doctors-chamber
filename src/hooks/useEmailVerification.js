import { sendEmailVerification } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { auth, db } from "../firebase.init";

export const ACCOUNT_STATUS = {
  PENDING_VERIFICATION: "pending_verification",
  VERIFIED: "verified",
  SPAM: "spam",
  SUSPENDED: "suspended",
};

export const VERIFICATION_TIME_LIMIT = 24; // hours

const useEmailVerification = () => {
  const [user, loading] = useAuthState(auth);
  const [accountStatus, setAccountStatus] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAccountStatus();
    } else {
      setAccountStatus(null);
      setTimeRemaining(null);
      setStatusLoading(false);
    }
  }, [user]);

  const checkAccountStatus = async () => {
    if (!user) return;

    setStatusLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const status =
          userData.accountStatus || ACCOUNT_STATUS.PENDING_VERIFICATION;
        const createdAt = userData.createdAt?.toDate();

        // Check if account is pending verification and time limit exceeded
        if (status === ACCOUNT_STATUS.PENDING_VERIFICATION && createdAt) {
          const timeElapsed = Date.now() - createdAt.getTime();
          const hoursElapsed = timeElapsed / (1000 * 60 * 60);

          if (hoursElapsed >= VERIFICATION_TIME_LIMIT) {
            // Mark as spam automatically
            await updateDoc(doc(db, "users", user.uid), {
              accountStatus: ACCOUNT_STATUS.SPAM,
              statusChangedAt: serverTimestamp(),
              statusChangedReason: "Verification time limit exceeded",
            });
            setAccountStatus(ACCOUNT_STATUS.SPAM);
            setTimeRemaining(0);
          } else {
            // Calculate remaining time
            const remainingHours = VERIFICATION_TIME_LIMIT - hoursElapsed;
            setTimeRemaining(Math.max(0, remainingHours));
            setAccountStatus(status);
          }
        } else {
          setAccountStatus(status);
          setTimeRemaining(0);
        }
      } else {
        // New user, set default status
        await setDoc(
          doc(db, "users", user.uid),
          {
            accountStatus: ACCOUNT_STATUS.PENDING_VERIFICATION,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        setAccountStatus(ACCOUNT_STATUS.PENDING_VERIFICATION);
        setTimeRemaining(VERIFICATION_TIME_LIMIT);
      }
    } catch (error) {
      console.error("Error checking account status:", error);
      setAccountStatus(ACCOUNT_STATUS.PENDING_VERIFICATION);
    } finally {
      setStatusLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) return false;

    setVerificationLoading(true);
    try {
      await sendEmailVerification(user);

      // Update last verification email sent time
      await setDoc(
        doc(db, "users", user.uid),
        {
          lastVerificationEmailSent: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      toast.success("Verification email sent! Please check your inbox.");
      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email. Please try again.");
      return false;
    } finally {
      setVerificationLoading(false);
    }
  };

  const checkEmailVerified = async () => {
    if (!user) return false;

    try {
      // Reload user to get updated email verification status
      await auth.currentUser.reload();
      const isVerified = auth.currentUser.emailVerified;

      if (isVerified && accountStatus === ACCOUNT_STATUS.PENDING_VERIFICATION) {
        // Update account status to verified
        await setDoc(
          doc(db, "users", user.uid),
          {
            accountStatus: ACCOUNT_STATUS.VERIFIED,
            emailVerifiedAt: serverTimestamp(),
            statusChangedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );

        setAccountStatus(ACCOUNT_STATUS.VERIFIED);
        setTimeRemaining(0);

        toast.success(
          "Email verified successfully! Your account is now active.",
        );
        return true;
      }

      return isVerified;
    } catch (error) {
      console.error("Error checking email verification:", error);
      return false;
    }
  };

  const isVerified = () => {
    return accountStatus === ACCOUNT_STATUS.VERIFIED;
  };

  const isPendingVerification = () => {
    return accountStatus === ACCOUNT_STATUS.PENDING_VERIFICATION;
  };

  const isSpam = () => {
    return accountStatus === ACCOUNT_STATUS.SPAM;
  };

  const isSuspended = () => {
    return accountStatus === ACCOUNT_STATUS.SUSPENDED;
  };

  const canPerformAction = () => {
    return isVerified();
  };

  const getVerificationMessage = () => {
    switch (accountStatus) {
      case ACCOUNT_STATUS.PENDING_VERIFICATION:
        return `Please verify your email within ${VERIFICATION_TIME_LIMIT} hours. Time remaining: ${Math.floor(timeRemaining || 0)} hours`;
      case ACCOUNT_STATUS.VERIFIED:
        return "Your account is verified and active.";
      case ACCOUNT_STATUS.SPAM:
        return "Your account has been marked as spam due to verification timeout. Please contact support.";
      case ACCOUNT_STATUS.SUSPENDED:
        return "Your account has been suspended. Please contact support.";
      default:
        return "Account status unknown.";
    }
  };

  const getVerificationBadgeVariant = () => {
    switch (accountStatus) {
      case ACCOUNT_STATUS.PENDING_VERIFICATION:
        return "warning";
      case ACCOUNT_STATUS.VERIFIED:
        return "success";
      case ACCOUNT_STATUS.SPAM:
        return "danger";
      case ACCOUNT_STATUS.SUSPENDED:
        return "dark";
      default:
        return "secondary";
    }
  };

  // Admin functions for manual status updates
  const updateAccountStatus = async (newStatus, reason = "") => {
    if (!user) return false;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          accountStatus: newStatus,
          statusChangedAt: serverTimestamp(),
          statusChangedReason: reason,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setAccountStatus(newStatus);
      toast.success(`Account status updated to ${newStatus}`);
      return true;
    } catch (error) {
      console.error("Error updating account status:", error);
      toast.error("Failed to update account status");
      return false;
    }
  };

  return {
    user,
    accountStatus,
    loading: loading || statusLoading,
    verificationLoading,
    timeRemaining,
    isVerified,
    isPendingVerification,
    isSpam,
    isSuspended,
    canPerformAction,
    sendVerificationEmail,
    checkEmailVerified,
    checkAccountStatus,
    getVerificationMessage,
    getVerificationBadgeVariant,
    updateAccountStatus,
    ACCOUNT_STATUS,
    VERIFICATION_TIME_LIMIT,
  };
};

export default useEmailVerification;
