'use client'

import { Header } from '@/components/Header'
import styles from './page.module.css'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ButtonStream } from '@/components/ButtonStream'

import gitSVG from '../assets/Octicons-mark-github.svg'
import linkedinSVG from '../assets/linkedin.svg'

interface User {
  image: string
  title: string
  director: string
  rating: string
  description: string
  trailer: string
}

interface Search {
  link: string
}

export default function Home() {
  const [data, setData] = useState<User>()
  const [dataNetflix, setDataNetflix] = useState<Search>()
  const [dataPrime, setDataPrime] = useState<Search>()
  const [dataHulu, setDataHulu] = useState<Search>()
  const [dataHbo, setDataHbo] = useState<Search>()
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber())

  const options = {
    method: 'GET',
    url: `https://imdb-top-100-movies.p.rapidapi.com/top${randomNumber}`,
    headers: {
      'X-RapidAPI-Key': 'b5b64085famshd1a45bf01935c88p1c06cbjsn6458edcf15a2',
      'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com',
    },
  }
  // função que busca os dados da api com o title do filme que esta no useState data
  const optionsSearch = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/v2/search/title',
    params: {
      title: data?.title,
      country: 'us',
      type: 'movie',
      output_language: 'en',
    },
    headers: {
      'X-RapidAPI-Key': 'b5b64085famshd1a45bf01935c88p1c06cbjsn6458edcf15a2',
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
    },
  }
  async function fetchData() {
    axios
      .request(options)
      .then(function (response) {
        setData(response.data)
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  async function fetchDataPrime() {
    axios
      .request(optionsSearch)
      .then(function (response) {
        setDataPrime(response.data.result[0].streamingInfo.us.prime[0])
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  async function fetchDataNetflix() {
    axios
      .request(optionsSearch)
      .then(function (response) {
        setDataNetflix(response.data.result[0].streamingInfo.us.netflix[0])
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  async function fetchDataHulu() {
    axios
      .request(optionsSearch)
      .then(function (response) {
        setDataHulu(response.data.result[0].streamingInfo.us.hulu[0])
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  async function fetchDataHbo() {
    axios
      .request(optionsSearch)
      .then(function (response) {
        setDataHbo(response.data.result[0].streamingInfo.us.hbo[0])
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1
  }

  function handleButtonClick() {
    setRandomNumber(generateRandomNumber())
    fetchData()
    fetchDataPrime()
    fetchDataNetflix()
    fetchDataHulu()
    fetchDataHbo()
    console.log(dataNetflix, dataPrime, dataHulu, dataHbo)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData()
    fetchDataPrime()
    fetchDataNetflix()
    fetchDataHulu()
    fetchDataHbo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomNumber])

  function handleNetflix() {
    window.open(dataNetflix?.link, '_blank')
  }

  function handlePrimeVideo() {
    window.open(dataPrime?.link, '_blank')
  }

  function handleHbo() {
    window.open(dataHbo?.link, '_blank')
  }

  function handleHulu() {
    window.open(dataHulu?.link, '_blank')
  }
  // skeleton loading antes de carregar os dados
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.leftCol}>
            {data ? (
              <Image
                className={styles.banner}
                src={data.image}
                alt={'Image of movie'}
                width={380}
                height={562}
              />
            ) : (
              <div className={styles.skeletonBanner} />
            )}

            <button
              className={styles.shuffleButton}
              onClick={handleButtonClick}
            >
              SHUFFLE
            </button>
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.rightCol}>
              <div className={styles.headerContent}>
                <div className={styles.titleContent}>
                  {data ? (
                    <h2 className={styles.title}>{data.title}</h2>
                  ) : (
                    <div className={styles.skeletonContent} />
                  )}
                  {data ? (
                    <p className={styles.subtitle}>{data.director}</p>
                  ) : (
                    <div className={styles.skeletonSubtitle} />
                  )}
                </div>
                <div className={styles.contentStars}>
                  {data ? (
                    <h2 className={styles.rating}>{data.rating}</h2>
                  ) : (
                    <div className={styles.skeletonRating} />
                  )}
                </div>
              </div>
              <div className={styles.description}>
                {data ? (
                  <h2 className={styles.subtitleDescription}>
                    {data.description}
                  </h2>
                ) : (
                  <div className={styles.skeletonDescription} />
                )}
              </div>
              <div className={styles.trailerContainer}>
                {data ? (
                  <iframe
                    style={{ borderRadius: 6 }}
                    width="560"
                    height="315"
                    className={styles.iframe}
                    src={data.trailer}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className={styles.skeletonTrailer} />
                )}
                <div className={styles.buttonContainer}>
                  <ButtonStream
                    netflix={handleNetflix}
                    prime={handlePrimeVideo}
                    hbo={handleHbo}
                    hulu={handleHulu}
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttonsSocial}>
              <button className={styles.buttonProject}>
                📆 ONE WEEK PROJECT
              </button>
              <button className={styles.buttonGithub}>
                <Image src={gitSVG} alt="" width={24} />
                Repository
              </button>
              <button className={styles.buttonLinkedin}>
                <Image src={linkedinSVG} alt="" width={24} />
                Daniel Gabriel
              </button>
              <button className={styles.buttonLinkedin}>
                <Image src={linkedinSVG} alt="" width={24} />
                Kelvin Quida
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
