import { atomWithStorage } from "jotai/utils";

const tokenAtom = atomWithStorage("token", "");

export default tokenAtom;
