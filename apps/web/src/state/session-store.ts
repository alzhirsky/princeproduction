'use client';

import { create } from 'zustand';
import type { Role } from '@prince/shared';

type Session = {
  role: Role;
  alias?: string;
};

interface SessionState {
  session: Session;
  setRole: (role: Role) => void;
  setAlias: (alias: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: { role: 'guest' },
  setRole: (role) => set((state) => ({ session: { ...state.session, role } })),
  setAlias: (alias) => set((state) => ({ session: { ...state.session, alias } }))
}));
