import create from 'zustand'
import { persist } from 'zustand/middleware'
import { Store } from './../types/store'

export const useUserStore = create<Store>(
	persist(
		set => ({
			user: { info: null },
			setUser: (user: any) => set({ user }),
			sessionLoading: false,
			// setSessionLoading: (sessionLoading: any) =>
			// 	set({ sessionLoading }),
		}),
		{
			name: 'app-storage',
		}
	)
)
