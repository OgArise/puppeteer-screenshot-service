// pages/_error.js
function Error({ statusCode }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>API Service</h1>
      <p>Status: {statusCode || 'Unknown'}</p>
      <p>Use POST /api/render-png to generate screenshots.</p>
    </div>
  );
}

// Only for server-side rendering
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode || 500;
  return { statusCode };
};

export default Error;