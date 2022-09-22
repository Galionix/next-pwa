// Import the functions you need from the SDKs you need
// import { addDoc } from '@firebase/firestore'
import { initializeApp } from 'firebase/app';
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
  enableMultiTabIndexedDbPersistence,
} from 'firebase/firestore';
import uniqid from 'uniqid';
import { IPendingShareInvite, Itask, ITaskGroup, IUser } from 'types/fireTypes';
import { getTasks } from '@/utils/apputils';
// import {
// 	getDatabase,
// 	ref,
// 	onValue,
// } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyDy9a1OagHafFxYmd0lOwAc8PkAVjHxbzc',
  authDomain: 'planner-77b88.firebaseapp.com',
  projectId: 'planner-77b88',
  storageBucket: 'planner-77b88.appspot.com',
  messagingSenderId: '567565310996',
  // databaseURL:
  // 	'https://planner-77b88.firebaseio.com',
  appId: '1:567565310996:web:f4090a8b55677533ab1b01',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

try {
  enableMultiTabIndexedDbPersistence(db)
    .then(() => {
      console.log('enableMultiTabIndexedDbPersistence enabled');
    })
    .catch(e => console.log('enableMultiTabIndexedDbPersistence error', e));
} catch (error) {
  console.log(error);
}
export const user = async (email: string) => {
  const userRef = collection(db, 'users');

  const q = query(userRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0];
};

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
  const userRef = collection(db, 'users');

  const q = query(userRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  return querySnapshot;
  // querySnapshot.empty ||
  // querySnapshot.docs[0].id
};

export const initUser = async (
  name: string,
  email: string,
  imageUrl: string,
) => {
  // try {
  const querySnapshot = await isUserNew(email);
  if (querySnapshot.empty) {
    const docRef = await addDoc(collection(db, 'users'), {
      name,
      email,
      imageUrl,
    });

    return docRef;
  } else return querySnapshot.docs[0].ref;
};
// initUser()

export const newTaskGroup = async (userid: string, title?: string) => {
  const docRef = await addDoc(collection(db, `users/${userid}/taskGroups`), {
    title: title || 'new taskGroup',
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
    // created: app.database.ServerValue.TIMESTAMP,
    // created:
  });
};

export const addTask = async (
  userid: string,
  taskGroup: string,
  task: {
    text: string;
    images: {
      filename: string;
      variants: string[];
    }[];
    checkable: boolean;
    urgency: string;
  },
) => {

  const docRef = await addDoc(
    collection(db, `users/${userid}/taskGroups/${taskGroup}/tasks`),
    {
      ...task,
      timestamp: serverTimestamp(),
      checked: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      archivedAt: null,

      // app.FieldValue.serverTimestamp(),
    },
  );
};
export const f_updateTaskGroupTitle = async (
  userid: string,
  taskId: string,
  title: string,
) => {
  // const { id: userid } = await user(email)
  return await updateDoc(doc(db, `users/${userid}/taskGroups/${taskId}`), {
    title,
    updatedAt: serverTimestamp(),
  });
};

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
  data: Itask['data'],
  isExternal = false,
): Promise<any> => {
  return await updateDoc(
    doc(db, `users/${userid}/taskGroups/${taskGroupId}/tasks/${taskId}`),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
  );
};

export const deleteTaskGroup = async (userid: string, taskId: string) => {
  // const { id: userid } = await user(email)
  return await deleteDoc(doc(db, `users/${userid}/taskGroups/${taskId}`));
};
export const updateUser = async (id: string, data: any) => {
  return await updateDoc(doc(db, `users/${id}`), {
    id,
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteUser = async (id: string) => {
  return await deleteDoc(doc(db, `users/${id}`));
};

export const getUsersListWithIds = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as IUser[];
};

// export const getPendingShareInvites = async (userid: string) => {
//   console.log('userid: ', userid);
//   const userRef = doc(db, 'users', userid);
//   const userSnap = await getDoc(userRef);
//   const user = userSnap.data() as IUser;
//   console.log('user: ', user);
//   return user.pendingShareInvites;
// };

export const getPendingShareInvites = async (userid: string) => {
  const invites = collection(db, 'users', userid, 'pendingShareInvites');
  const snapshot = await getDocs(invites);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as IPendingShareInvite[];
};

export const addPendingShareInvite = async (
  toUserId: string,
  fromUserId: string,
  data: IPendingShareInvite,
) => {
  const inviteData = {
    ...data,
    toUserId,
    sendAt: serverTimestamp(),
    acceptedAt: null,
  };

  // add invite to sender
  const added = await addDoc(
    collection(db, `users/${fromUserId}/sentPendingShareInvites`),
    inviteData,
  );

  // add invite to receiver
  const res = await addDoc(
    collection(db, `users/${toUserId}/pendingShareInvites`),
    { ...inviteData, pendingId: added.id },
  );
  return res;
};

// const getPendingInvite = async (userid: string, inviteId: string) => {
//   const inviteRef = doc(db, 'users', userid, 'pendingShareInvites', inviteId);
//   const inviteSnap = await getDoc(inviteRef);
//   return inviteSnap.data() as IPendingShareInvite;
// };

export const getTaskGroup = async (userid: string, groupId: string) => {
  const querySnapshot = await getDoc(
    doc(db, `users/${userid}/taskGroups/${groupId}`),
  );
  const res = querySnapshot.data() as ITaskGroup;
  return res;
};
export const acceptShareInvite = async ({
  toUserId,
  invite,
}: {
  toUserId: string;
  invite: IPendingShareInvite;
  }) => {


  const docRef = await addDoc(
    collection(db, `users/${toUserId}/sharedGroups`),
    {...invite, acceptedAt: serverTimestamp(),},
  );

  // const existingInvites = await getPendingShareInvites(toUserId);

  // console.log('existingInvites: ', existingInvites);

  await updateDoc(
    doc(
      db,
      `users/${invite.fromUser}/sentPendingShareInvites/${invite.pendingId}`,
    ),
    {
      acceptedAt: serverTimestamp(),
    },
  );

  return await updateDoc(
    doc(db, `users/${toUserId}/pendingShareInvites/${invite.id}`),
    {
      acceptedAt: serverTimestamp(),
    },
  );
};

export const getSharedGroups = async (userid: string) => {
  const invites = collection(db, 'users', userid, 'sharedGroups');
  const snapshot = await getDocs(invites);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as IPendingShareInvite[];
};

export interface IExternalPopulatedTaskGroup extends IPendingShareInvite {
  // tasks: Itask[];
}
export const populateExternalTaskGroups = async (groups: IPendingShareInvite[]) => {

  const promises = groups.map(async group => {
    const data = await getTaskGroup(group.fromUser, group.taskGroup);

    // get tasks
    // const tasks = await getTasks(group.fromUser, group.taskGroup);

    return { ...group, data} as IExternalPopulatedTaskGroup;
  });
  return await Promise.all(promises);
}
export const getExternalTasks = async (userid: string, groupId: string) => {
  const tasks = collection(db, 'users', userid, 'taskGroups', groupId, 'tasks');
  const snapshot = await getDocs(tasks);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as Itask[];
};
