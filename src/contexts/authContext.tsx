import React, {
  createContext,
  useEffect,
  useState,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

interface AuthContextInterface {
  user: User | null;
  loading: boolean;
}

const initialContextState: AuthContextInterface = {
  user: null,
  loading: true,
};

export const AuthContext =
  createContext<AuthContextInterface>(initialContextState);

const AuthContextProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;