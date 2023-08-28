import Link from "next/link";
import { Card, Flex, Text, Title } from "@tremor/react";

export default function Web() {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      className="h-screen bg-slate-100"
    >
      <Card className="max-w-md">
        <Title className="text-2xl font-bold mb-4 text-center">
          Next Admin
        </Title>
        <Text className="text-center mb-6">
          Unleash your potential. Empower users. Simplify development. Get
          started now!
        </Text>
        <Link
          href="/admindemo"
          className="block mx-auto px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-300 text-center"
        >
          <Text className=" text-inherit">Explore Next Admin</Text>
        </Link>
      </Card>
    </Flex>
  );
}
