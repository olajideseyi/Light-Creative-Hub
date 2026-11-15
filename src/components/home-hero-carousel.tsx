"use client";

import { useEffect, useState } from "react";
import styles from "@/app/home.module.css";

export function HomeHeroCarousel({images,fallbackImage}:{images:string[];fallbackImage:string}) {
  const slides=images.length?images:[fallbackImage];
  const [active,setActive]=useState(0);
  useEffect(()=>{setActive(0);},[slides.length]);
  useEffect(()=>{
    if(slides.length<2)return;
    const timer=window.setInterval(()=>setActive(current=>(current+1)%slides.length),5500);
    return()=>window.clearInterval(timer);
  },[slides.length]);
  return <>
    {slides.map((src,index)=><img key={src} className={styles.heroSlide+" "+(index===active?styles.heroSlideActive:"")} src={src} alt="" aria-hidden="true" />)}
    {slides.length>1&&<div className={styles.heroSlideControls} aria-label="Hero slides">{slides.map((src,index)=><button key={src} type="button" className={styles.heroSlideDot+" "+(index===active?styles.heroSlideDotActive:"")} aria-label={"Show hero slide "+(index+1)} aria-pressed={index===active} onClick={()=>setActive(index)}/>)}</div>}
  </>;
}
