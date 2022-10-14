import { useAtom } from "jotai";
import groupsAtom from "../groupsAtom";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function NewGroup() {
  const router = useRouter();
  const [, setGroups] = useAtom(groupsAtom);

  useEffect(() => {
    if (router.isReady) {
      setGroups((g) => [...g, JSON.parse(router.query.data)]);
      router.push("/groups");
    }
  }, [router]);

  return null;
}
