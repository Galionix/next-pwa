import { NextPage } from 'next';
import Link from 'next/link';

const errorPage: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>Error</h1>
      <p>{` but it's not your fault :)`}</p>
      <br />
      <p>You can try</p>
      <button
        style={{
          border: '1px solid #000',
          padding: '10px',
        }}
      >
        <Link href='/'>
          <a>Go back to home</a>
        </Link>
      </button>
      <p>or</p>
      <button
        style={{
          border: '1px dashed #000',
          padding: '10px',
        }}
      >
        <Link href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`}>
          <a>Go to new domain</a>
        </Link>
      </button>
      <br />
    </div>
  );
};

export default errorPage;
