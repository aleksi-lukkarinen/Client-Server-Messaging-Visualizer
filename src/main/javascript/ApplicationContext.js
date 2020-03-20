/**
 * ApplicationContext class module.
 *
 * @module StringUtils
 */




/** Provides application-wide resources. */
export default class ApplicationContext {

  constructor() {
    this._domFactoryInstance = null;
    this._errorFactoryInstance = null;
    this._htmlElementFinder = null;
    this._objectUtilsInstance = null;
    this._stringUtilsInstance = null;
  }

  get domFactory() {
    return this._domFactoryInstance;
  }

  set domFactory(instance) {
    this._domFactoryInstance = instance;
  }

  get errorFactory() {
    return this._errorFactoryInstance;
  }

  set errorFactory(instance) {
    this._errorFactoryInstance = instance;
  }

  get htmlElementFinder() {
    return this._htmlElementFinder;
  }

  set htmlElementFinder(instance) {
    this._htmlElementFinder = instance;
  }

  get objectUtils() {
    return this._objectUtilsInstance;
  }

  set objectUtils(instance) {
    this._objectUtilsInstance = instance;
  }

  get stringUtils() {
    return this._stringUtilsInstance;
  }

  set stringUtils(instance) {
    this._stringUtilsInstance = instance;
  }

}
