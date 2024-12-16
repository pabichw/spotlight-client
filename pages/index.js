import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { supabase } from "../utils/supabaseClient";
import Pagination from "@mui/material/Pagination";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import JoyTypography from "@mui/joy/Typography";
import Box from "@mui/material/Box";
import { format, parseISO } from "date-fns";
import SearchBar from "../components/SearchBar";

const PER_PAGE = 12;

const fetchPhotos = async (page, search) => {
  const firstIndex = PER_PAGE * (page - 1);
  let request = supabase
    .from("spotlight_photos")
    .select(
      `
      id,
      name,
      url,
      created_at,
      tags (
        value
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(firstIndex, firstIndex + PER_PAGE - 1);

  if (search) {
    request = request.textSearch("name", search);
  }

  return await request;
};

export async function getServerSideProps({ query }) {
  const data = await fetchPhotos(query.page || 1, query.search);
  return { props: { photos: data.data } };
}

export default function Home({ photos }) {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: router.query.page || 1,
    pages: null,
  });
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handlePageChange = (_, page) => {
    setPagination({ ...pagination, page });
    router.push({ query: { page } });
  };

  const toggleGallery = (photo) => {
    setGalleryVisible(!galleryVisible);
    setActivePhotoIndex(photos.findIndex((ph) => ph.id === photo.id));
  };

  useEffect(() => {
    fetchPhotos(pagination.page).then((data) => {
      setPagination((state) => ({
        ...state,
        pages: Math.ceil(data.count / PER_PAGE),
      }));
    });
  }, [pagination.page]);

  return (
    <Container>
      <Head>
        <title>Spotlight Wallpapers</title>
      </Head>
      <Box mt={4}>
        <Box mb={2}>
          <Box>
            <Typography variant="h5">Spotlight Wallpapers</Typography>
            <Typography variant="subtitle2">
              Lock screen wallpapers from Windows 11 updated daily
            </Typography>
          </Box>
          <Box mt={2}>
            <SearchBar />
          </Box>
        </Box>
        <Grid container className={styles.photoGrid} spacing={2}>
          {photos?.map((photo, idx) => (
            <Grid
              item
              key={photo.id}
              xs={12}
              sm={6}
              md={4}
              data-testid="photo-card"
            >
              <Card
                sx={{ minHeight: "280px" }}
                className={styles.photoCard}
                onClick={() => toggleGallery(photo)}
              >
                <CardCover>
                  <Image
                    src={photo.url}
                    alt={photo.name}
                    width={400}
                    height={300}
                    objectFit="cover"
                    layout="responsive"
                    loading={idx < 2 ? "eager" : "lazy"}
                  />
                </CardCover>
                <CardCover
                  sx={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                  }}
                />
                <CardContent sx={{ justifyContent: "flex-end" }}>
                  <JoyTypography
                    level="h2"
                    fontSize="lg"
                    textColor="#fff"
                    mb={1}
                  >
                    {photo.name}
                  </JoyTypography>
                  <JoyTypography textColor="neutral.300">
                    {format(parseISO(photo.created_at), "dd/MM/yyyy")}
                  </JoyTypography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {pagination.pages && (
          <div className={styles.paginationWrapper}>
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={handlePageChange}
              data-testid="pagination"
            />
          </div>
        )}
        <footer className={styles.footer}>
          <Typography variant="body1">
            Above images are Windows 11 Spotlight (lock screen) pictures found
            on the internet. Updates happen on a daily basis. I do NOT own any
            rights to theese images. Project was made strictly for educational,
            non-commercial purpose.
          </Typography>
        </footer>
        {galleryVisible && (
          <div className={styles.galleryLayer}>
            <span className={styles.galleryCloseBtn} onClick={toggleGallery}>
              X
            </span>
            <ImageGallery
              items={photos.map((photo) => ({
                original: photo.url,
                thumbnail: photo.url,
              }))}
              startIndex={activePhotoIndex}
            />
          </div>
        )}
      </Box>
    </Container>
  );
}
