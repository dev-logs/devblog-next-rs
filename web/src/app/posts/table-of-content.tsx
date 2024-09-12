export const TableOfContent = (props: any) => {
  const { post } = props || {};
  return (
    <div className="gap-y-8 lg:gap-8 sxl:gap-16 mt-8 xl:max-w-full max-w-prose text-sm bg-black backdrop-blur-3xl bg-opacity-40 rounded-xl">
      <div className="col-span-full">
        <details className="rounded-xl p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto">
          <summary className="text-sm font-semibold capitalize cursor-pointer text-white">
            Table Of Content
          </summary>
          <ul className="mt-4 font-in text-sm">
            {(post.toc || []).map((heading: any) => {
              return (
                <li key={`#${heading.slug}`} className="py-1">
                  <a
                    href={`#${heading.slug}`}
                    data-level={heading.level}
                    className="data-[level=two]:pl-0  data-[level=two]:pt-2
                               data-[level=two]:border-t border-solid border-dark/40
                               data-[level=three]:pl-4
                               sm:data-[level=three]:pl-6
                               flex items-center justify-start"
                  >
                    {heading.level === "three" ? (
                      <span className="flex w-1 h-1 rounded-full bg-dark mr-2">
                        &nbsp;
                      </span>
                    ) : null}

                    <span className="hover:underline text-gray-200">
                      {heading.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </details>
      </div>
    </div>
  );
};
