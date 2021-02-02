import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import {
  IdentityModal,
  useIdentityContext,
  IdentityContextProvider,
} from "react-netlify-identity-widget";
import Navigation from "../components/navigation";
import "prismjs/themes/prism-okaidia.css";
import "react-netlify-identity-widget/styles.css";
import "@reach/tabs/styles.css";

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );
  const url =
    process.env.REACT_APP_NETLIFY_IDENTITY_URL ||
    "https://sarahbosak.netlify.app/"; // should look something like "https://foo.netlify.com"
  if (!url)
    throw new Error(
      "process.env.REACT_APP_NETLIFY_IDENTITY_URL is blank2, which means you probably forgot to set it in your Netlify environment variables"
    );
  return (
    <div className="site-wrapper">
      <header className="site-header">
        <div className="site-title">
          <Link to="/">{data.site.siteMetadata.title}</Link>
        </div>
        <Navigation />
      </header>
      {children}
      <footer className="site-footer">
        <p>
          &copy; {new Date().getFullYear()} &bull;{" "}
          <IdentityContextProvider url={url}>
            <AuthStatusView />
          </IdentityContextProvider>
        </p>
      </footer>
    </div>
  );
};

function AuthStatusView() {
  const identity = useIdentityContext();
  const [dialog, setDialog] = React.useState(false);
  const name =
    (identity &&
      identity.user &&
      identity.user.user_metadata &&
      identity.user.user_metadata.full_name) ||
      "NoName";
  return (
    <div className="App">
        {identity && identity.isLoggedIn ? (
          <>
            <button
              className="btn"
              style={{ maxWidth: 400, background: "orangered" }}
              onClick={() => setDialog(true)}
            >
              LOG OUT
            </button>
          </>
        ) : (
          <>
            <button
              className="btn"
              style={{ maxWidth: 400, background: "darkgreen" }}
              onClick={() => setDialog(true)}
            >
              LOG IN
            </button>
          </>
        )}
        <IdentityModal
          showDialog={dialog}
          onCloseDialog={() => setDialog(false)}
          onLogin={(user) => console.log("hello ", user?.user_metadata)}
          onSignup={(user) => console.log("welcome ", user?.user_metadata)}
          onLogout={() => console.log("bye ", name)}
        />
    </div>
  );
}