import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { supabase } from '../utils/supabaseClient'
import Pagination from '@mui/material/Pagination';

const PER_PAGE = 6;

export default function Home() {
  const router = useRouter()
  const [photos, setPhotos] = useState([])
  const [pagination, setPagination] = useState({ page: router.query.page || 1, pages: 100 });

  useEffect(() => {
    fetchPhotos(pagination.page)
  }, [pagination.page])

  const fetchPhotos = async (page) => {
    const firstIndex = PER_PAGE * (page - 1)
    const data = await supabase
      .from('spotlight_photos')
      .select('*', { count: 'exact' })
      .range(firstIndex, firstIndex + PER_PAGE - 1)

    setPhotos(data.data);
    setPagination(state => ({ ...state, pages: Math.ceil(data.count / PER_PAGE) }))
  }

  const handlePageChange = (_, page) => {
    setPagination({ ...pagination, page })
    router.push({ query: { page }})
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
          <div key={photo.id} className={styles.photoCard}>
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
      <div className={styles.paginationWrapper}>
        <Pagination count={pagination.pages} page={pagination.page} onChange={handlePageChange}/>
      </div>
      <footer className={styles.footer}>
        <p>
          Above images are Windows 11 Spotlight (lock screen) pictures found on the internet. Updates happen on a daily basis.
          I do NOT own any rights to theese images. Project was made strictly for educational, non-commercial purpose.
        </p>
      </footer>
    </div>
  )
}
