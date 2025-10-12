import React from 'react';
import Layout from './layout';

export default function RegistrationSuccess({
  firstName,
  lastName,
  username,
  email,
  otp,
}: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  otp: string;
}) {
  return (
    <Layout>
      <>
        <p>Halo <strong>{username}</strong>,</p>
        <p>
          Terima kasih telah bergabung dengan <strong style={{ color: '#1d3658' }}>KJSR Indonesia</strong>. Kami sangat senang
          menyambut dirimu!
        </p>

        <p>Berikut adalah informasi dari akunmu:</p>
        <ul>
          <li>Nama: <strong style={{ color: '#1d3658' }}>{firstName} {lastName}</strong>
          </li>
          <li>Username: <strong style={{ color: '#1d3658' }}>{username}</strong>
          </li>
          <li>Email: <strong style={{ color: '#1d3658' }}>{email}</strong>
          </li>
        </ul>

        <p>Untuk mulai menggunakan akunmu, silakan masukkan otp berikut:</p>
        <p style={{ fontSize: '1.5rem' }}><strong style={{ color: '#1d3658' }}>{otp}</strong></p>
        <p>OTP di atas berlaku selama 5 menit.</p>
      </>
    </Layout>
  )
}
