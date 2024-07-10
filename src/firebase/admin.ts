import { httpsCallable } from 'firebase/functions';
import { getFunction, getAnalytic, getFirestoreService } from './';
import { logEvent } from 'firebase/analytics';
import { collection, deleteDoc, doc } from 'firebase/firestore';

export function listUsers() {
  const listUsers = httpsCallable(getFunction(),'listUsers');
  logEvent(getAnalytic(),'list_users');
  return listUsers().then(({ data }) => data);
}

export function getStatistics() {
  const listUsers = httpsCallable(getFunction(),'getStatistics');
  logEvent(getAnalytic(),'list_users');
  return listUsers().then(({ data }) => data);
}

export const deleteBot = async (botId) => {
  try {
    const botRef = collection(getFirestoreService(),'bots')
    const bot = doc(botRef,botId);
    deleteDoc(bot)
    return true;
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw new Error('Error deleting bot');
  }
};

export function listBots() {
  const listBots = httpsCallable(getFunction(),'listBots');
  logEvent(getAnalytic(),'list_bots');
  return listBots().then(({ data }) => data);
}

export function saveCustomClaims(targetUid, customClaims) {
  
  const saveCustomClaims = httpsCallable(getFunction(),'saveCustomClaims');
  logEvent(getAnalytic(),'save_custom_claims');
  return saveCustomClaims({ targetUid, customClaims }).then(({ data }) => data);
}
