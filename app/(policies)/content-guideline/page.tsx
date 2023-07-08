'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {AiOutlineHome} from 'react-icons/ai'
import { darkModeStore } from '@/hooks/store'

const ContentGuideline = () => {
  const darkMode = darkModeStore()
  const dark = darkMode.dark
  return (
    <main>
      <header className='mt-[8vh] p-10 w-full text-black dark:text-slate-200 dark:bg-dark-black bg-white relative'>
        <div className="home-icon absolute top-4 left-4 flex flex-row justify-start items-center w-full">
          <Link href={'/'}>
            <AiOutlineHome size={22} />
          </Link>
        </div>
        <div className="hero flex flex-row justify-center items-center w-full">
          {dark ? (
            <Image 
              src={'/rc-logo-black-bg.png'}
              alt='Redcooler logo'
              width={200}
              height={200}
            />
          ) : (
            <Image 
              src={'/rc-logo-white-bg.png'}
              alt='Redcooler logo'
              width={200}
              height={200}
            />
          )}
        </div>
        <h1 className='text-2xl font-semibold'>Community Content Guidelines</h1>
      </header>
      <section className='text-slate-800 dark:text-slate-200 p-10'>
        <div className="effective text-lg">
          Effective June 25, 2023.
        </div>
        <div className="guidelines">
          <ol type='1' className='list-decimal'>
            <li>Be Respectful:
              <ul className='list-disc list-inside'>
                <li>
                  Treat others with respect and courtesy. Personal attacks, harassment, hate speech, or any form of discrimination will not be tolerated.
                </li>
                <li>
                  Avoid offensive language, derogatory remarks, or any content that may offend or upset other users.
                </li>
                <li>
                Engage in constructive discussions and avoid unnecessary arguments or flame wars.
                </li>
              </ul>
            </li>
            <li>Maintain a Safe Environment:
              <ul className='list-disc list-inside'>
                <li>Do not post or distribute any content that is illegal, harmful, or violates any applicable laws or regulations.</li>
                <li>Refrain from sharing personal information about yourself or others. Protect your privacy and respect the privacy of others.</li>
                <li>Report any inappropriate or concerning behavior to the moderators/administrators.</li>
              </ul>
            </li>
            <li>Stay on Topic:
              <ul className='list-disc list-inside'>
                <li>Keep your posts relevant to the forum&apos;s theme or specific discussion thread.</li>
                <li>Avoid spamming, excessive self-promotion, or advertising unrelated products or services.</li>
                <li>Use appropriate categories or tags when posting to ensure easy navigation and organization of content.</li>
              </ul>
            </li>
            <li>Intellectual Property and Copyright:
              <ul className='list-disc list-inside'>
                <li>Respect the intellectual property rights of others. Do not post content that infringes upon copyrights, trademarks, or any other proprietary rights.</li>
                <li>If you share content created by others, provide proper attribution and give credit where it is due.</li>
                <li>Do not plagiarize or reproduce content without permission.</li>
              </ul>
            </li>
            <li>Quality Content:
              <ul className='list-disc list-inside'>
                <li>Ensure your posts are clear, concise, and contribute meaningfully to the discussion.</li>
                <li>Use proper grammar, punctuation, and spelling to enhance readability.</li>
                <li>Avoid excessive use of capitalization, emojis, or excessive formatting.</li>
              </ul>
            </li>
            <li>Moderation and Enforcement:
              <ul className='list-disc list-inside'>
                <li>The moderators and/or administrators reserve the right to edit, remove, or take appropriate action on any content that violates these guidelines.</li>
                <li>Persistent violation of the guidelines may result in warnings, temporary suspension, or permanent banning from the forum.</li>
                <li>If you believe your content was wrongly moderated, contact the moderators/administrators to resolve the issue.</li>
              </ul>
            </li>
            <li>Remember, these guidelines are designed to foster a positive and inclusive community on Redcooler.io. By participating in the forum, you agree to adhere to these guidelines and help create a welcoming environment for all users.</li>
          </ol>
        </div>
      </section>
    </main>
  )
}

export default ContentGuideline