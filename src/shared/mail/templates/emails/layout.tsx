/* eslint-disable @typescript-eslint/await-thenable */

import { Body, Container, Head, Html } from '@react-email/components';
import React from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, boxSizing: 'border-box'}}>
        <Container style={{ background: '#eff6fa', width: '100%', margin: '20px auto', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            borderBottom: '2px solid #E63746',
            padding: '10px',
            background: '#1d3658'
          }}>
            <img style={{ maxWidth: '85px' }} src="https://media.kjsr.or.id/static/logo-kjsr.png" alt="KJSR Logo" />
          </div>

          {/* Content */}
          <div style={{ padding: '20px' }}>
            {children}

            <p>Salam hormat,</p>
            <p><strong style={{ color: '#1d3658' }}>KJSR Indonesia</strong></p>
            <p style={{ marginTop: '24px', fontSize: '12px', color: '#999'}}>
              Email ini dikirim otomatis oleh sistem. Mohon tidak membalas langsung.
            </p>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#eff6fa', background: '#1d3658', borderTop: '2px solid #E63746' }}>
            <address>Jl. Teuku Umar No. 8, RT. 01 RW. 01, Gondangdia, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10350, 021-3909176</address>
            <span>Email: <a href="mailto:hello@kjsr.or.id" style={{ color: '#eff6fa' }}>hello@kjsr.or.id</a></span>
            <span style={{ display: 'block', marginTop: '4px' }}>&copy; {new Date().getFullYear()} KJSR Indonesia</span>
          </div>
        </Container>
      </Body>
    </Html>
  );
}
