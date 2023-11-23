import EventEmiiter from "events";

const _emiiter = new EventEmiiter();
_emiiter.setMaxListeners(0);

export const emiiter = _emiiter;
