import {
	collection,
	getDocs,
	orderBy,
	query,
} from '@firebase/firestore'
import { db, getExternalTasks, getSharedGroups, populateExternalTaskGroups, user } from './fire'
import { notification } from 'antd'
import { MutableRefObject, useRef } from 'react'
import { IconType } from 'antd/lib/notification'
import { collectionGroup } from 'firebase/firestore'
// import useTranslation from 'next-translate/useTranslation'

export const requestNotificationPermission =
	async () => {
		const result =
			await Notification.requestPermission()
		return result
	}

export const deviceNotification = async (
	text: string
) => {
	new Notification('To do list', {
		body: text,
		icon: 'icons/android-chrome-192x192.png',
	})
}


export const getTaskGroups = async (
	userid: string
) => {
	const taskGroupsRef = collection(
		db,
		`users/${userid}/taskGroups`
	)
	// const taskGroupsRef = collectionGroup(
	// 	db,
	// 	`users/${userid}/taskGroups`
	// )
	const q = query(
		taskGroupsRef,
		orderBy('timestamp', 'desc')
	)
	const querySnapshot = await getDocs(
		q
	)

	const res: {
		id: string;
		data: any;
		taskArray: any[];
		activeTasks: number;
		archivedTasks: number;
		urgentTasks: number;
		warningTasks: number;
	}[] = []

	querySnapshot.forEach(doc => {
		res.push({
			id: doc.id,
			data: doc.data(),
			taskArray: [],
			activeTasks: 0,
			archivedTasks: 0,
			urgentTasks: 0,
			warningTasks: 0
		})
	})

	// ANTIPATTERN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	for (const doc of res) {
		const taskArray = await getTasks(userid, doc.id)
		doc.taskArray = taskArray
		doc.activeTasks = taskArray
			.filter(el => el.data.checked === false)
			.length
		doc.archivedTasks = taskArray
			.filter(el => el.data.archived === true)
			.length

		doc.urgentTasks = taskArray
			.filter(el => el.data.urgency === 'urgent' && el.data.checked === false)
			.length

		doc.warningTasks = taskArray
			.filter(el => el.data.urgency === 'warning' && el.data.checked === false)
			.length
	}

	return res
}

export const getTaskGroups_old = async (
	userid: string
) => {
	const taskGroupsRef = collection(
		db,
		`users/${userid}/taskGroups`
	)
	const q = query(
		taskGroupsRef,
		orderBy('timestamp', 'desc')
	)
	const querySnapshot = await getDocs(
		q
	)

	const res: { id: string; data: any }[] = []
	querySnapshot.forEach(doc => {
		res.push({ id: doc.id, data: doc.data() })
	})

	return res
}

export const getTasks = async (
	userid: string,
	taskGroup: string,
	external: boolean=false
) => {
	const tasksRef = collection(
		db,
		`users/${userid}/taskGroups/${taskGroup}/tasks`
	)
	const q = query(
		tasksRef,
		orderBy('timestamp', 'asc')
	)
	const querySnapshot = await getDocs(
		q
	)
	const res: { id: string; data: any, external?:boolean }[] = []
	querySnapshot.forEach(doc => {
		res.push({
			id: doc.id,
			external,
			data: doc.data(),
		})
	})
	return res
}

export const isValidText = (text: string) => {
	if (text.trim() === '') return false
	if (text.trim().length < 3) return false
	return true
}

export const extractCapitals = (text: string) => {
	if (text.trim().length < 5)
		return `${text.trim()[0].toUpperCase()}${text
			.trim()[1]
			.toUpperCase()}`
	if (text.split(' ').length > 2)
		return `${text
			.split(' ')[0][0]
			.toUpperCase()}${text
				.split(' ')[1][0]
				.toUpperCase()}${text
					.split(' ')[2][0]
					.toUpperCase()}`
	if (text.split(' ').length > 1)
		return `${text
			.split(' ')[0][0]
			.toUpperCase()}${text
			.split(' ')[1][0]
			.toUpperCase()}`

	return `${text.trim()[0].toUpperCase()}${text
		.trim()[1]
		.toUpperCase()}${text
		.trim()[2]
		.toUpperCase()}`
}

export const setTheme = (theme: string) => {
	// window.document.classlist.add(theme)
	if (theme === 'light') {
		document
			.documentElement
			.style
			.setProperty
			(
				'--bg-main',
				'rgba(255, 255, 255, 0.8)'
			);

		document
			.documentElement
			.style
			.setProperty
			(
				'--bg-second',
				'rgba(0, 0, 0, 0.9)'
			);

	} else {
		document.documentElement.style.setProperty
			('--bg-second',
			'rgba(255, 255, 255, 0.7)'
			);

		document.documentElement.style.setProperty
			('--bg-main',
				'rgba(0, 0, 0, 0.7)'
			);

	}


}

export const useFocus = () => {
	const htmlElRef: MutableRefObject<any> =
		useRef(null)
	const setFocus = () => {
		htmlElRef.current && htmlElRef.current.focus()
	}

	return [htmlElRef, setFocus]
}

export const notif = ({
	type,
	message,
	description,
}: {
	type: IconType
	message: string
	description?: string
}) => {
	notification[type]({
		message,
		description: description || '',
	})
}

export const refreshTaskData = async (
	{ userid,
		taskGroupIndex,
		setTaskGroups,
		setTasks,
		setGroupsLoading,
		setExternalTaskGroups,
		setExternalTasks,
		taskGroups,
		setExternalTaskGroupsData,externalTaskGroupIndex
	}:
		{
			userid: string,
			taskGroupIndex: number,
			taskGroups: any[],
			setTaskGroups: Function,
			setTasks: Function
			setGroupsLoading: Function
			setExternalTaskGroups: Function
			setExternalTasks: Function
			setExternalTaskGroupsData: Function
			externalTaskGroupIndex: number
		}
) => {
	// const externalGroupId = taskGroupIndex - taskGroups.length
	//
	setGroupsLoading(true)

	getTaskGroups(userid).then(async (res) => {
		await getSharedGroups(userid).then(async (res) => {
			// setSharedGroups(res)


			setExternalTaskGroups&&setExternalTaskGroups(res)
			if (res.length > 0) {
				const populatedData =
					await populateExternalTaskGroups(res)
					setExternalTaskGroupsData&&setExternalTaskGroupsData(populatedData)
				// if (externalTaskGroupIndex > 0) {
				// 	getExternalTasks()
				// }

			}

			if (res.length > 0 && externalTaskGroupIndex > -1) {
				const group= res[externalTaskGroupIndex]

				await getTasks(res[externalTaskGroupIndex].fromUser, `${res[externalTaskGroupIndex].taskGroup}`,true)
					.then(res => {
					setExternalTasks(res)
				})
			}
		})

		setTaskGroups(res)
		if (res.length > 0 && taskGroupIndex > -1) {
			getTasks(
				userid,
				res[taskGroupIndex].id
			).then(res => {
				setTasks(res)
				setGroupsLoading(false)

			})
		}
		else {
			setGroupsLoading(false);
		}
	});


}