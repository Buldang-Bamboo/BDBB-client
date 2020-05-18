import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import Form from '../src/components/Form'
import Card from '../src/components/Card'
import ThemeContext from '../src/contexts/ThemeContext'
import { getVerifier } from '../src/api/verify'
import {
  createPost,
  deletePost,
  getPosts,
  getPostByHash
} from '../src/api/posts'
import useInfiniteScroll from '../src/hooks/useInfiniteScroll'
import axios from '../src/api/axios'
import ManageModal from '../src/components/modals/ManageModal'
import Navigator from '../src/components/Navigator'

export default function Index({ postData, verifier }) {
  const [posts, setPosts] = useState(postData.posts.slice())
  const [cursor, setCursor] = useState(postData.cursor)
  const [theme, setTheme] = useContext(ThemeContext)
  const [hasNext, setHasNext] = useState(postData.hasNext)
  const [hash, setHash] = useState('')
  const [isFetching, setIsFetching] = useInfiniteScroll(
    async () => {
      try {
        const fetchedPosts = await getPosts({
          count: 10,
          cursor
        })
        setCursor(fetchedPosts.data.cursor)
        setHasNext(fetchedPosts.data.hasNext)
        setPosts([...posts, ...fetchedPosts.data.posts])
      } catch (err) {
        toast.error('새 글을 불러오던 도중 문제가 생겼습니다.')
        setIsFetching(false) // allows retry
      }
    },
    {
      threshold: 500,
      hasNext
    }
  )
  const [modal, setModal] = useState({
    delete: null
  })

  useEffect(() => {
    if (!isFetching) return
    setIsFetching(false)
  }, [posts])
  useEffect(() => {
    delete axios.defaults.headers.common['Authorization']
  }, [])

  const handleError = err => {
    if (!err.response) {
      toast.error('네트워크에 문제가 있습니다.')
      return
    }

    switch (err.response.status) {
      case 451:
        toast.error('인증에 실패했습니다.')
        break
      case 400:
        toast.error('잘못된 값을 보냈습니다.')
        break
      case 404:
        toast.error('존재하지 않는 글입니다.')
        break
      default:
        toast.error('서버에 문제가 생겼습니다.')
        break
    }
  }
  const handleModal = (modalName, content = null) => {
    const newState = {
      ...modal
    }
    newState[modalName] = content
    setModal(newState)
  }
  const handleSubmit = async (data, reset) => {
    try {
      const post = await createPost(data)
      setHash(post.hash)
      reset()
      toast.success('성공적으로 제출했습니다.')
    } catch (err) {
      handleError(err)
    }
  }
  const handleManage = async (hash, post, reset) => {
    if (!post) {
      try {
        return await getPostByHash(hash)
      } catch (err) {
        handleError(err)
        return
      }
    }
    try {
      await deletePost(hash)
      reset()
      toast.success('제보가 삭제되었습니다.')
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <>
      <Head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta property="og:title" content="🎍 대나무숲 🎍" />
        <meta
          property="og:description"
          content="불당고 익명 게시판, 천안불당고등학교 대나무숲"
        />
        <meta
          property="og:image"
          content="https://i.postimg.cc/Qd4bcD6d/Bamboo-Forest-baner.png"
        />
        <link rel='manifest' href='/manifest.json' />
        <meta name="mobile-web-app-capable" content="yes"/>
        <link rel="apple-touch-icon" href="./icons/icon-512x512.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>

      </Head>
      <Navigator>
        <div className="nav-items">
          <a onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '밝은' : '어두운'} 테마
            </a>
          <a onClick={() => handleModal('delete', {})}>제보 관리</a>
        </div>
      </Navigator>
      <Form onSubmit={handleSubmit} verifier={verifier} />
      {hash && (
        <div className="hash card">
          {`제보한 글의 수정 및 삭제를 위해서 다음 해시코드를 반드시 저장해주세요.\n${hash}`}
        </div>
      )}
      {posts && posts.map(post => <Card post={post} key={post.id} />)}
      {postData.error && (
        <div className="info info--error">{postData.error}</div>
      )}
      {!postData.error && isFetching && <div className="info">로딩 중...</div>}
      {!postData.error && !hasNext && (
        <div className="info">마지막 글입니다.</div>
      )}
      <style jsx>{`
        .nav-items {
          margin: auto 0;
        }

        .nav-items a {
          font-size: 18px;
          font-family: 'Spoqa Han Sans', sans-serif;
          text-decoration: none;
          margin-left: 2rem;
          cursor: pointer;
        }

        @media screen and (max-width: 600px) {
          .nav-items a {
            font-size: 14px;
            margin-left: 1rem;
          }
        }

        .info {
          text-align: center;
          font-size: 14px;
          font-family: 'Spoqa Han Sans', sans-serif;
          color: #41adff;
        }

        .info.info--error {
          color: #eb4034;
        }

        .hash {
          color: #ffab40;
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding: 2rem;
          border-radius: 7.5px;
          word-break: break-word;
        }
      `}</style>
      <ManageModal
        content={modal.delete}
        modalHandler={handleModal}
        onSubmit={handleManage}
      />
    </>
  )
}

Index.getInitialProps = async ctx => {
  delete axios.defaults.headers.common['Authorization']

  const fetchPosts = getPosts({ count: 15, safe: true })
  const fetchVerifier = getVerifier({ safe: true })

  const postData = (await fetchPosts).data
  const verifier = (await fetchVerifier).data
  return {
    postData,
    verifier
  }
}

Index.propTypes = {
  postData: PropTypes.exact({
    posts: PropTypes.array.isRequired,
    cursor: PropTypes.string.isRequired,
    hasNext: PropTypes.bool.isRequired,
    error: PropTypes.string
  }),
  verifier: PropTypes.exact({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    error: PropTypes.string
  })
}
