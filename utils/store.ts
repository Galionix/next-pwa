import { IPendingShareInvite, Itask, IUser } from 'types/fireTypes'
import create from 'zustand'
import { persist } from 'zustand/middleware'
// import { Store } from './../types/store'

export interface Store {
	user: IUser
	setUser: (user: IUser) => void
	taskGroupIndex: number
	setTaskGroupIndex: (
		taskGroupIndex: number
	) => void
	reset: () => void
	taskGroups: any[]
	setTaskGroups: (
		taskGroups: any[]
	) => void
	tasks: any[],
	setTasks: (
		taskGroups: any[]
	) => void
	groupsLoading: boolean,
	setGroupsLoading: (
		groupsLoading: boolean
	) => void
	externalTaskGroups: IPendingShareInvite[],
	setExternalTaskGroups: (
		externalTaskGroups: IPendingShareInvite[]
	) => void
	externalTaskGroupsData: any[],
	setExternalTaskGroupsData: (
		externalTaskGroupsData: any[]
	) => void
	externalTasks: Itask[],
	setExternalTasks: (
		externalTasks: Itask[]
	) => void
	externalTaskGroupIndex: number,
	setExternalTaskGroupIndex: (
		externalTaskGroupIndex: number
	) => void


}


export const useUserStore = create<Store>(
	persist(
		set => ({
			externalTaskGroupIndex: -1,
			setExternalTaskGroupIndex: (externalTaskGroupIndex: number) => set({ externalTaskGroupIndex }),
			externalTaskGroupsData: [],
			setExternalTaskGroupsData: (externalTaskGroupsData) => set({ externalTaskGroupsData }),
			externalTasks: [],
			setExternalTasks: (externalTasks) => set({ externalTasks }),
			setExternalTaskGroups: (externalTaskGroups: IPendingShareInvite[]) => set({ externalTaskGroups }),
			externalTaskGroups:[],
			user: { picture: '/image/user.png' } as any,
			setUser: (user: any) => set({ user }),
			// sessionLoading: false,
			taskGroupIndex: 0,
			setTaskGroupIndex: (
				taskGroupIndex: number
			) => set({ taskGroupIndex }),
			reset: () =>
				set({
					user: { picture: '/image/user.png' } as any,
					tasks: [],
					taskGroups: [],
					taskGroupIndex: 0,
					externalTaskGroups: [],
					externalTasks: [],
					externalTaskGroupsData: [],
					externalTaskGroupIndex: -1,

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


