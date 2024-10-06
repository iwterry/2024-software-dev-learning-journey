import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostQuery {
  pageSize: number;
}

export default function usePosts(postQuery: PostQuery) {
  function fetchPosts({ pageParam = 1 /* for the first page */}) {
    return  axios
    .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {   
      params: {
        _start: (pageParam - 1) * postQuery.pageSize,
        _limit: postQuery.pageSize
      }
    })
    .then((res) => res.data);
  }

    const query = useInfiniteQuery<Post[], Error>({
      queryKey: ['posts', postQuery ], // you can also do the following: userId ? ['users', userId, 'posts'] : ['posts']
                                            // ReactQuery will re-execute the query when the userId changes
      queryFn: fetchPosts,
      staleTime: 10_000,
      keepPreviousData: true,  // not necessary but will help keep the page from jumping up as data load when changing pages
      getNextPageParam: (lastPage, allPages ) => {
        // allPages is an array of an array of posts
        // allPages[0] represents the array of posts for the first page
        // allPages[1] represents the array of posts for the second page
        // and so on

        // allPages.length will grow by one for each new page

        // so to identify the current page number, use allPages.length
        // and so the next page will be allPages.length + 1

        // when there is no more data, https://jsonplaceholder.typicode.com/posts will return an empty array
        
        // the value undefined is used to say there is no next page when doing infinite queries with ReactQuery

        return lastPage.length > 0 ? allPages.length  + 1 : undefined; 
        
      }
    })

    return query;
}