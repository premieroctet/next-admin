import { Divider, Text, Title } from "@tremor/react";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5 p-10">
      <div className="flex items-center justify-start">
        <div className="mr-10 flex w-2/3 flex-col gap-2">
          <Title className="text-5xl font-black">Next Admin</Title>
          <Text>
            Next Admin is a tool for creating a dashboard for your Next.js
            application.
          </Text>
          <Text>
            You can use it to manage your database using{" "}
            <a
              href="https://prisma.io"
              className="text-blue-500 hover:underline"
            >
              Prisma ORM
            </a>{" "}
            and provide a simple admin interface for your users.
          </Text>
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-start pt-10">
        <div className="mr-10 flex w-1/2 flex-col gap-2">
          <img
            src="/assets/model.png"
            width={700}
            height={700}
            alt="schema image"
            className="rounded-md shadow-2xl"
          />
        </div>
        <div className="mr-10 flex w-1/2 flex-col gap-2">
          <Title className="text-4xl font-bold">Demonstration</Title>
          <Text>
            This dashboard is a demonstration of the capabilities of Next Admin.
          </Text>
          <Text>
            You can find different examples of relation management, search, and
            more. This demo is using the schema below.
          </Text>
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-start pt-10">
        <div className="mr-10 flex w-1/2 flex-col gap-2">
          <Title className="text-4xl font-bold">Customizable</Title>
          <Text>
            You can easily customize the dashboard to suit your needs. Even this
            page is customizable.
          </Text>
          <Text>
            Every part of the CRUD is customizable. You can choose which fields
            to display, which fields to edit, and more.
          </Text>
        </div>
        <div className="mr-10 flex w-1/2 flex-col gap-2">
          <img
            src="/assets/code.png"
            width={500}
            height={500}
            alt="code image"
            className="rounded-md shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
