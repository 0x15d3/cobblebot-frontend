import { collection, getDocs, query, where } from "firebase/firestore";
import { getFirestoreService } from ".";

export async function getBalance(userId: string) {
  try {
    const db = getFirestoreService();
    const userRef = collection(db, "balance");
    const q = query(userRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const balance = data?.balance;

      if (balance !== undefined) {
        return { balance };
      } else {
        throw new Error(`Balance value for user with ID ${userId} not found`);
      }
    } else {
      throw new Error(`User with ID ${userId} not found`);
    }
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
}