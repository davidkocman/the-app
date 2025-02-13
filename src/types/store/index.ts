import { Store } from 'pinia'

type PiniaActionAdaptor<Type extends Record<string, (...args: any) => any>, StoreType extends Store> = {
  [Key in keyof Type]: (this: StoreType, ...p: Parameters<Type[Key]>) => ReturnType<Type[Key]>
}

type PiniaGetterAdaptor<GettersType, StoreType extends Store> = {
  [Key in keyof GettersType]: (this: StoreType, state: StoreType['$state']) => GettersType[Key]
}

export type { PiniaActionAdaptor, PiniaGetterAdaptor }
