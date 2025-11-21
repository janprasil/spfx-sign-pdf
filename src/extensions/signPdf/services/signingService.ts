import { SignatureFormData } from "../components/SignatureForm/SignatureForm";
import useSignature from "../hooks/useSignature";
import { FileDefinition } from "../types/files";
import { CustomAadHttpClient } from "../utils/customAadClient";
import { safeRatioMul } from "../utils/math";
import { Mutex } from "../utils/mutex";
import { UploadedAttachment } from "../types/attachments";

export type AttachmentPayload = {
  Type: "sharepoint" | "public_url" | "base64";
  SpItemUrl?: string;
  ServerRelativeUrl?: string;
  Url?: string;
  Base64Content?: string;
  FileName?: string;
  Description?: string;
};

export type PresignBody = {
  presign: {
    CertificatePem?: string;
    SpItemUrl: string;
    ServerRelativeUrl: string;
    Location: string | undefined;
    Reason: string | undefined;
    SignPageNumber: number;
    SignImageContent?: string;
    SignRect: { X: number; Y: number; Width: number; Height: number };
    Attachment?: AttachmentPayload;
  };
};

export type PresignResponse = { $id: string; hashToSign: string };
export type PostsignBody = { postsign: { signedHash: string; id: string } };
export type ServerSignatureImages = {
  companyImage?: string;
  privateImage?: string;
};

export type SignDocumentsParams = {
  files: FileDefinition[];
  form: SignatureFormData;
  aadClient: CustomAadHttpClient;
  signHash: ReturnType<typeof useSignature>["signHash"];
  publicKey?: string;
  onProgress?: (done: number, total: number) => void;
  concurrency?: number;
  images?: ServerSignatureImages;
};

export function buildPresignBody(
  file: FileDefinition,
  form: SignatureFormData,
  idx: number,
  publicKey?: string,
  images?: ServerSignatureImages
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
    : form.imageSelector === "company"
    ? images?.companyImage
    : form.imageSelector === "personal"
    ? images?.privateImage
    : undefined;

  const attachment = resolveAttachment(file, form, pick);

  return {
    presign: {
      CertificatePem: publicKey ?? undefined,
      SpItemUrl: file.spItemUrl,
      ServerRelativeUrl: file.serverRelativeUrl,
      Location: d.location,
      Reason: d.reason,
      SignPageNumber: page,
      SignImageContent,
      SignRect: { X, Y, Width, Height },
      Attachment: attachment,
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
  images,
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

        const presignBody = buildPresignBody(
          file,
          form,
          idx,
          publicKey,
          images
        );
        const presigned = await aadClient.post<{
          document: {
            hashToSign: string;
            id: string;
          };
        }>(
          publicKey
            ? "/api/sharepoint/callback/presign"
            : "/api/sharepoint/callback/timestamp",
          presignBody.presign
        );

        if (publicKey) {
          const signedHash = await mutex.runExclusive(() =>
            signHash(presigned.document.hashToSign)
          );

          const postsign = buildPostsignBody(presigned.document.id, signedHash);
          await aadClient.post(
            "/api/sharepoint/callback/sign",
            postsign.postsign
          );
        }

        done++;
        onProgress?.(done, total);
      })
    );
  }
}

function resolveAttachment(
  file: FileDefinition,
  form: SignatureFormData,
  pick: number
): AttachmentPayload | undefined {
  const fromUpload = buildAttachmentFromUpload(form.data[pick]?.attachmentFile);
  if (fromUpload) return fromUpload;

  return buildAttachmentFromColumnValue(file, form);
}

function buildAttachmentFromUpload(
  attachment?: UploadedAttachment
): AttachmentPayload | undefined {
  if (!attachment?.base64Content) return undefined;

  return {
    Type: "base64",
    Base64Content: attachment.base64Content,
    FileName: attachment.fileName,
    Description: "",
  };
}

function buildAttachmentFromColumnValue(
  file: FileDefinition,
  form: SignatureFormData
): AttachmentPayload | undefined {
  if (!form.useColumnAttachment || !form.columnAttachment) return undefined;
  if (!file.columnValues) return undefined;

  const rawValue = file.columnValues[form.columnAttachment];
  const url = extractUrlFromValue(rawValue);
  if (!url) return undefined;

  return mapUrlToAttachment(url);
}

function extractUrlFromValue(value: any): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
  }

  if (value && typeof value === "object") {
    const maybeUrl = (value as any).Url || (value as any).url;
    if (typeof maybeUrl === "string" && /^https?:\/\//i.test(maybeUrl)) {
      return maybeUrl;
    }
  }

  return undefined;
}

function mapUrlToAttachment(url: string): AttachmentPayload {
  try {
    const parsed = new URL(url);
    const filename = extractFileName(parsed.pathname);
    const isSameOrigin =
      typeof window !== "undefined" &&
      typeof window.location !== "undefined" &&
      window.location.origin === parsed.origin;

    console.log(url, isSameOrigin, filename, parsed);
    if (isSameOrigin) {
      return {
        Type: "sharepoint",
        SpItemUrl: url,
        ServerRelativeUrl: parsed.pathname + parsed.search,
        FileName: filename,
        Description: "",
      };
    }

    return {
      Type: "public_url",
      Url: url,
      FileName: filename,
      Description: "",
    };
  } catch (e) {
    return {
      Type: "public_url",
      Url: url,
      FileName: extractFileName(url),
      Description: "",
    };
  }
}

function extractFileName(path: string): string | undefined {
  if (!path) return undefined;
  const withoutQuery = path.split("?")[0];
  const segments = withoutQuery.split("/");
  const last = segments.pop();
  if (!last) return undefined;
  return decodeURIComponent(last);
}
