import create from 'zustand'
import { persist } from 'zustand/middleware'
import { Store } from './../types/store'

export const useUserStore = create<Store>(
	persist(
		set => ({
			user: { picture: '/image/user.png' },
			setUser: (user: any) => set({ user }),
			// sessionLoading: false,
			taskGroupIndex: 0,
			setTaskGroupIndex: (
				taskGroupIndex: number
			) => set({ taskGroupIndex }),
			reset: () =>
				set({
					user: { picture: '/image/user.png' },
				}),
			// setSessionLoading: (sessionLoading: any) =>
			// 	set({ sessionLoading }),
		}),
		{
			name: 'app-storage',
		}
	)
)
