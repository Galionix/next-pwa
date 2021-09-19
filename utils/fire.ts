// Import the functions you need from the SDKs you need
// import { addDoc } from '@firebase/firestore'
import { initializeApp } from 'firebase/app'
// import { getDatabase } from 'firebase/database'
import {
	doc,
	addDoc,
	getFirestore,
	collection,
	getDocs,
	getDoc,
	query,
	where,
} from 'firebase/firestore'
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

	return querySnapshot.empty
}

export const initUser = async (
	name: string,
	email: string,
	imageUrl: string
) => {
	try {
		if (await isUserNew(email)) {
			const docRef = await addDoc(
				collection(db, 'users'),
				{
					name,
					email,
					imageUrl,
				}
			)
			console.log(
				'Document written with ID: ',
				docRef.id
			)
		} else console.log('already registered')
	} catch (e) {
		console.error('Error adding document: ', e)
	}
}
// initUser()

export const newTaskGroup = async (
	email: string,
	title?: string
) => {
	const userdoc = await user(email)
	const docRef = await addDoc(
		collection(
			db,
			`users/${userdoc.id}/taskGroups`
		),
		{
			title: title || 'new taskGroup',
		}
	)
	console.log(
		'newTaskGroup written with ID: ',
		docRef.id
	)
	// userdoc.
}

export const addTask = async (
	email: string,
	taskGroup: string,
	task: { text: string }
) => {
	const { id: userid } = await user(email)
	const docRef = await addDoc(
		collection(
			db,
			`users/${userid}/taskGroups/${taskGroup}/tasks`
		),
		{
			...task,
		}
	)
	console.log(
		'addTask written with ID: ',
		docRef.id
	)
}