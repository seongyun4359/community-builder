import type { User } from "./user";
import type { KakaoCallbackData } from "@/lib/auth";

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
  setUserFromKakao: (data: KakaoCallbackData) => void;
  logout: () => void;
  updateProfile: (form: SignupProfileForm) => Promise<void>;
}
