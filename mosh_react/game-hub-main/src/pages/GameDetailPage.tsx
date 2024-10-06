import { useState } from "react";
import { useParams } from "react-router-dom";
import ExpandableText from "../components/ExpandableText";
import useGame from "../hooks/useGame";



export default function GameDetailPage() {
  const { slug } =  useParams();
  const { data, error, isLoading } = useGame(slug as string);

  if (isLoading) return <p>Loading...</p>;

  if (error) throw error;

  if (!data) throw new Error('Something went wrong when trying to retrieve game details');

  // if (!data) return null;

  return (
    <>
      <h1>{data.name}</h1>
      <p>
        <ExpandableText>
          {data.description_raw}
        </ExpandableText>
      </p>

    </>
  );
}