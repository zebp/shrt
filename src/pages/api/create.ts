import * as z from 'zod';
import { randomFillSync } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import base64url from 'base64url';

export interface SuccessfulCreateResponse {
  success: true;
  id: string;
}

export interface UnsuccessfulCreateResponse {
  success: false;
  error: string;
}

export type CreateResponse =
  | SuccessfulCreateResponse
  | UnsuccessfulCreateResponse;

const bodySchema = z.object({
  url: z.string().url(),
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
        id: base64url(Buffer.from(randomFillSync(new Uint8Array(16)))),
        ...body,
      },
      select: {
        id: true,
      },
    });

    res.json({ success: true, id });
  } catch (error) {
    res.status(400).json({ success: false, error: `Invalid url` });
  }
};
