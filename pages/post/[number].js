import Head from 'next/head'
import PropTypes from 'prop-types'
import Card from '../../src/components/Card'
import { getPost } from '../../src/api/posts'
import Navigator from '../../src/components/Navigator'

function Post({ post }) {
  return (
    <>
      <Navigator />
      {post ? (
        <>
          <Head>
            <meta property="og:title" content={`${post.number}번_제보`} />
            <meta
              property="og:image"
              content={`https://api.buldang.xyz/thumbnail/${post.number}.jpeg`}
            />
            <meta property="og:description" content={post.content} />
          </Head>
          <Card post={post} more />
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-8146562096769982"
            data-ad-slot="7095254061"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
           <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
        </>
      ) : (
        <div className="card info-nf">존재하지 않는 글입니다.</div>
      )}
      <style jsx>
        {`
          * {
            font-family: 'Spoqa Han Sans', sans-serif;
          }
          .info-nf {
            padding: 2rem;
            border-radius: 7.5px;
            color: #f44336;
          }
        `}
      </style>
    </>
  )
}

Post.getInitialProps = async ({ query }) => {
  const { number } = query
  try {
    const post = await getPost(number)

    return {
      post
    }
  } catch (err) {
    return {}
  }
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    number: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    fbLink: PropTypes.string,
    createdAt: PropTypes.number
  })
}

export default Post
