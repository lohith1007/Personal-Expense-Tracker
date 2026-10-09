import Navbar from "./Navbar";

// Wrapper for every page that needs a logged-in user: navigation bar + page title + content.
function Layout({ title, actions, children }) {
  return (
    <>
      <Navbar />
      <main className="container">
        <div className="page-header">
          <h1>{title}</h1>
          {actions && <div className="page-actions">{actions}</div>}
        </div>
        {children}
      </main>
    </>
  );
}

export default Layout;
