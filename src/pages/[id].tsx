import redirect from 'nextjs-redirect';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { PrismaClient } from '@prisma/client';

type RedirectProps = {
  url: string | null;
  expired: boolean;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
): Promise<GetServerSidePropsResult<RedirectProps>> {
  const prisma = new PrismaClient();
  const id = context.params?.id;

  const record = await prisma.redirect.findFirst({
    where: {
      id,
    },
  });

  const expired = record?.expires
    ? record?.expires.getTime() / 1000 > Date.now() / 1000
    : false;

  return {
    props: {
      url: record?.url || null,
      expired,
    },
  };
}

export default function Redirect({ url, expired }: RedirectProps) {
  if (expired) {
    return <p>Expired!</p>;
  }

  if (!url) {
    return <div>Redirect not found</div>;
  }

  const RedirectComponent = redirect(url, {
    statusCode: 302,
  });

  return <RedirectComponent>Redirecting...</RedirectComponent>;
}
