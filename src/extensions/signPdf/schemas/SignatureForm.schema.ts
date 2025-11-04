import { z } from "zod";

export const SignatureFormSchema = z.object({
  useForAll: z.boolean().optional(),
  signImageContent: z.string().optional(),
  data: z.array(
    z.object({
      reason: z.string().nonempty({ message: "Důvod podpisu je povinný" }),
      location: z.string().nonempty({ message: "Lokace podpisu je povinná" }),
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
    })
  ),
});
