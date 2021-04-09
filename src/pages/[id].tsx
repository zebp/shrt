import React, { useEffect } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { PrismaClient } from '@prisma/client';
import { Heading, VStack } from '@chakra-ui/layout';
import { Center, Spinner } from '@chakra-ui/react';

type RedirectProps = {
  url: string | null;
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

  return {
    props: {
      url: record?.url || null,
    },
  };
}

export default function Redirect({ url }: RedirectProps) {
  if (!url) {
    return (
      <Center width="100%" height="100%">
        <VStack spacing="30px">
          <Heading color="gray.600">404 :(</Heading>
        </VStack>
      </Center>
    );
  }

  useEffect(() => {
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }, []);

  return (
    <Center width="100%" height="100%">
      <VStack spacing="30px">
        <Heading color="gray.600">Redirecting</Heading>
        <Spinner size="lg" color="blue.400" />
      </VStack>
    </Center>
  );
}
