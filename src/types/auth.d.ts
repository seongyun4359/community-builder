import type { User } from "./user";

export type SocialProvider = "google" | "kakao";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignupProfileForm {
  nickname: string;
  profileImage?: string;
}

export interface AuthContextValue extends AuthState {
  loginWithSocial: (provider: SocialProvider) => Promise<void>;
  logout: () => void;
  updateProfile: (form: SignupProfileForm) => Promise<void>;
}
