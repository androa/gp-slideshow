import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";
import { signIn, signOut, useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import styles from "../styles/Slideshow.module.css";

const fetcher = (url) => fetch(url).then((res) => res.json());
const delay = 1;

export default function Slideshow() {
  const [session] = useSession();
  const { data: photos } = useSWR("/api/photos", fetcher, {
    refreshInterval: 60 * 1000,
  });
  let [index, setIndex] = useState(0);

  useEffect(() => {
    const updatePhotoInterval = setTimeout(() => {
      if (photos && index >= photos.mediaItems.length - 1) {
        setIndex(0);
      } else {
        setIndex(index + 1);
      }
    }, delay * 1000);

    return () => {
      clearTimeout(updatePhotoInterval);
    };
  }, [photos, index]);

  let currentPhoto;
  if (photos) {
    currentPhoto = photos.mediaItems[index];
  }
  return (
    <>
      <Head>
        <title>Slideshow with Google Photos</title>
        <meta
          name="description"
          content="Slideshows of photos from Google Photos"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn("google")}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}

      {currentPhoto && (
        <Image
          src={currentPhoto.baseUrl}
          priority={true}
          objectFit={"contain"}
          layout="fill"
        />
      )}
      {false && currentPhoto && (
        <div
          className={styles.image}
          key={currentPhoto.id}
          style={{ backgroundImage: `url(${currentPhoto.baseUrl})` }}
        />
      )}
    </>
  );
}
