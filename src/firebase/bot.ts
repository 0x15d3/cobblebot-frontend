import { getAuthService, getAnalytic, getFirestoreService } from '.';
import { logEvent } from 'firebase/analytics';
import { collection, getDocs, DocumentData, QuerySnapshot, doc, getDoc, query, where, addDoc, Timestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

const BOT_COLLECTION_NAME = 'bots';

interface BotUpdateValues {
  username?: string;
  description?: string;
  server?: string;
  port?: number;
  status?: string;
  version?: string;
  password?: string;
}

export type BotEntity = {
  id: string,
  userid: string,
  status: string,
  name: string,
  description: string,
  type: string,
  version: string,
  server: string,
  authType?: string,
  username: string,
  password?: string,
  dig: string,
  createdAt: firebase.firestore.Timestamp,
  updatedAt: firebase.firestore.Timestamp,
  options?: any,
};

export async function getLogs(botName: string): Promise<any> {
  try {
    const db = getFirestoreService();
    const userRef = collection(db, BOT_COLLECTION_NAME);
    const querySnapshot = await getDocs(query(userRef, where('username', '==', botName)));

    if (querySnapshot.empty == false) {
      const doc = querySnapshot.docs[0];
      const logs = doc.data().logs || [];
      return { logs };
    } else {
      throw new Error(`Bot with username ${botName} not found`);
    }
  } catch (error) {
    console.error('Error getting logs:', error);
    throw error;
  }
}

export async function getBotList(userId?: string): Promise<BotEntity[]> {
  try {
    const db = getFirestoreService();
    const auth = getAuthService();
    const uid = userId || auth.currentUser!.uid;

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      query(collection(db, BOT_COLLECTION_NAME), where('userid', '==', uid))
    );

    const results: BotEntity[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as BotEntity));

    return results.sort((a, b) => a.username.toUpperCase() > b.username.toUpperCase() ? 1 : -1);
  } catch (error) {
    console.error('Error fetching bot list:', error);
    throw error;
  }
}


export async function getBotById(id: string): Promise<BotEntity> {
  try {
    const db = getFirestoreService();
    const docRef = doc(db, BOT_COLLECTION_NAME, id);
    const documentSnapshot = await getDoc(docRef);

    if (true == documentSnapshot.exists()) {
      return { id, ...documentSnapshot.data() } as BotEntity;
    } else {
      throw new Error(`Bot with ID ${id} not found`);
    }
  } catch (error) {
    console.error('Error fetching bot by ID:', error);
    throw error;
  }
}


export async function createBot(bot: BotEntity): Promise<any> {
  try {
    const db = getFirestoreService();
    const botCountQuerySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      query(collection(db, BOT_COLLECTION_NAME), where('userid', '==', bot.userid))
    );

    if (4 <= botCountQuerySnapshot.size) {
      throw new Error(`Selam! Maalesef size ayırılan bot sayısı sadece 4 ve bundan fazlasını oluşturamazsınız.`);
    }

    const existingBotsQuerySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      query(collection(db, BOT_COLLECTION_NAME), where('username', '==', bot.username))
    );

    if (0 < existingBotsQuerySnapshot.size) {
      throw new Error(`"${bot.username}" adında bir bot zaten var.`);
    }
    bot.createdAt = Timestamp.fromDate(new Date());
    const docRef = await addDoc(collection(db, BOT_COLLECTION_NAME), bot);

    logEvent(getAnalytic(), 'add_bot');

    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating bot:', error);
    throw error;
  }
}

export async function deleteBot(id: string): Promise<void> {
  try {
    const db = getFirestoreService();
    const docRef = doc(db, BOT_COLLECTION_NAME, id);
    await deleteDoc(docRef);
    logEvent(getAnalytic(), 'delete_bot');
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw error;
  }
}


export async function getBotDetails(username: string): Promise<any> {
  try {
    const response = await fetch(`https://api.cobblestone.com.tr/bots/${username}/getBot`, {
      method: "GET"
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error starting bot:', error);
    throw error;
  }
}


export async function updateBot(id: string, values: BotUpdateValues): Promise<any> {
  try {
    const db = getFirestoreService();
    const dbcol = collection(db, BOT_COLLECTION_NAME);
    const botRef = doc(dbcol, id);

    const updateValues: Record<string, any> = {};
    for (const [key, value] of Object.entries(values)) {
      if (undefined !== value) {
        if ('username' === key) {
          const existingBotsQuerySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            query(collection(db, BOT_COLLECTION_NAME), where('username', '==', value))
          );

          if (0 < existingBotsQuerySnapshot.size) {
            throw new Error(`"${value}" adında bir bot zaten var.`);
          }
        }

        updateValues[key] = value;
      }
    }

    await updateDoc(botRef, updateValues);
    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

export async function askBot(id: string, message: string): Promise<any> {
  try {
    logEvent(getAnalytic(), 'send_message');
    const response = await fetch(`https://api.cobblestone.com.tr/bots/${id}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message:message,
      }),
    });
    const result = await response.json();
    if ("NOTRUNNING" == result.status) {
      throw new Error(`Bot çalışır durumda değil!`);
    }
    return result;
  } catch (error) {
    console.error('Error starting bot:', error);
    throw error;
  }
}

export async function startBot(bot: BotEntity): Promise<any> {
  const autoReconnect = bot.options?.autoReconnect ?? 0;
  try {
    logEvent(getAnalytic(), 'start_bot');
    const response = await fetch(`https://api.cobblestone.com.tr/bots/createBot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username:bot.username,
        password:bot.password,
        version:bot.version,
        host:bot.server,
        interval: autoReconnect
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error starting bot:', error);
    throw error;
  }
}

export async function stopBot(id: string): Promise<any> {
  try {
    logEvent(getAnalytic(), 'stop_bot');
    const response = await fetch(`https://api.cobblestone.com.tr/bots/stopBot/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if("NOTRUNNING" == result.status){
      throw new Error(`Bot çalışır durumda değil!`);
    }
    return result;
  } catch (error) {
    console.error('Error stopping bot:', error);
    throw error;
  }
}
