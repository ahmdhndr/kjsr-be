import React from 'react';
import Layout from './layout';

export default function ResetPassword({
  username,
  resetLink
}: {
  username: string;
  resetLink: string;
}) {
  return (
    <Layout>
      <>
        <p>Halo, {username}!</p>
        <p>Kami menerima permintaan untuk ubah kata sandi: <strong>{username}</strong></p>
        <p>Untuk mengubah kata sandimu, silakan klik tombol berikut:</p>
        <a
          style={{
            padding: '12px 20px',
            margin: '20px 0',
            textDecoration: 'none',
            background: '#1d3658',
            color: '#eff6fa',
            fontWeight: 'bold',
            borderRadius: '5px',
            display: 'flex',
            width: 'fit-content'
          }}
          href={`${resetLink}`}
        >Reset Password</a>
        <p>
          Jika kamu tidak melakukan permintaan ini, alamat email kamu mungkin telah dimasukkan secara tidak sengaja dan kamu dapat mengabaikan email ini dengan aman.
        </p>

        <p>Jika tombol di atas tidak berfungsi, silakan klik link berikut:</p>
        <a href={`${resetLink}`} target="_blank" style={{ color: '#1d3658' }}>{resetLink}</a>
        <p>Link ini berlaku selama 15 menit.</p>
      </>
    </Layout>
  )
}
