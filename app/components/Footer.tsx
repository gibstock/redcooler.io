import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='py-4'>
      <div className="links text-slate-400 text-center">
        <Link href={'/content-guideline'}>
          <span>Content-Guideline</span>
        </Link>
      </div>
      <div className="footer-content flex flex-row justify-center items-center gap-4 bg-transparent">
        <span className='text-slate-400'>Copyright &copy; 2023 </span>
        <span className='font-bold text-redcooler' data-test-id='company'>Redcooler.io</span>
      </div>
    </footer>
  )
}

export default Footer