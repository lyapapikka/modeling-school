import { atomWithStorage } from "jotai/utils";

const groupsAtom = atomWithStorage("groups", []);

export default groupsAtom;
