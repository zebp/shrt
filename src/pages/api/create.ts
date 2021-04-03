import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import * as z from 'zod';

// Just a list of words for us to use for name generation.
const { nouns }: { nouns: string[] } = require(`nouns`);
const adjectives: string[] = require(`adjectives`);

/**
 * @returns a random entry from the list
 */
function pickOne(list: string[]): string {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const index = Math.floor(Math.random() * list.length);
    const word = list[index].toLowerCase();

    if (!word.includes(`-`)) return word;
  }
}

const bodySchema = z.object({
  url: z.string().url(),
  expires: z.date().optional(),
});

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== `POST`) {
    res.status(404).json({ error: `endpoint not found` });
    return;
  }

  try {
    const body = bodySchema.parse(req.body);
    const { id } = await prisma.redirect.create({
      data: {
        id: `${pickOne(adjectives)}${pickOne(adjectives)}${pickOne(nouns)}`,
        ...body,
      },
      select: {
        id: true,
      },
    });

    res.json({ id });
  } catch (error) {
    res.status(400).json({ error: `invalid body` });
  }
};
