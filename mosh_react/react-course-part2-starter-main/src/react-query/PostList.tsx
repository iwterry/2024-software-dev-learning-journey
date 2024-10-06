import usePosts from "./hooks/usePosts";

const PostList = () => {
  
  // No state is used to keep track of page numbers when doing infinite queries.
  // ReactQuery will handle pagination automatically
  // const [ page, setPage ] = useState(1);

  const pageSize = 10;

  const { data: posts, error, isLoading, fetchNextPage, isFetchingNextPage } = usePosts({ pageSize });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <ul className="list-group">
        {posts.pages.map((page) => (
          page.map((post) => (
            <li key={post.id} className="list-group-item">
              {post.title}
            </li>
          ))
        ))}
      </ul>
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>Load More</button>
    </>
  );
};

export default PostList;
