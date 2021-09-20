export interface Store {
	user: any
	setUser: (user: any) => void
	taskGroupIndex: number
	setTaskGroupIndex: (
		taskGroupIndex: number
	) => void
}
