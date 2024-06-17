import { useRouter } from "next/router";
import NextAdmin from "../../../nextadmin";
import "../../../styles.css";

export default function Admin(props: any) {
  const router = useRouter();
  const { nextadmin } = router.query as { nextadmin: string[] };
  return <NextAdmin.Layout params={nextadmin} searchParams={undefined} />;
}
