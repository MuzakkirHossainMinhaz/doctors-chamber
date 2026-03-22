import { Alert, Button } from "react-bootstrap";
import {
  useSignInWithFacebook,
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import auth, { db } from "../../firebase.init.js";

const SocialLink = () => {
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [signInWithFacebook, facebookUser, facebookLoading, facebookError] =
    useSignInWithFacebook(auth);
  const [signInWithGithub, githubUser, githubLoading, githubError] =
    useSignInWithGithub(auth);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSocialSignIn = async (signInMethod, providerName) => {
    try {
      const result = await signInMethod();
      if (result?.user) {
        await setDoc(
          doc(db, "users", result.user.uid),
          {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName || result.user.email,
            role: "patient",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { merge: true },
        );
      }
      toast.success(`Successfully signed in with ${providerName}!`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(`Failed to sign in with ${providerName}: ${error.message}`);
    }
  };

  // Redirect if any social sign-in succeeds
  if (googleUser || facebookUser || githubUser) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      <Button
        onClick={() => handleSocialSignIn(signInWithGoogle, "Google")}
        variant="outline-danger"
        className="w-100 d-flex align-items-center justify-content-center gap-2"
        disabled={googleLoading}
      >
        <i className="bi bi-google fs-5"></i>
        <span>{googleLoading ? "Signing in..." : "Continue with Google"}</span>
      </Button>

      <Button
        onClick={() => handleSocialSignIn(signInWithFacebook, "Facebook")}
        variant="outline-primary"
        className="w-100 d-flex align-items-center justify-content-center gap-2"
        disabled={facebookLoading}
      >
        <i className="bi bi-facebook fs-5"></i>
        <span>
          {facebookLoading ? "Signing in..." : "Continue with Facebook"}
        </span>
      </Button>

      <Button
        onClick={() => handleSocialSignIn(signInWithGithub, "GitHub")}
        variant="outline-dark"
        className="w-100 d-flex align-items-center justify-content-center gap-2"
        disabled={githubLoading}
      >
        <i className="bi bi-github fs-5"></i>
        <span>{githubLoading ? "Signing in..." : "Continue with GitHub"}</span>
      </Button>

      {(googleError || facebookError || githubError) && (
        <Alert
          variant="danger"
          className="d-flex align-items-center gap-2 mt-3"
        >
          <i className="bi bi-exclamation-triangle"></i>
          {googleError?.message ||
            facebookError?.message ||
            githubError?.message}
        </Alert>
      )}
    </div>
  );
};

export default SocialLink;
