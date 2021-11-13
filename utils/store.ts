import { Itask } from 'types/fireTypes'
import create from 'zustand'
import { persist } from 'zustand/middleware'
// import { Store } from './../types/store'

export interface Store {
	user: any
	setUser: (user: any) => void
	taskGroupIndex: number
	setTaskGroupIndex: (
		taskGroupIndex: number
	) => void
	reset: () => void
	taskGroups: any[]
	setTaskGroups: (
		taskGroups: any[]
	) => void
	tasks: Itask[],
	setTasks: (
		taskGroups: any[]
	) => void
	groupsLoading: boolean,
	setGroupsLoading: (
		groupsLoading: boolean
	) => void
}


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
			taskGroups: [],
			setTaskGroups:
				(taskGroups: any) =>
					set({ taskGroups }),
			tasks: [],
			setTasks:
				(tasks: any) =>
					set({ tasks }),
			groupsLoading: true,
			setGroupsLoading:
				(groupsLoading: boolean) =>
					set({ groupsLoading })
		}),
		{
			name: 'app-storage',
		}
	)
)
