
import NextAdmin from "../../../nextadmin"
import "../../../styles.css";

export default function Admin(props: any) {
  return <NextAdmin.Component {...props} />;
}

// export const getServerSideProps = async (req: GetServerSidePropsContext) => {
//   const { params, query } = req;
//   const nextAdminProps = await getNextAdminProps({
//     basePath: "/pagerouter/admin",
//     apiBasePath: "/api/admin",
//     params: params?.nextadmin as string[],
//     searchParams: query,
//     options,
//   });
//   return { props: nextAdminProps };
// };
