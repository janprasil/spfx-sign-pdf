import { z } from "zod";

export const SignatureFormSchema = z
  .object({
    useForAll: z.boolean().optional(),
    signImageContent: z.string().optional(),
    imageSelector: z
      .enum(["empty", "upload", "company", "personal"])
      .default("empty"),
    useColumnAttachment: z.boolean().optional(),
    columnAttachment: z.string().optional(),
    data: z.array(
      z.object({
        reason: z.string().optional(),
        location: z.string().optional(),
        rect: z.object(
          {
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
            page: z.number(),
            xRatio: z.number(),
            yRatio: z.number(),
            pageHeight: z.number().optional(),
          },
          { required_error: "Umístění podpisu je povinné" }
        ),
        attachmentFile: z
          .object({
            fileName: z.string().optional(),
            base64Content: z.string(),
          })
          .optional(),
      })
    ),
  })
  .superRefine((value, ctx) => {
    console.log("value", value);
    if (value.useColumnAttachment && !value.columnAttachment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["columnAttachment"],
        message: "Select a column with attachment link",
      });
    }
  });
