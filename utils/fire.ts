// Import the functions you need from the SDKs you need
// import { addDoc } from '@firebase/firestore'
import { initializeApp } from 'firebase/app'
// import { getDatabase } from 'firebase/database'
import {
	doc,
	addDoc,
	deleteDoc,
	getFirestore,
	collection,
	getDocs,
	getDoc,
	updateDoc,
	query,
	where,
	serverTimestamp,
} from 'firebase/firestore'
import { Itask } from 'types/fireTypes'
// import {
// 	getDatabase,
// 	ref,
// 	onValue,
// } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
	apiKey:
		'AIzaSyDy9a1OagHafFxYmd0lOwAc8PkAVjHxbzc',
	authDomain: 'planner-77b88.firebaseapp.com',
	projectId: 'planner-77b88',
	storageBucket: 'planner-77b88.appspot.com',
	messagingSenderId: '567565310996',
	// databaseURL:
	// 	'https://planner-77b88.firebaseio.com',
	appId:
		'1:567565310996:web:f4090a8b55677533ab1b01',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export const user = async (email: string) => {
	const userRef = collection(db, 'users')

	const q = query(
		userRef,
		where('email', '==', email)
	)
	const querySnapshot = await getDocs(q)
	return querySnapshot.docs[0]
}

// const taskGroup = async (email: string) => {
// 	const userRef = collection(db, 'users')

// 	const q = query(
// 		userRef,
// 		where('email', '==', email)
// 	)
// 	const querySnapshot = await getDocs(q)
// 	return querySnapshot.docs[0]
// }

const isUserNew = async (email: string) => {
	const userRef = collection(db, 'users')

	const q = query(
		userRef,
		where('email', '==', email)
	)
	const querySnapshot = await getDocs(q)

	return querySnapshot
	// querySnapshot.empty ||
	// querySnapshot.docs[0].id
}

export const initUser = async (
	name: string,
	email: string,
	imageUrl: string
) => {
	// try {
	const querySnapshot = await isUserNew(email)
	if (querySnapshot.empty) {
		const docRef = await addDoc(
			collection(db, 'users'),
			{
				name,
				email,
				imageUrl,
			}
		)

		return docRef
	} else return querySnapshot.docs[0].ref

}
// initUser()

export const newTaskGroup = async (
	userid: string,
	title?: string
) => {
	const docRef = await addDoc(
		collection(db, `users/${userid}/taskGroups`),
		{
			title: title || 'new taskGroup',
			timestamp: serverTimestamp(),
		}
	)
}

export const addTask = async (
	userid: string,
	taskGroup: string,
	task: {
		text: string
		checkable: boolean
		urgency: string
	}
) => {

	const docRef = await addDoc(
		collection(
			db,
			`users/${userid}/taskGroups/${taskGroup}/tasks`
		),
		{
			...task,
			timestamp: serverTimestamp(),
			checked: false,

			// app.FieldValue.serverTimestamp(),
		}
	)
}
export const f_updateTaskGroupTitle = async (
	userid: string,
	taskId: string,
	title: string
) => {
	// const { id: userid } = await user(email)
	return await updateDoc(
		doc(
			db,
			`users/${userid}/taskGroups/${taskId}`
		),
		{ title }
	)
}

/**
 *
 *
 * @param {string} userid: The user ID
 * @param {string} taskGroupId: The task group ID
 * @param {string} taskId: The task ID
 * @param {*} data:Task data
 * @return {Promise}
 */
export const f_updateTask = async (
	userid: string,
	taskGroupId: string,
	taskId: string,
	data: Itask["data"]
): Promise<any> => {
	return await updateDoc(
		doc(
			db,
			`users/${userid}/taskGroups/${taskGroupId}/tasks/${taskId}`
		),
		data
	)
}

export const deleteTaskGroup = async (
	userid: string,
	taskId: string
) => {
	// const { id: userid } = await user(email)
	return await deleteDoc(
		doc(
			db,
			`users/${userid}/taskGroups/${taskId}`
		)
	)
}
export const updateUser = async (
	id: string,
	data: any
) => {
	return await updateDoc(doc(db, `users/${id}`), {
		id,
		...data,
	})
}

export const deleteUser = async (id: string) => {
	return await deleteDoc(doc(db, `users/${id}`))
}