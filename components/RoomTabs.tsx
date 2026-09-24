'use client';

import { useState } from 'react';
import Link from 'next/link';

type RCat = 'residential' | 'commercial';

const roomCards: { scene: string; title: string; desc: string; rcat: RCat }[] = [
  { scene:'scene--room-living',      title:'Living Room',      desc:'Custom printed & decorative blinds for your main space.', rcat:'residential' },
  { scene:'scene--room-bedroom',     title:'Bedroom',          desc:'Blackout options for better sleep. Custom images available.', rcat:'residential' },
  { scene:'scene--room-kitchen',     title:'Kitchen',          desc:'Easy-clean, moisture-resistant options for kitchens.', rcat:'residential' },
  { scene:'scene--room-office',      title:'Home Office',      desc:'Glare control & privacy for productive workspaces.', rcat:'residential' },
  { scene:'scene--room-kids',        title:'Kids Room',        desc:'Playful custom prints with blackout for better sleep.', rcat:'residential' },
  { scene:'scene--room-nursery',     title:'Nursery',          desc:'Safe, soft blackout blinds with gentle custom designs.', rcat:'residential' },
  { scene:'scene--room-media',       title:'Media Room',       desc:'Complete blackout for your home theater experience.', rcat:'residential' },
  { scene:'scene--room-condo',       title:'Condo',            desc:'Modern, space-saving window solutions for condos.', rcat:'residential' },
  { scene:'scene--room-restaurant',  title:'Restaurant & Café',desc:'Branded window coverings for hospitality spaces.', rcat:'commercial' },
  { scene:'scene--room-retail',      title:'Retail Store',     desc:'Privacy & branding for storefronts and retail spaces.', rcat:'commercial' },
  { scene:'scene--room-biz-office',  title:'Office',           desc:'Professional, glare-controlled blinds for workplaces.', rcat:'commercial' },
  { scene:'scene--room-reception',   title:'Reception Area',   desc:'First impressions start with your windows.', rcat:'commercial' },
  { scene:'scene--room-boardroom',   title:'Boardroom',        desc:'Premium, motorized privacy solutions for meetings.', rcat:'commercial' },
  { scene:'scene--room-hotel',       title:'Hotel',            desc:'Luxury blackout & branded blinds at scale.', rcat:'commercial' },
  { scene:'scene--room-commercial',  title:'Commercial Space', desc:'Large-format custom solutions for any commercial setting.', rcat:'commercial' },
];

export default function RoomTabs() {
  const [rcat, setRcat] = useState<RCat>('residential');
  const visibleRooms = roomCards.filter(r => r.rcat === rcat);

  return (
    <>
      <div className="room-cat-tabs">
        <button className={`rcat-tab${rcat==='residential'?' active':''}`} onClick={()=>setRcat('residential')}>Residential</button>
        <button className={`rcat-tab${rcat==='commercial'?' active':''}`} onClick={()=>setRcat('commercial')}>Commercial</button>
      </div>
      <div className="room-cat-grid">
        {visibleRooms.map(r => (
          <Link href="/quote" className="room-cat-card" key={r.scene}>
            <div className={`room-cat-card__img ${r.scene}`}><div className="blind-slats"></div></div>
            <div className="room-cat-card__body"><h4>{r.title}</h4><p>{r.desc}</p></div>
          </Link>
        ))}
      </div>
    </>
  );
}
