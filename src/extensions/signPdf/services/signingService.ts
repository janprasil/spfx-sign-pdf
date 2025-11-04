import { SignatureFormData } from "../components/SignatureForm/SignatureForm";
import useSignature from "../hooks/useSignature";
import { FileDefinition } from "../types/files";
import { CustomAadHttpClient } from "../utils/customAadClient";
import { safeRatioMul } from "../utils/math";
import { Mutex } from "../utils/mutex";

export type PresignBody = {
  presign: {
    CertificatePem: string;
    SpItemUrl: string;
    ServerRelativeUrl: string;
    Location: string | undefined;
    Reason: string | undefined;
    SignPageNumber: number;
    SignImageContent?: string;
    SignRect: { X: number; Y: number; Width: number; Height: number };
  };
};

export type PresignResponse = { $id: string; hashToSign: string };
export type PostsignBody = { postsign: { signedHash: string; id: string } };

export type SignDocumentsParams = {
  files: FileDefinition[];
  form: SignatureFormData;
  aadClient: CustomAadHttpClient;
  signHash: ReturnType<typeof useSignature>["signHash"];
  publicKey: string;
  onProgress?: (done: number, total: number) => void;
  concurrency?: number;
};

export function buildPresignBody(
  file: FileDefinition,
  form: SignatureFormData,
  idx: number,
  publicKey: string
): PresignBody {
  const pick = form.useForAll ? 0 : idx;
  const d = form.data[pick];
  const page = d.rect?.page ?? 1;

  const X = safeRatioMul(d.rect?.x, d.rect?.xRatio);
  const Y = d.rect?.pageHeight
    ? (d.rect.pageHeight ?? 0) -
      safeRatioMul(d.rect?.y, d.rect?.yRatio) -
      safeRatioMul(d.rect?.height, d.rect?.yRatio)
    : 0;
  const Width = safeRatioMul(d.rect?.width, d.rect?.xRatio);
  const Height = safeRatioMul(d.rect?.height, d.rect?.yRatio);

  const SignImageContent = form.signImageContent
    ? form.signImageContent.replace(/data:image\/[a-zA-Z]{3,4};base64,/, "")
    : undefined;

  return {
    presign: {
      CertificatePem: publicKey,
      SpItemUrl: file.spItemUrl,
      ServerRelativeUrl: file.serverRelativeUrl,
      Location: d.location,
      Reason: d.reason,
      SignPageNumber: page,
      SignImageContent,
      SignRect: { X, Y, Width, Height },
    },
  };
}

export function buildPostsignBody(
  id: string,
  signedHash: string
): PostsignBody {
  return { postsign: { signedHash, id } };
}

export async function signDocuments({
  files,
  form,
  aadClient,
  signHash,
  publicKey,
  onProgress,
  concurrency = 5,
}: SignDocumentsParams) {
  if (!files.length) return;

  let done = 0;
  const total = files.length;
  const mutex = new Mutex();

  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);

    await Promise.all(
      batch.map(async (file, localIdx) => {
        const idx = i + localIdx;

        const presignBody = buildPresignBody(file, form, idx, publicKey);
        const presigned = await aadClient.post<{
          hashToSign: string;
          $id: string;
        }>(presignBody);

        const signedHash = await mutex.runExclusive(() =>
          signHash(presigned.hashToSign)
        );

        const postsign = buildPostsignBody(presigned.$id, signedHash);
        await aadClient.post(postsign);

        done++;
        onProgress?.(done, total);
      })
    );
  }
}
