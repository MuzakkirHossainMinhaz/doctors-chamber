import { useEffect, useState } from "react";

// Custom hook for localStorage with sync across tabs
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage change for key "${key}":`,
            error,
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

// Custom hook for sessionStorage
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (valueToStore === undefined) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Custom hook for managing form data with localStorage persistence
export const useFormStorage = (formId, initialData = {}) => {
  const [formData, setFormData] = useLocalStorage(
    `form_${formId}`,
    initialData,
  );

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateFields = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  const clearForm = () => {
    setFormData({});
  };

  return {
    formData,
    setFormData,
    updateField,
    updateFields,
    resetForm,
    clearForm,
  };
};

// Custom hook for managing user preferences
export const useUserPreferences = (defaultPreferences = {}) => {
  const [preferences, setPreferences] = useLocalStorage(
    "user_preferences",
    defaultPreferences,
  );

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updatePreferences = (updates) => {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const getPreference = (key, fallback = null) => {
    return preferences[key] !== undefined ? preferences[key] : fallback;
  };

  return {
    preferences,
    setPreferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
    getPreference,
  };
};

// Custom hook for managing shopping cart with localStorage
export const useShoppingCart = () => {
  const [cart, setCart] = useLocalStorage("shopping_cart", []);

  const addItem = (item) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + (item.quantity || 1),
              }
            : cartItem,
        );
      } else {
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeItem = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const isInCart = (itemId) => {
    return cart.some((item) => item.id === itemId);
  };

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  };
};

// Custom hook for managing recent searches
export const useRecentSearches = (maxItems = 10) => {
  const [searches, setSearches] = useLocalStorage("recent_searches", []);

  const addSearch = (searchTerm) => {
    if (!searchTerm || typeof searchTerm !== "string") return;

    setSearches((prev) => {
      const filtered = prev.filter(
        (search) => search.toLowerCase() !== searchTerm.toLowerCase(),
      );
      const updated = [searchTerm, ...filtered];
      return updated.slice(0, maxItems);
    });
  };

  const removeSearch = (searchTerm) => {
    setSearches((prev) => prev.filter((search) => search !== searchTerm));
  };

  const clearSearches = () => {
    setSearches([]);
  };

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches,
  };
};

// Custom hook for managing theme preference
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const applyTheme = (newTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    applyTheme,
  };
};

// Custom hook for managing language preference
export const useLanguage = (defaultLanguage = "en") => {
  const [language, setLanguage] = useLocalStorage("language", defaultLanguage);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return {
    language,
    setLanguage,
    changeLanguage,
  };
};

// Custom hook for managing cached API data
export const useCache = (ttl = 5 * 60 * 1000) => {
  // 5 minutes default TTL
  const [cache, setCache] = useLocalStorage("api_cache", {});

  const setCacheData = (key, data) => {
    setCache((prev) => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now(),
        ttl,
      },
    }));
  };

  const getCacheData = (key) => {
    const cached = cache[key];

    if (!cached) return null;

    const now = Date.now();
    const isExpired = now - cached.timestamp > cached.ttl;

    if (isExpired) {
      setCache((prev) => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
      return null;
    }

    return cached.data;
  };

  const clearCache = () => {
    setCache({});
  };

  const clearExpiredCache = () => {
    const now = Date.now();
    setCache((prev) => {
      const newCache = {};

      Object.entries(prev).forEach(([key, value]) => {
        if (now - value.timestamp <= value.ttl) {
          newCache[key] = value;
        }
      });

      return newCache;
    });
  };

  return {
    setCacheData,
    getCacheData,
    clearCache,
    clearExpiredCache,
  };
};

// Custom hook for managing notification preferences
export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage(
    "notification_preferences",
    {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      appointments: true,
      payments: true,
      updates: true,
    },
  );

  const updatePreference = (type, enabled) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: enabled,
    }));
  };

  const isEnabled = (type) => {
    return preferences[type] || false;
  };

  return {
    preferences,
    setPreferences,
    updatePreference,
    isEnabled,
  };
};
