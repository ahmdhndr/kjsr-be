import React from 'react';
import Layout from './layout';

export default function PreapprovedApproved({
  email,
  clientUrl,
  registerToken,
}: {
  email: string;
  clientUrl: string;
  registerToken: string;
}) {
  return (
    <Layout>
      <>
        <p>Hai!</p>

        <p>Terima kasih sudah mengajukan email untuk bergabung dengan <strong style={{ color: '#1d3658' }}>KJSR Indonesia</strong>.</p>
        <p>Pengajuan email {email} buat daftar akun sudah disetujui,
          ya.</p>

        <p>Selanjutnya, kamu bisa langsung isi formulir pendaftaran lewat tombol di bawah ini:</p>

        {/* <a href={`${clientUrl}/register?email=${email}&token=${registerToken}`}>Daftar Akun</a> */}
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
            href={`${clientUrl}/register?email=${email}&token=${registerToken}`}
          >Daftar Akun</a>

        <p>Jika tombol di atas tidak berfungsi, silakan klik link berikut:</p>
        <a href={`${clientUrl}/register?email=${email}&token=${registerToken}`}>{clientUrl}/register?email={email}&amp;token=${registerToken}
        </a>

        <p>Link di atas berlaku selama 3 hari sejak email diterima.</p>

        <p>Kalau kamu merasa tidak pernah mengajukan pendaftaran, boleh abaikan aja email ini.</p>
      </>
    </Layout>
  )
}
