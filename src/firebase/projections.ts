import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "./init"

export async function saveProjection(userId: string, data: any) {
  await setDoc(doc(db, "projections", userId), {
    data,
    updatedAt: new Date()
  })
}

export async function loadProjection(userId: string) {
  const snap = await getDoc(doc(db, "projections", userId))
  return snap.exists() ? snap.data().data : null
}
