import { GetServerSideProps } from "next";
import { getRawDb } from "@/lib/mongoClient";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.params?.code as string;

  const db = await getRawDb();
  const found = await db.collection("links").findOne({ shortCode: code });

  if (!found) {
    return {
      redirect: {
        destination: "/not-found", // Or your homepage
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: found.originalUrl,
      permanent: false,
    },
  };
};

export default function RedirectPage() {
  return null; // This page only redirects
}
