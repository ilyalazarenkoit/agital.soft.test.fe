export type User = {
  id: string;
  name: string;
  email: string;
  birth: string;
};

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

export function saveUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("auth_user");
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

export function removeUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_user");
  }
}

export function logout() {
  removeToken();
  removeUser();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"));
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
