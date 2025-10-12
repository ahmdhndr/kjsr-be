import Layout from './layout';

export default function RequestPreapproval({
  email,
  clientUrl,
}: {
  email: string;
  clientUrl: string;
}) {
  return (
    <Layout>
      <>
        <p>Halo Admin,</p>
        <p>
          Ada pengajuan pendaftaran akun KJSR dari <strong style={{ color: '#1d3658' }}>{email}</strong>
        </p>

        <p>Silakan cek dan lakukan persetujuan di dashboard admin:</p>
        <p>
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
            href={`${clientUrl}/dashboard/admin/approvals`}
          >Buka Dashboard</a>
        </p>
      </>
    </Layout>
  )
}
