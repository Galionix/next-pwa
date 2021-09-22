import {
	collection,
	getDocs,
	orderBy,
	query,
} from '@firebase/firestore'
import { db, user } from './fire'

export const requestNotificationPermission =
	async () => {
		const result =
			await Notification.requestPermission()
		return result
	}

export const notification = async (
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
	// console.log(
	// 	'%c 🧜‍♂️: getTaskGroups ',
	// 	'font-size:16px;background-color:#409416;color:white;',
	// 	'getTaskGroups'
	// )

	// const { id: userid } = await user(email)

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
		// collection(db, `users/${userid}/taskGroups`)
	)
	// console.log(
	// 	'%c 🐥: querySnapshot ',
	// 	'font-size:16px;background-color:#426695;color:white;',
	// 	querySnapshot.size
	// )
	const res: { id: string; data: any }[] = []
	querySnapshot.forEach(doc => {
		// doc.data() is never undefined for query doc snapshots
		// console.log(doc.id, ' => ', doc.data())
		res.push({ id: doc.id, data: doc.data() })
	})

	return res
}

export const getTasks = async (
	userid: string,
	taskGroup: string
) => {
	// console.log(
	// 	'%c 🇹🇱: getTasks ',
	// 	'font-size:16px;background-color:#2e6575;color:white;',
	// 	'getTasks'
	// )

	// const { id: userid } = await user(email)
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
		// collection(
		// 	db,
		// 	`users/${userid}/taskGroups/${taskGroup}/tasks`
		// )
	)
	const res: { id: string; data: any }[] = []
	querySnapshot.forEach(doc => {
		// doc.data() is never undefined for query doc snapshots
		// console.log(doc.id, ' => ', doc.data())
		res.push({
			id: doc.id,
			data: doc.data(),
			// checked: doc.checked,
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