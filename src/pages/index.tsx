import React, { useState } from 'react';
import {
  Center,
  Heading,
  VStack,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import { CreateResponse } from './api/create';

export default function Home() {
  const toast = useToast();
  const [url, setUrl] = useState(``);
  const [loading, setLoading] = useState(false);

  const isInvalid = (() => {
    try {
      // eslint-disable-next-line no-new
      new URL(url);
      return false;
    } catch (e) {
      return true;
    }
  })();

  const submit = async () => {
    setUrl(``);
    setLoading(true);

    const data: CreateResponse = await fetch(`/api/create`, {
      method: `POST`,
      body: JSON.stringify({ url }),
      headers: {
        'Content-Type': `application/json`,
      },
    }).then((res) => res.json());

    setLoading(false);

    if (data.success) {
      await navigator.clipboard.writeText(`${window.location}${data.id}`);

      toast({
        description: `Redirect link copied to clipboard`,
        duration: 5000,
        status: `success`,
      });
    } else {
      toast({
        description: data.error,
        duration: 5000,
        status: `error`,
      });
    }
  };

  return (
    <Center width="100%" height="100%">
      <VStack width="md" alignContent="center" spacing="20px">
        <Heading color="gray.600" size="xl">
          shrt
        </Heading>
        <Input
          isInvalid={isInvalid && url.length > 0}
          placeholder="URL"
          size="lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={submit}
          isLoading={loading}
          isDisabled={isInvalid}
        >
          Shorten
        </Button>
      </VStack>
    </Center>
  );
}
