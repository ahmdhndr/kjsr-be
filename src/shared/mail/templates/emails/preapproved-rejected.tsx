import React from 'react';
import Layout from './layout';

export default function PreapprovedRejected({ email, reason }: { email: string; reason: string}) {
  return (
    <Layout>
      <>
        <p>Halo!</p>

        <p>Terima kasih sudah mengajukan email untuk bergabung dengan <strong style={{ color: '#1d3658' }}>KJSR Indonesia</strong>.</p>
        <p>Sayangnya, email {email} belum bisa kami setujui saat ini.</p>
        <p>Keterangan:</p>
        <blockquote
          style={{
            padding: '12px',
            borderLeft: '4px solid #e63746',
          }}
        >
          {reason}
        </blockquote>
      </>
    </Layout>
  )
}
