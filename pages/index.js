import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { supabase } from '../utils/supabaseClient'
import Pagination from '@mui/material/Pagination';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const PER_PAGE = 6;

const fetchPhotos = async (page) => {
  const firstIndex = PER_PAGE * (page - 1)
  return await supabase
    .from('spotlight_photos')
    .select('*', { count: 'exact' })
    .range(firstIndex, firstIndex + PER_PAGE - 1)
}

export async function getServerSideProps({query}) {
  const data = await fetchPhotos(query.page || 1);
  return { props: { photos: data.data } }
}

export default function Home({ photos }) {
  const router = useRouter()
  const [pagination, setPagination] = useState({ page: router.query.page || 1, pages: null });
  const [galleryVisible, setGalleryVisible] = useState(false);

  useEffect(() => {
    fetchPhotos(pagination.page).then(data => {
      setPagination(state => ({ ...state, pages: Math.ceil(data.count / PER_PAGE) }))
    })
  }, [pagination.page])

  const handlePageChange = (_, page) => {
    setPagination({ ...pagination, page })
    router.push({ query: { page }})
  }

  const toggleGallery = () => {
    setGalleryVisible(!galleryVisible)
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Spotlight Wallpapers</title>
        <meta name="description" content="Spotlight wallpapers from Windows 11" />
        <meta name="tags" content="spotlight wallpapers, windows 11, lockscreen wallpapers windows 11" />
      </Head>
      <h2>Spotlight Wallpapers</h2>
      <h4>Lock screen wallpapers from Windows 11 updated daily</h4>
      <article className={styles.photoGrid}>
        { photos?.map(photo => 
          <div key={photo.id} className={styles.photoCard} onClick={toggleGallery}>
            <Image 
              src={photo.url} 
              alt={photo.name} 
              width={400} 
              height={300} 
              objectFit="cover"
              layout='responsive'
            />
          </div>
        ) }
      </article>
      {pagination.pages && <div className={styles.paginationWrapper}>
        <Pagination count={pagination.pages} page={pagination.page} onChange={handlePageChange}/>
      </div>}
      <footer className={styles.footer}>
        <p>
          Above images are Windows 11 Spotlight (lock screen) pictures found on the internet. Updates happen on a daily basis.
          I do NOT own any rights to theese images. Project was made strictly for educational, non-commercial purpose.
        </p>
      </footer>
      {galleryVisible && 
        <div className={styles.galleryLayer}>
          <span className={styles.galleryCloseBtn} onClick={toggleGallery}>X</span>
          <ImageGallery items={photos.map(photo => ({ original: photo.url, thumbnail: photo.url }))} /> 
        </div>
      }
    </div>
  )
}
