import Router from 'next/router'
import PropTypes from 'prop-types'

function Navigator({ children }) {
  return (
    <>
      <div className="nav">
        <div className="nav__logo-wrapper">
          <h1 onClick={() => Router.push('/')}>
          <span style={{ fontSize: 31 }}>불당고 대나무숲</span>
          </h1>
          </div>
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
          .nav__logo-wrapper {
            display: flex;
            justify-conetent: center;
          }
          .nav__logo {
            height: 3rem;
          }
          @media screen and (max-width: 600px) {
            h1 {
              font-size: 1.8em;
            }
            .nav__logo {
              height: 2.5rem;
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