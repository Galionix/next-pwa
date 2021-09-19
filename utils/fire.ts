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

const isUserNew = async (email: string) => {
	const citiesRef = collection(db, 'users')

	const q = query(
		citiesRef,
		where('email', '==', email)
	)
	const querySnapshot = await getDocs(q)
	// console.log(
	// 	'%c 🐍: isUserRegistered ',
	// 	'font-size:16px;background-color:#324d09;color:white;',
	// 	querySnapshot.empty
	// )
	// querySnapshot.forEach(doc => {
	// 	// doc.data() is never undefined for query doc snapshots
	// 	console.log(doc.id, ' => ', doc.data())
	// })
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
	// const app = initializeApp(firebaseConfig)
	// const db = getDatabase();
	// set(ref(db, 'users/' + userId), {
	//   username: name,
	//   email: email,
	//   profile_picture: imageUrl
	// });
}
// initUser()
