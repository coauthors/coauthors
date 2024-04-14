import { coauthor } from "@coauthors/core";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Delay,
  Suspense,
  useErrorBoundaryFallbackProps,
} from "@suspensive/react";
import {
  QueryErrorBoundary,
  SuspenseQuery,
  queryOptions,
} from "@suspensive/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback, useLocalStorage, useTimeout } from "usehooks-ts";
import { z } from "zod";

const query = {
  coauthor: (...params: Parameters<typeof coauthor>) =>
    queryOptions({
      queryKey: ["coauthor", ...params] as const,
      queryFn: () => coauthor(...params),
    }),
};

const formSchema = z.object({
  user: z.string().min(1),
});

export const CoauthorsGenerator = () => {
  const queryClient = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 0 } } }),
  )[0];

  const [authors, setAuthors] = useLocalStorage<
    Array<z.infer<typeof formSchema> & { name?: string }>
  >("Coauthors Generator", []);
  const { register, control, handleSubmit, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    defaultValues: { user: "" },
    resolver: zodResolver(formSchema),
  });

  const debouncedSetAuthors = useDebounceCallback(
    ({ user, name }: { user: string; name: string }) =>
      setAuthors((prev) =>
        prev.map((author) =>
          author.user === user ? { ...author, name } : author,
        ),
      ),
    200,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <form
        action="submit"
        onSubmit={handleSubmit((formData) => {
          setAuthors((prev) => [
            ...prev.filter(({ user }) => user !== formData.user),
            formData,
          ]);
          reset();
        })}
        className="text-left"
      >
        <div className="flex items-center w-full gap-2">
          <span className="flex-1">
            <input
              className="rounded w-full border-black border-opacity-10 border p-2 h-10"
              id="user"
              type="text"
              placeholder="GitHub Username"
              {...register("user")}
              required
            />
          </span>
          <button
            className="bg-black rounded h-10 px-4 text-white"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
      <br />
      <Delay ms={1}>
        <section className="flex flex-col gap-3 bg-[#fafafa] border-black border-opacity-10 border p-4 rounded-md">
          {authors.length === 0 ? (
            <p className="opacity-60">Add new one as co-author by upper form</p>
          ) : null}
          {authors.map(({ name, user }) => (
            <QueryErrorBoundary
              key={user}
              fallback={() => (
                <ErrorBoundaryFallback
                  username={user}
                  onRemove={() =>
                    setAuthors((prev) =>
                      prev.filter((authors) => authors.user !== user),
                    )
                  }
                />
              )}
            >
              <div
                key={user}
                className="flex text-left gap-2 flex-col xl:flex-row items-center"
              >
                <Suspense fallback="loading...">
                  <SuspenseQuery {...query.coauthor({ user, name })}>
                    {({ data: coauthor }) => (
                      <p className="self-start break-all xl:self-auto xl:flex-1">
                        {coauthor}
                      </p>
                    )}
                  </SuspenseQuery>
                </Suspense>
                <div className="flex items-center gap-2 w-full xl:w-auto">
                  <input
                    className="rounded border-black border-opacity-10 border xl:w-[180px] p-2 h-10 flex-1 select-none"
                    type="text"
                    onChange={(e) =>
                      debouncedSetAuthors({ user, name: e.target.value })
                    }
                    placeholder="Change name if need"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAuthors((prev) =>
                        prev.filter((authors) => authors.user !== user),
                      )
                    }
                    className="select-none bg-white bg-opacity-10 w-[50px] h-10 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </QueryErrorBoundary>
          ))}
        </section>
        {authors.length > 0 ? (
          <p className="opacity-60 text-center mt-6">
            ⌨️ Copy & Paste on commit message ⌨️
          </p>
        ) : null}
        <DevTool control={control} />
      </Delay>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

const ErrorBoundaryFallback = ({
  username,
  onRemove,
}: {
  username: string;
  onRemove: () => void;
}) => {
  const { error } = useErrorBoundaryFallbackProps();

  useTimeout(() => {
    onRemove();
  }, 1500);

  return (
    <>
      {username}: {error.message} (This will be disappear after 1.5s)
      <button
        type="button"
        style={{ fontSize: 12, userSelect: "none", marginLeft: 8 }}
        onClick={onRemove}
      >
        🗑️
      </button>
    </>
  );
};
