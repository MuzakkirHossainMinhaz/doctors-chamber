import "@testing-library/jest-dom";

// Polyfill for TextEncoder and TextDecoder
import { TextDecoder, TextEncoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Firebase
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({
    auth: jest.fn(),
    firestore: jest.fn(),
    storage: jest.fn(),
    functions: jest.fn(),
  })),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    signOut: jest.fn(),
  })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock("firebase/functions", () => ({
  getFunctions: jest.fn(),
  httpsCallable: jest.fn(),
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "1" }),
  useLocation: () => ({
    pathname: "/",
    search: "",
    hash: "",
    state: null,
  }),
}));

// Mock react-firebase-hooks
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: () => [null, false],
  useSignInWithEmailAndPassword: () => [jest.fn(), false, null],
  useCreateUserWithEmailAndPassword: () => [jest.fn(), false, null],
  useSignInWithGoogle: () => [jest.fn(), false, null],
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  Toaster: () => null,
}));

// Mock Stripe
jest.mock("@stripe/stripe-js", () => ({
  loadStripe: jest.fn(() =>
    Promise.resolve({
      elements: jest.fn(),
      createPaymentMethod: jest.fn(),
    }),
  ),
}));

jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }) => children,
  CardElement: () => <div data-testid="card-element">Card Input</div>,
  useStripe: () => ({
    createPaymentMethod: jest.fn(() =>
      Promise.resolve({
        paymentMethod: { id: "test-payment-id" },
      }),
    ),
    confirmCardPayment: jest.fn(() =>
      Promise.resolve({
        paymentIntent: { status: "succeeded" },
      }),
    ),
  }),
  useElements: () => ({
    getElement: jest.fn(() => ({
      clear: jest.fn(),
      focus: jest.fn(),
    })),
  }),
}));

// Mock react-datepicker
jest.mock("react-datepicker", () => {
  return function MockDatePicker({ onChange, selected, ...props }) {
    return (
      <input
        data-testid="date-picker"
        type="date"
        onChange={(e) => onChange(new Date(e.target.value))}
        value={selected ? selected.toISOString().split("T")[0] : ""}
        {...props}
      />
    );
  };
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
global.scrollTo = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
