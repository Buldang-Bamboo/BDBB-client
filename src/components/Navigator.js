import Router from 'next/router'
import PropTypes from 'prop-types'

function Navigator({ children }) {
  return (
    <>
      <div className="nav">
          <h1 onClick={() => Router.push('/')}>
          불<span style={{ fontSize: 20 }}>당고</span>대
            <span style={{ fontSize: 20 }}>나무</span>숲
          </h1>
        {children}
      </div>
      <style jsx>
        {`
          h1 {
            display: inline;
            margin: 0;
            cursor: pointer;
          }

          .nav {
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
          }

          @media screen and (max-width: 600px) {
            h1 {
              font-size: 1.8em;
            }

          }
        `}
      </style>
    </>
  )
}

Navigator.propTypes = {
  children: PropTypes.node
}

export default Navigator
