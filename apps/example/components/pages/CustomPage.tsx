import { prisma } from "../../prisma";
import { createRandomPost } from "../../actions/posts";

const CustomPage = async () => {
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalCategories = await prisma.category.count();

  return (
    <div>
      <p className="text-xl font-medium">This is a custom page</p>
      <p className="text-md">Total Users: {totalUsers}</p>
      <p className="text-md">Total Posts: {totalPosts}</p>
      <p className="text-md">Total Categories: {totalCategories}</p>
      <form action={createRandomPost} className="mt-2">
        <button
          type="submit"
          className="bg-indigo-500 p-2 text-white hover:bg-indigo-700 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Create random post
        </button>
      </form>
    </div>
  );
};

export default CustomPage;
