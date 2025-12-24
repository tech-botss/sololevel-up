import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useDeveloperRole() {
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDeveloperRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsDeveloper(false);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'developer')
          .maybeSingle();

        if (error) {
          console.error('Error checking developer role:', error);
          setIsDeveloper(false);
        } else {
          setIsDeveloper(!!data);
        }
      } catch (error) {
        console.error('Error checking developer role:', error);
        setIsDeveloper(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkDeveloperRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkDeveloperRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isDeveloper, isLoading };
}
