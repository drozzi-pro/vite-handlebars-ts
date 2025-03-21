import { Nullable } from "@js/types";

export interface AppInterface {
  scrollbarWidth: Nullable<number>
  body?: Nullable<HTMLElement>
  bodyBlock: ( isBlock?: boolean ) => void
  initDependencies: () => void
  setWindowVariables?: () => void
  modalOpen: ( modalName?: string ) => void
  modalClose: ( modalName?: string ) => void
}

export interface App extends Omit<AppInterface, 'initDependencies'> {
}
