import { coauthor } from '@coauthors/core'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Delay, Suspense, useErrorBoundaryFallbackProps } from '@suspensive/react'
import { QueryErrorBoundary, SuspenseQuery, queryOptions } from '@suspensive/react-query'
import { QueryClient, QueryClientProvider, useIsFetching, useQueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCopyToClipboard, useDebounceCallback, useLocalStorage, useTimeout } from 'usehooks-ts'
import { z } from 'zod'

const query = {
  coauthor: (...params: Parameters<typeof coauthor>) =>
    queryOptions({
      queryKey: ['coauthor', ...params] as const,
      queryFn: () => coauthor(...params),
    }),
}






const formSchema = z.object({
  user: z.string().min(1),
})

export const CoauthorsGenerator = () => {
  const queryClient = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 0 } } }))[0]

  const [authors, setAuthors] = useLocalStorage<Array<z.infer<typeof formSchema> & { name?: string }>>(
    'Coauthors Generator',
    []
  )
  const { register, control, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>({
    defaultValues: { user: '' },
    resolver: zodResolver(formSchema),
  })

  const debouncedSetAuthors = useDebounceCallback(
    ({ user, name }: { user: string; name: string }) =>
      setAuthors((prev) => prev.map((author) => (author.user === user ? { ...author, name } : author))),
    200
  )

  return (
    <QueryClientProvider client={queryClient}>
      <form
        action="submit"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit((formData) => {
          setAuthors((prev) => [...prev.filter(({ user }) => user !== formData.user), formData])
          reset()
        })}
        className="text-left"
      >
        <div className="flex w-full items-center">
          <span className="flex-1">
            <input
              className="h-10 w-full rounded-l-lg bg-[#f9fafb1a] px-4 py-2"
              id="user"
              type="text"
              placeholder="GitHub Username"
              {...register('user')}
              required
            />
          </span>
          <button className="h-10 rounded-r-lg bg-black px-4 text-white" type="submit">
            Add
          </button>
        </div>
      </form>
      <br />
      <Delay ms={1}>
        <section className="flex flex-col gap-3 rounded-lg border border-white border-opacity-10 bg-[#00000040] p-4">
          {authors.length === 0 ? <p className="opacity-60">Add new one as co-author by upper form</p> : null}
          {authors.map(({ name, user }) => (
            <QueryErrorBoundary
              key={user}
              fallback={() => (
                <ErrorBoundaryFallback
                  username={user}
                  onRemove={() => setAuthors((prev) => prev.filter((authors) => authors.user !== user))}
                />
              )}
            >
              <div key={user} className="flex flex-col items-center gap-2 text-left xl:flex-row">
                <Suspense fallback="loading...">
                  <SuspenseQuery {...query.coauthor({ user, name })}>
                    {({ data: coauthor }) => <p className="self-start break-all xl:flex-1 xl:self-auto">{coauthor}</p>}
                  </SuspenseQuery>
                </Suspense>
                <div className="flex w-full items-center gap-2 xl:w-auto">
                  <input
                    className="h-10 flex-1 select-none rounded-lg border border-black border-opacity-10 bg-[#f9fafb1a] py-2 pl-4 xl:w-[180px]"
                    type="text"
                    onChange={(e) => debouncedSetAuthors({ user, name: e.target.value })}
                    placeholder="Custom name"
                  />
                  <button
                    type="button"
                    onClick={() => setAuthors((prev) => prev.filter((authors) => authors.user !== user))}
                    className="h-10 w-[50px] select-none rounded bg-black"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </QueryErrorBoundary>
          ))}
          {authors.length > 0 ? (
            <>
              <CopyButton authors={authors} />
              <p className="text-center opacity-60">Copy & Paste on commit message</p>
            </>
          ) : null}
        </section>
        <DevTool control={control} />
      </Delay>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

const CopyButton = ({ authors }: { authors: Array<z.infer<typeof formSchema> & { name?: string }> }) => {
  const [, copy] = useCopyToClipboard()
  const isFetching = useIsFetching()
  const queryClient = useQueryClient()

  const textToText = authors
    .map((author) => queryClient.getQueryData(query.coauthor(author).queryKey))
    .map((coAuthoredString) => `\n${coAuthoredString}`)
    .join('')

  return (
    <button
      type="button"
      disabled={!!isFetching || !textToText}
      onClick={() => {
        copy(textToText).then(() => {
          alert(`📋 Coauthors: Copied!
${textToText}`)
        })
      }}
      className="h-10 select-none rounded bg-black"
    >
      {isFetching || !textToText ? 'loading...' : textToText ? '📋 Copy all' : null}
    </button>
  )
}

const ErrorBoundaryFallback = ({ username, onRemove }: { username: string; onRemove: () => void }) => {
  const { error } = useErrorBoundaryFallbackProps()

  useTimeout(() => {
    onRemove()
  }, 1500)

  return (
    <>
      {username}: {error.message} (This will be disappear after 1.5s)
      <button type="button" style={{ fontSize: 12, userSelect: 'none', marginLeft: 8 }} onClick={onRemove}>
        🗑️
      </button>
    </>
  )
}
