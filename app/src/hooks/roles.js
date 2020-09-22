import { useMemo } from 'react';
import { ENTITIES_ROLE_ENUM } from '../Store';

export const useEditor = role => {
  const isEditor = useMemo(
    () =>
      [ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(
        role,
      ),
    [role],
  );
  return isEditor;
};

export const useAdmin = role => {
  const isAdmin = useMemo(() => ENTITIES_ROLE_ENUM.ADMIN === role, [
    role,
  ]);

  return isAdmin;
};
