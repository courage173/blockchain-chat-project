import CryptoJS from 'crypto-js';
import { localStorageFuncInterface } from '../types/obj-types';
// import { data } from '../types/obj-types';
import { Toaster } from '../providers/toast-provider';

// VITE_APP_SECRETE_KEY

const SECRET_KEY = import.meta.env.VITE_APP_SECRETE_KEY as string;
const ENC_DATA = import.meta.env.VITE_APP_LOCNAME as string;


interface data {
  data: string;
}




export const encryptData = async (name: string, data: any): Promise<void> => {

  try {
    const encrypted = await CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    localStorage.setItem(name, encrypted);
  } catch (error: any) {
    console.log('error from encode', error.message);
  }
};

export const decryptData = async (name: string): Promise<string> => {

  const encrypted = await localStorage.getItem(name) as string;

  try {

    const decrypted = await CryptoJS.AES.decrypt(
      encrypted,
      SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);
    console.log('decrypted', decrypted);
    const data: string = JSON.parse(decrypted)

    return data;
  } catch (error: any) {
    console.log('error from dec', error.message);
    return error;
  }
};

export const logoutEnc = async (name: string): Promise<void> => {

  try {
    localStorage.removeItem(name);
  }
  catch (error: any) {
    Toaster.error(error.message);
    return error;

  }

};
