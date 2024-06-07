import { NextApiRequest, NextApiResponse } from "next";

export default async function emailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body) as string[] | number[];
    res
      .status(200)
      .json({ message: "Email sent to " + body.length + " users" });
  }
}
