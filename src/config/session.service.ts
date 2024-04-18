// @ts-nocheck
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import * as CryptoJS from 'crypto-js';
import LoggedUser from '../modelli/loggedUser';

// @ts-nocheck
export const SessionService = {
  key: 'rXuApp',

  getLocalKey(): string {
    return localStorage.getItem('iddevice') + '@rxu';
  },
 
  supportedLoginLanguage(language: string): string {
    if (language.toLowerCase() === 'ita' || language.toLowerCase() === 'eng') {
      return language;
    }
    return 'eng';
  },

  setLoggedUser(lu: LoggedUser): void {
    const cryptedObject = CryptoJS.AES.encrypt(JSON.stringify(lu), this.getLocalKey()).toString();
    sessionStorage.setItem('loggedUser', cryptedObject);
  },

  setAllLanguages(lang: any): void {
    sessionStorage.setItem('languages', JSON.stringify(lang));
  },

  setCurrentLanguage(l: string): void {
    sessionStorage.setItem('language', l);
  },

  setAllCompanies(comp: any): void {
    sessionStorage.setItem('companies', JSON.stringify(comp));
  },

  getLoggedUser(): LoggedUser {
    const cryptedObject = sessionStorage.getItem('loggedUser');
    const decryptedObject = CryptoJS.AES.decrypt(cryptedObject, this.getLocalKey()).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedObject);
  },

  getValue(item: string): string {
    return sessionStorage.getItem(item) || '';
  },

  setCookie(appdomain: string, item: string, value: string): void {
    Cookies.set(`${appdomain}_${item}`, value, { expires: 30 });
  },

  setLocalCrypted(appdomain: string, item: string, value: string): void {
    try {
      const cryptedObject = CryptoJS.AES.encrypt(value, this.getLocalKey()).toString();
      localStorage.setItem(`${appdomain}_${item}`, cryptedObject);
    } catch (e) {
      console.error(e);
    }
  },

  getCookie(appdomain: string, item: string): string | undefined {
    return Cookies.get(`${appdomain}_${item}`);
  },

  getLocalCrypted(appdomain: string, item: string): string | undefined {
    try {
      return CryptoJS.AES.decrypt(Cookies.get(`${appdomain}_${item}`), this.getLocalKey()).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },

  clearCookie(appdomain: string, item: string): void {
    Cookies.remove(`${appdomain}_${item}`);
  },

  deleteAllCookies(): void {
    Cookies.remove();
  },

  getValueJson(item: string): any {
    const json = sessionStorage.getItem(item) || '';
    return json !== '' ? JSON.parse(json) : undefined;
  },

  setValue(item: string, value: any): void {
    sessionStorage.setItem(item, value);
  },

  isLogged(): boolean {
    return (sessionStorage.getItem('loggedUser') || '') !== '';
  },

  isEmpty(v: any): boolean {
    return !v || (v || '') === '';
  },

  resetLoggedUser(): void {
    sessionStorage.setItem('loggedUser', '');
    sessionStorage.setItem('languages', '');
    sessionStorage.setItem('language', 'ita');
    sessionStorage.setItem('companies', '');
  },
};


