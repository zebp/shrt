import {
  Center,
  Heading,
  VStack,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';

const REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

interface CreateResponse {
  error?: string;
  id?: string;
}

export default function Home() {
  const toast = useToast();
  const [url, setUrl] = useState(``);
  const [loading, setLoading] = useState(false);

  const isInvalid = !REGEX.test(url);

  const submit = async () => {
    setUrl(``);
    setLoading(true);

    const data = { url };
    const resData: CreateResponse = await fetch(`/api/create`, {
      method: `POST`,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': `application/json`,
      },
    }).then((res) => res.json());

    setLoading(false);

    if (resData.id) {
      await navigator.clipboard.writeText(`${window.location}${resData.id}`);

      toast({
        description: `Redirect link copied to clipboard`,
        duration: 5000,
        status: `success`,
      });
    }

    if (resData.error) {
      toast({
        description: resData.error,
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
