import * as cryptoPonyfill from 'uncrypto';

export const HAS_NATIVE_CRYPTO = typeof globalThis.crypto !== 'undefined';
export const crypto = HAS_NATIVE_CRYPTO ? globalThis.crypto : cryptoPonyfill;
