import { TRPCError } from "@trpc/server";

/**
 * Checks if error is a intentionally thown error, if so throws the same error back
 * Otherwise throws "Something went wrong" with status code INTERNAL_SERVER_ERROR
 * @param e unknown, usually the object that catch receives
 */
const somethingWentWrong: (e?: unknown) => never = (e?: unknown) => {
  if (e && e instanceof TRPCError) throw e;

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};

export { somethingWentWrong };
