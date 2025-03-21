import { Nullable } from "@js/types";

export const getClosest = ( elem: HTMLElement | null, searchElem: string ): Nullable<HTMLElement> => {
  return !elem || !elem.closest ? null : elem.closest( searchElem )
}