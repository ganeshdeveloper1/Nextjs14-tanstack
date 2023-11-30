"use client";
import styles from "../styles/Home.module.css";
import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  QueryClientProvider,
  QueryClient,
  useMutation,
} from "@tanstack/react-query";
// import Pagination from "@material-ui/lab/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsFetching } from "@tanstack/react-query";
import RootLayout from "./layout";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState("");
  const [last, setlast] = useState("");
  const queryClient = useQueryClient();

  const fetchCharacter = async ({ pageParam }) => {
    const res = await fetch(
      "https://rickandmortyapi.com/api/character?page=" + pageParam
    );
    return res.json();
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["character"],
    isStale: 500,
    refetchOnMount: true,
    queryFn: fetchCharacter,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.info.next) return pages.length + 1;
    },
  });

  const handleFunc = async () => {
    const res = await fetch("http://192.168.0.141:3000/tests");
    return res.json();
  };

  const { refetch, data: testsData } = useQuery({
    queryKey: ["tests"],
    queryFn: handleFunc,
  });

  const handlePost = async (data) => {
    const response = await axios.post("http://192.168.0.141:3000/test", data);

    const result = await response.data;

    return result;
  };

  const { isPending, isSuccess, mutate } = useMutation({
    mutationKey: ["test"],
    mutationFn: handlePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tests"] }),
  });

  const handleDelete = async () => {
    const response = await axios.delete("http://192.168.0.141:3000/tests");
    return response;
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     queryClient.invalidateQueries("character"); // Invalidate the "character" query key
  //   }, 5000); // Invalidate every 5 seconds (same as refetchInterval)

  //   return () => clearInterval(interval);
  // }, [queryClient]);
  // useEffect(() => {
  //   handleFunc();
  // }, [val]);

  return (
    <div className={styles.container}>
      <button onClick={handleDelete}>Delete</button>
      {/* <h1>{usersQuery?.data?.root}</h1> */}

      {testsData?.root.map((item) => (
        <>
          <h1>First:{item.first_name}</h1>
          <h1>Last:{item.last_name}</h1>
        </>
      ))}
      <input
        className="z-50 mb-2"
        onChange={(e) => setFirst(e.target.value)}
        value={first}
      />
      <input
        className="z-50"
        onChange={(e) => setlast(e.target.value)}
        value={last}
      />
      <button
        onClick={() =>
          mutate({ first_name: first, last_name: last, is_active: true })
        }
      >
        Submit
      </button>
      <h2>{first}</h2>
      <h2>{last}</h2>
      {/* <Pagination
        count={data?.info.pages}
        variant="outlined"
        color="primary"
        className={"pagination"}
        style={{
          marginBottom: "30px"
        }}
        page={page}
        onChange={handlePaginationChange}
      /> */}
      {/* <button onClick={handleFunc}>Invalidate</button>
       */}
      <div className={styles.gridContainer}>
        {data?.pages.map((page) => (
          <>
            {page.results.map((character) => (
              <div key={character.id} className={styles.article}>
                <img
                  src={character.image}
                  alt={character.name}
                  height={200}
                  loading="lazy"
                  width={200}
                />
                <div className={styles.text}>
                  <p>Name: {character.name}</p>
                  <p>Lives in: {character.location.name}</p>
                  <p>Species: {character.species}</p>
                  <i>Id: {character.id} </i>
                </div>
              </div>
            ))}
          </>
        ))}
      </div>
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
    </div>
  );
}
