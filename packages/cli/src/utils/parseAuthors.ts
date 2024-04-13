export const parseAuthors = (args: string[]) =>
  args.map((arg) => {
    const [user, name] = arg.split(/\(([^)]+)\)/);
    return { user, name };
  });
