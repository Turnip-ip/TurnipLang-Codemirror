import { LRLanguage, LanguageSupport } from "@codemirror/language";
declare const TURNIPLang: LRLanguage;
declare const turnipCompletion: import("@codemirror/state").Extension;
declare function turnip_lang(): LanguageSupport;
export { TURNIPLang, turnipCompletion, turnip_lang };
