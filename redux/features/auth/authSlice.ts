import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const getInitialAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }

  try {
    const stored = window.localStorage.getItem("shopping-auth");
    if (!stored) return { user: null, isAuthenticated: false };

    const parsed = JSON.parse(stored);
    return {
      user: parsed.user ?? null,
      isAuthenticated: Boolean(parsed.user),
    };
  } catch {
    return { user: null, isAuthenticated: false };
  }
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
