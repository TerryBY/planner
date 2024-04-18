// @ts-nocheck
import { Observable, Subscription, BehaviorSubject, Observer } from 'rxjs';


import * as CryptoJS from 'crypto-js';
import React from 'react';
import { AppConfig } from './appConfig';






export class ConfigService {

  subscriptionWS: Subscription = new Subscription;
  timeout: boolean = false;
  fullscreen: boolean = false;
  public static debugging: boolean = AppConfig.debugMode;
  public static appDomain: string = '';

  private _initCallBack = new BehaviorSubject<string>('');
  _initCallBack$ = this._initCallBack.asObservable();

  constructor() {


    if (!sessionStorage.getItem("config.json")) {
      console.log("Configuration loading...");
      sessionStorage.setItem("config-state", "still loading");
    //  this.getConfigJson();
    }
    else {
      this._initCallBack.next('true');
    }

    if (sessionStorage.getItem("runtimedebug")) {
      if (sessionStorage.getItem("runtimedebug") == "1")
        ConfigService.debugging = true;
      else if (sessionStorage.getItem("runtimedebug") == "0")
        ConfigService.debugging = false;
    }
  }

  resetObservable() {
    this._initCallBack.next('reset');
  }

  async getConfigJson() {
    this._initCallBack.next('loading');
    console.log(ConfigService.getDomain(window.location.href));
    //ConfigService.appDomain = ConfigService.getDomain(window.location.host);
    ConfigService.appDomain = ConfigService.getDomain(window.location.href).replace("auth", "").replace("app", "");
    if (this.subscriptionWS)
      this.subscriptionWS.unsubscribe();
    this.subscriptionWS = (this.getJSONConfig("config.json")).subscribe(conf => {
      console.log('Config Service configuration loaded. ' + new Date().toLocaleTimeString());
      sessionStorage.setItem("runningSaasDomain", ConfigService.appDomain);
      sessionStorage.setItem("webSocketOff", conf.WS.webSocketOff && conf.WS.webSocketOff == true ? "1" : undefined);
     


      if (conf.Environment.fabIconsHT)
        ConfigService.encryptItem("fabIconsHT", conf.Environment.fabIconsHT);

      if (conf.Environment.maxPrints)
        ConfigService.encryptItem("maxPrints", conf.Environment.maxPrints);

      if (conf.WS.restAPIServerURL)
        ConfigService.encryptItem("restAPIServerURL", conf.WS.restAPIServerURL);

      //sessionStorage.setItem("config.json", JSON.stringify(conf));
      this.encryptConfig(JSON.stringify(conf));
      sessionStorage.setItem("config-state", "loaded");

      this._initCallBack.next('true');
    },
      error => {
        console.error(error);
        this._initCallBack.next('false');
      });
  }

  ngOnDestroy() {
    if (this.subscriptionWS)
      this.subscriptionWS.unsubscribe();
  }

  static TryDecrypt() { //key:YWdpbGVhcHBhZ2lsZWFwcA==iv:xjGo7SgRLq8Kpqcen2wXtw==text:ouMRccnwgZrKSbz/p38v0Q==
    var key = CryptoJS.enc.Base64.parse('YWdpbGVhcHBhZ2lsZWFwcA==');
    var iv = CryptoJS.enc.Base64.parse('xjGo7SgRLq8Kpqcen2wXtw==');
    var ciphertext = 'ouMRccnwgZrKSbz/p38v0Q==';
    var decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
    console.log(decrypted);
  }

  static TestEncrypt() {
    var iv = CryptoJS.enc.Base64.parse('xjGo7SgRLq8Kpqcen2wXtw==');
    let cryptedObject = CryptoJS.AES.encrypt("TICKETREG", CryptoJS.enc.Base64.parse('YWdpbGVhcHBhZ2lsZWFwcA=='), { iv: iv });
    console.log(cryptedObject.toString());
  }

  static descryptUrlParam(param: string) {
    var key = CryptoJS.enc.Base64.parse('YWdpbGVhcHBhZ2lsZWFwcA==');
    var iv = CryptoJS.enc.Base64.parse('xjGo7SgRLq8Kpqcen2wXtw==');
    //var ciphertext = param.replace(" ", "+");  //NB: da togliere una volta implementata la sostituzione dei parametri
    var ciphertext = param.replace(/\./g, "+");
    ciphertext = ciphertext.replace(/_/g, "/");
    ciphertext = ciphertext.replace(/-/g, "=");
    //let decryped  = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
    //let what = CryptoJS.enc.Utf8;
    return CryptoJS.AES.decrypt(ciphertext, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
  }

  static decryptConfig() {
    let json = sessionStorage.getItem("config.json");
    if (json && json != '')
      return CryptoJS.AES.decrypt(json, 'rxuapp').toString(CryptoJS.enc.Utf8);
    return json;
  }

  static getDomain(url: string): string {
    if (url) {
      let iQuestion = url.indexOf("?");
      if (iQuestion != -1) {
        url = url.substring(0, iQuestion);
        url = url.substring(0, url.lastIndexOf('/'));
      }
      else {
        url = url.substring(0, url.lastIndexOf('/'));
      }
    }
    return url;
  }

  public static encryptItem(key: string, item: string) {
    let cryptedObject = CryptoJS.AES.encrypt(item, 'rxuapp').toString();
    sessionStorage.setItem(key, cryptedObject);
  }

  public static encryptUserInfo(key: string, item: string) {
    let cryptedObject = CryptoJS.AES.encrypt(item, 'rxuapp').toString();
    localStorage.setItem(key, cryptedObject);
  }
  public static decryptUserInfo(key: string) {
    let json = localStorage.getItem(key);
    if (json && json != '')
      return JSON.parse(CryptoJS.AES.decrypt(json, 'rxuapp').toString(CryptoJS.enc.Utf8));
    return json;
  }

  public static decryptItem(key: string) {
    let json = sessionStorage.getItem(key);
    if (json && json != '')
      return CryptoJS.AES.decrypt(json, 'rxuapp').toString(CryptoJS.enc.Utf8);
    return json;
  }

  encryptConfig(value: string) {
    let cryptedObject = CryptoJS.AES.encrypt(value, 'rxuapp').toString();
    sessionStorage.setItem("config.json", cryptedObject);
  }

  public static hasValidConfig(): boolean {
    try {
      //let cjs = sessionStorage.getItem("config.json");
      let cjs = this.decryptConfig();
      return (cjs && cjs != '' && JSON.parse(cjs).soapServerURL != '' ? true : false);
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  public static isWebsocketOff(): boolean {
    let wso = sessionStorage.getItem("webSocketOff");
    return (wso != undefined && wso == "1");
  }

  public static readConfig(): any {
    return JSON.parse(this.decryptConfig());
  }

  getJSONConfig(jsonfile: string): Observable<any> {
    const now = new Date();
    let httpPath = `${ConfigService.appDomain}/${jsonfile}?guid=${ConfigService.newGuid()}`;

    if (ConfigService.appDomain.endsWith('/')) {
      httpPath = `${ConfigService.appDomain}${jsonfile}?guid=${ConfigService.newGuid()}`;
    }

    if (ConfigService.debugging) {
      console.log('HTTP Path:', httpPath);
    }

    return new Observable((observer: Observer<any>) => {
      fetch(httpPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {

          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          console.error('Error:', error);
          observer.error(error);
        });
    });
  }





  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
