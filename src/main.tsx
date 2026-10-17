import React, { useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Deck, Slide } from '@revealjs/react';
import 'reveal.js/reveal.css';
import 'leaflet/dist/leaflet.css';
import '@fontsource/noto-sans-tc/400.css';
import '@fontsource/noto-sans-tc/600.css';
import './styles.css';
import atayalSubgroupingSvg from './assets/atayal-subgrouping.svg?raw';
import seediqSubgroupingSvg from './assets/seediq-subgrouping.svg?raw';
import { ComparisonTable } from './components/ComparisonTable';
import { ChangeSequence } from './components/ChangeSequence';
import { LinguisticForm } from './components/LinguisticForm';
import { DistributionMap } from './components/DistributionMap';
import { MapLegend } from './components/MapLegend';
import { groups, places, type Group, type Place } from './data/places';
import { comparisonRows, nominative1sg } from './data/corpus';

const demoMode = new URLSearchParams(window.location.search).get('demo') === '1';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const config = { width: 1600, height: 900, margin: 0.025, minScale: 0.2, maxScale: 2,
  hash: true, history: true, controls: true, controlsTutorial: false, progress: true, slideNumber: 'c' as const,
  center: false, transition: reducedMotion ? 'none' as const : 'fade' as const,
  transitionSpeed: 'fast' as const, backgroundTransition: 'none' as const,
  keyboard: { 70: () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  } }, touch: true, disableLayout: false, embedded: false };


type SlideFrameProps = {
  id: string; eyebrow?: string; title?: ReactNode;
  subtitle?: ReactNode; dark?: boolean; hidePageNumber?: boolean; children?: ReactNode;
};

function SlideFrame({ id, eyebrow, title, subtitle, dark, hidePageNumber, children }: SlideFrameProps) {
  return <Slide id={id} className={`slide-frame ${dark ? 'is-dark' : ''} ${hidePageNumber ? 'hide-page-number' : ''}`} backgroundColor={dark ? '#861F2D' : '#FAF8F2'}>
    <div className="slide-layout">
      {title && <header className="slide-heading">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </header>}
      <div className="slide-body">{children}</div>
    </div>
  </Slide>;
}

function TitleSlide() {
  return <SlideFrame id="cover" dark hidePageNumber>
    <div className="cover-top"><span>NCL 2026</span></div>
    <div className="cover-title"><div className="eyebrow">PROTO-ATAYALIC PERSONAL PRONOUNS</div>
      <h1>原始泰雅－賽德克語<br/>人稱代詞的重建<br/>及歷史發展</h1>
    </div>
    <div className="cover-bottom"><div className="authors">宋硯之 <span>獨立研究者</span><br/>郭育賢 <span>國立彰化師範大學英語學系</span></div></div>
  </SlideFrame>;
}

function SectionSlide({ title, subtitle, ...props }: Omit<SlideFrameProps, 'dark'>) {
  return <SlideFrame {...props} dark hidePageNumber><div className="section-title"><div className="eyebrow">{props.eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></SlideFrame>;
}

function IntroductionSlide() {
  return <SectionSlide id="introduction" eyebrow="第一節" title="前言"
    subtitle="研究問題與研究方法"/>;
}

function ResearchQuestionsSlide() {
  return <SlideFrame id="research-questions" eyebrow="第一節　前言" title="研究問題">
    <ol className="research-questions">
      <li><span className="question-number" aria-hidden="true">01</span><div>
        <h3>重建哪些形式？</h3>
        <p>原始泰雅－賽德克語可以重建哪些人稱代詞形式？</p>
      </div></li>
      <li><span className="question-number" aria-hidden="true">02</span><div>
        <h3>遺留還是創新？</h3>
        <p>現代變體中的差異，哪些是共同遺留，<br/>哪些屬於分支內創新？</p>
      </div></li>
      <li><span className="question-number" aria-hidden="true">03</span><div>
        <h3>創新如何產生？</h3>
        <p>類推、取代與範式重組，如何形成這些創新？</p>
      </div></li>
    </ol>
  </SlideFrame>;
}

function ResearchMethodsSlide() {
  return <SlideFrame id="research-methods" eyebrow="第一節　前言" title="由下而上的重建：比較方法（the Comparative Method）"
    subtitle="">
    <div className="method-layout">
      <div className="reconstruction-diagram" role="img" aria-label="由下而上：泰雅語與賽德克語各現代變體，分別重建原始泰雅語與原始賽德克語，再重建原始泰雅－賽德克語。">
        <div className="common-ancestor-step fragment" data-fragment-index="0">
        <div className="reconstruction-level common-ancestor"><div className="ancestor-node">
          <span className="node-code">PAic</span><strong>原始泰雅－賽德克語</strong>
        </div></div>
        <svg className="reconstruction-arrows" viewBox="0 0 900 48" aria-hidden="true">
          <path d="M225 47V29H450V2M675 47V29H450"/><path d="m442 10 8-8 8 8"/>
        </svg>
        </div>
        <div className="reconstruction-level"><div className="ancestor-node">
          <span className="node-code">PAta</span><strong>原始泰雅語</strong>
        </div><div className="ancestor-node">
          <span className="node-code">PSed</span><strong>原始賽德克語</strong>
        </div></div>
        <svg className="reconstruction-arrows" viewBox="0 0 900 48" aria-hidden="true">
          <path d="M225 47V2m-8 8 8-8 8 8M675 47V2m-8 8 8-8 8 8"/>
        </svg>
        <div className="reconstruction-level modern-varieties"><div className="ancestor-node">
          <span className="node-code">Atayal</span><strong>泰雅語各變體</strong>
        </div><div className="ancestor-node">
          <span className="node-code">Seediq</span><strong>賽德克語各變體</strong>
        </div></div>
      </div>
      <aside className="method-details">
        <div><h3>主要語料</h3><p>Goderich（2020）<br/>Song（2025）<br/>作者田野調查筆記</p></div>
        <div><h3>輔助語料</h3><p>B'ala 未出版辭典<br/>族語 E 樂園</p></div>
      </aside>
    </div>
  </SlideFrame>;
}

function ComparisonSlide() {
  return <SlideFrame id="comparison" eyebrow="01 / COMPARISON" title="相同的人稱，不同的形式" subtitle="主格附著式代詞：先看各變體之間的對應">
    <ComparisonTable columns={['1sg.nom', '2sg.nom', '1pl.incl.nom']} rows={comparisonRows} highlightedColumns={[0]} revealRows/>
    <div className="table-takeaway fragment fade-in" data-fragment-index="4"><span className="rule-label">觀察</span><p>第一人稱單數呈現競爭形式；<br/>其他人稱提供穩定的比較基準。</p></div>
  </SlideFrame>;
}

function InnovationSlide() {
  return <SlideFrame id="innovation" eyebrow="02 / HISTORICAL DEVELOPMENT" title="從所有，到屬格，再到主格" subtitle="賽德克語複數人稱代詞的功能擴張">
    <div className="analysis-tag">本文提出的歷史分析</div>
    <ChangeSequence steps={[
      { title: '絕對所有格', form: <LinguisticForm>*nami<br/>*namu</LinguisticForm>, description: <>既有的自由形式<br/>提供新的來源。</> },
      { title: '取代屬格', form: <LinguisticForm>*=nami<br/>*=namu</LinguisticForm>, description: <>取代原有的<br/><LinguisticForm>*=miyan / *=mamu</LinguisticForm>。</> },
      { title: '擴張至主格', form: <LinguisticForm>*=nami<br/>*=namu</LinguisticForm>, description: <>新形式進入主格，<br/>主格、屬格合流。</> },
    ]}/>
    <div className="sequence-conclusion fragment fade-in" data-fragment-index="2">形式的相同，也可能是後來的創新。</div>
  </SlideFrame>;
}

function DistributionSlide({ active, layoutVersion, showForms = false }: { active: boolean; layoutVersion: number; showForms?: boolean }) {
  const [visibleIds, setVisibleIds] = useState<string[]>(places.map(p => p.id));
  const visibleGroups = groups.filter(group => places.some(p => p.group === group && visibleIds.includes(p.id)));
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [labelMode, setLabelMode] = useState<'name' | 'form'>('name');
  const toggleMembers = (members: string[]) => {
    setVisibleIds(current => members.every(id => current.includes(id)) ? current.filter(id => !members.includes(id)) : [...new Set([...current, ...members])]);
    setHighlightedIds([]);
  };
  const toggleGroup = (group: Group) => toggleMembers(places.filter(p => p.group === group).map(p => p.id));
  const toggleLanguage = (language: Place['language']) => toggleMembers(places.filter(p => p.language === language).map(p => p.id));
  const toggleVisibility = (id: string) => {
    setVisibleIds(current => current.includes(id) ? current.filter(p => p !== id) : [...current, id]);
    setHighlightedIds(current => current.filter(p => p !== id));
  };
  const select = (id: string) => {
    setHighlightedIds(current => current.includes(id) ? [] : [id]);
  };
  return <SlideFrame id="distribution" eyebrow={showForms ? '03 / GEOGRAPHY' : '第一節　前言'} title={showForms ? '把比較放回地理空間' : '泰雅語與賽德克語的變體'}>
    <div className="map-toolbar" onKeyDown={event => event.stopPropagation()}>
      {showForms && <div className="label-mode" aria-label="地圖標籤"><button aria-pressed={labelMode === 'name'} onClick={() => setLabelMode('name')}>變體名稱</button><button aria-pressed={labelMode === 'form'} onClick={() => setLabelMode('form')}>詞形 · 1sg.nom</button></div>}
      <div className="selection-tools"><button onClick={() => setVisibleIds(places.map(p => p.id))}>全選</button><button onClick={() => { setVisibleIds([]); setHighlightedIds([]); }}>取消全選</button></div>
    </div>
    <div className="map-grid"><DistributionMap active={active} layoutVersion={layoutVersion} visibleGroups={visibleGroups} visibleIds={visibleIds} highlightedIds={highlightedIds} formsById={showForms ? nominative1sg : undefined} labelMode={showForms ? labelMode : 'name'} onSelect={select}/><MapLegend visibleIds={visibleIds} highlightedIds={highlightedIds} onGroupToggle={toggleGroup} onLanguageToggle={toggleLanguage} onVisibilityToggle={toggleVisibility} onSelect={select}/></div>
  </SlideFrame>;
}

type CorpusRow = { label: string; cells: string[] };

const atayalCorpus: Record<string, CorpusRow[]> = {
  "pata-nom": [
    {"label": "PAta", "cells": ["*=cu; *=caku; *=ci", "*=su", "*=ta", "*=cami", "*=cimu"]},
    {"label": "Matu'uwal", "cells": ["=cu; =ci; =kuŋ", "=su", "=ta", "=cami", "=cimu"]},
    {"label": "Squliq", "cells": ["=saku; =ku", "=su", "=ta", "=sami", "=simu"]},
    {"label": "Skikun", "cells": ["=cu", "=su", "=ta", "=cami", "=cimu"]},
    {"label": "Klesan", "cells": ["=caku; =cu", "=su", "=ta", "=cami", "=cimu"]},
    {"label": "B'ala", "cells": ["=ku", "=su", "=ta", "=sami; =cami; =myen", "=simu; =cimu; =mamu; =maw"]},
    {"label": "S'uli", "cells": ["=kuŋ; =kuziŋ; =ku; =si", "=su", "=ta", "=sami", "=simu"]},
    {"label": "Matu'aw", "cells": ["=kuŋ; =kuyiŋ", "=su", "=ta", "=sami", "=simu"]},
    {"label": "Plngawan", "cells": ["=cu", "=su", "=ta", "=min", "=mamu"]},
  ],
  "pata-neut": [
    {"label": "PAta", "cells": ["*kuɹiŋ", "*isu", "*hiya", "*ita", "*cami", "*cimu", "*ləhəga; *ləha(?)"]},
    {"label": "Matu'uwal", "cells": ["kuwiŋ", "isu", "hiya", "ita", "cami", "cimu", "nəha"]},
    {"label": "Squliq", "cells": ["kun; kuziŋ; (knan; kinan)", "isu", "hya", "ita", "sami", "simu", "həga; ləhəga; ləha; nəha"]},
    {"label": "Skikun", "cells": ["kiŋan", "isu", "hya", "ita", "cami", "cimu", "naha"]},
    {"label": "Klesan", "cells": ["kinaŋ; kuyiŋ", "isu", "hya", "ita", "cami", "cimu", "nəha"]},
    {"label": "B'ala", "cells": ["kun; kuziŋ", "isu", "hya", "ita", "sami; cami", "simu; cimu", "nəha; ləha"]},
    {"label": "S'uli", "cells": ["kuziŋ; kuŋ", "isu", "hya", "ita", "sami", "simu", "n(a)ha; l(a)ha"]},
    {"label": "Matu'aw", "cells": ["kuyiŋ; kuŋ", "isu", "hya", "ita", "sami", "simu", "laha"]},
    {"label": "Plngawan", "cells": ["kuɹiŋ", "isu", "hya", "ita", "cami", "cimu", "laha"]},
  ],
  "pata-neut-gen-3pl": [
    {"label": "PAta", "cells": ["*ləhəga; *ləha; *nəha(?)", "*=nəha"]},
    {"label": "Matu'uwal", "cells": ["nəha", "=nəha"]},
    {"label": "Squliq", "cells": ["həga; ləhəga; ləha; nəha", "=nəha"]},
    {"label": "Skikun", "cells": ["naha", "=naha"]},
    {"label": "Klesan", "cells": ["nəha", "=nəha"]},
    {"label": "B'ala", "cells": ["nəha; ləha", "=nəha; =ləha"]},
    {"label": "S'uli", "cells": ["n(a)ha; l(a)ha", "=n(a)ha; (=laha?)"]},
    {"label": "Matu'aw", "cells": ["laha", "=naha"]},
    {"label": "Plngawan", "cells": ["laha", "=naha"]},
  ],
  "pata-gen": [
    {"label": "PAta", "cells": ["*=mu; (*=maku?)", "*=su", "*=niya", "*=ta", "*=miyan", "*=mamu", "*=nəha"]},
    {"label": "Matu'uwal", "cells": ["=mu", "=su", "=niya", "=ta", "=niyam", "=mamu", "=nəha"]},
    {"label": "Squliq", "cells": ["=mu; =maku", "=su", "=nya", "=ta", "=myan", "=mamu", "=nəha"]},
    {"label": "Skikun", "cells": ["=mu", "=su", "=nya", "=ta", "=myan", "=mamu", "=naha"]},
    {"label": "Klesan", "cells": ["=mu; =maku", "=su", "=nya", "=ta", "=myan", "=mamu", "=nəha"]},
    {"label": "B'ala", "cells": ["=mu", "=su", "=nya", "=ta", "=myen", "=mamu; =maw", "=nəha; =ləha"]},
    {"label": "S'uli", "cells": ["=mu", "=su", "=nya", "=ta", "=myan", "=mamu", "=n(a)ha; (=laha?)"]},
    {"label": "Matu'aw", "cells": ["=mu", "=su", "=nya", "=ta", "=myan", "=mamu", "=naha"]},
    {"label": "Plngawan", "cells": ["=mu", "=su", "=ni", "=ta", "=min", "=mamu", "=naha"]},
  ],
  "pata-obl": [
    {"label": "PAta", "cells": ["*kənan", "*sunan", "*hiya-(a)n", "*ita-(a)n", "*cami-nan", "*cimu-nan", ""]},
    {"label": "Squliq", "cells": ["kənan", "sunan", "hyan", "itan", "səminan", "səmunan", "həgan; ləhan"]},
    {"label": "B'ala", "cells": ["kənan", "sunan", "hyan", "ətanan", "səminan(?)", "səmunan", "nəhyan(?)"]},
    {"label": "Plngawan", "cells": ["kinan", "sinan", "hyan", "itan", "caminan", "cimunan", "lahan"]},
  ],
  "pata-portmanteau": [
    {"label": "PAta", "cells": ["*=misu", "*=saku"]},
    {"label": "Matu'uwal", "cells": ["=misu", ""]},
    {"label": "Squliq", "cells": ["=misu", "=saku?"]},
    {"label": "Skikun", "cells": ["=misu", ""]},
    {"label": "Klesan", "cells": ["=misu", ""]},
    {"label": "B'ala", "cells": ["=misu", "=saku?"]},
    {"label": "S'uli", "cells": ["=misu", ""]},
    {"label": "Plngawan", "cells": ["=misu", "=saku"]},
  ],
  "plngawan-portmanteau": [
    {"label": "Plngawan", "cells": ["=misu", "=saku", "=cini", "=sini", "=mini", "=mani"]},
  ],
};

const seediqCorpus: Record<string, CorpusRow[]> = {
  "psed-nom": [
    {"label": "PSed", "cells": ["*=ku", "*=su", "*=ta", "*=nami", "*=namu"]},
    {"label": "Tgdaya", "cells": ["=ku", "=su", "=ta", "=nami; (=miyan)", "=namu"]},
    {"label": "Central Toda", "cells": ["=ku", "=su", "=ta", "=nami", "=namu"]},
    {"label": "Eastern Toda", "cells": ["=ku", "=su", "=ta", "=nami", "=namu"]},
    {"label": "Central Truku", "cells": ["=ku", "=su", "=ta", "=nami", "=namu"]},
    {"label": "Eastern Truku", "cells": ["=ku", "=su", "=ta", "=nami", "=namu"]},
  ],
  "psed-gen": [
    {"label": "PSed", "cells": ["*=mu", "*=su", "*=na", "*=niya", "*=ta", "*=nami", "*=namu", "*=dəha"]},
    {"label": "Tgdaya", "cells": ["=mu", "=su", "=na", "-", "=ta", "=nami; (=miyan)", "=namu", "=daha"]},
    {"label": "Central Toda", "cells": ["=mu", "=su", "=na", "=niya", "=ta", "=nami", "=namu", "=dəha"]},
    {"label": "Eastern Toda", "cells": ["=mu", "=su", "=na", "=niya", "=ta", "=nami", "=namu", "=nəha"]},
    {"label": "Central Truku", "cells": ["=mu", "=su", "=na", "=niya", "=ta", "=nami", "=namu", "=dəha"]},
    {"label": "Eastern Truku", "cells": ["=mu", "=su", "=na", "=niya", "=ta", "=nami", "=namu", "=dəha"]},
  ],
  "psed-neut": [
    {"label": "PSed", "cells": ["*yaku", "*isu", "*hiya", "*ita", "*yami", "*yamu", "*dəhəya"]},
    {"label": "Tgdaya", "cells": ["yaku", "isu", "heya", "ita", "yami", "yamu", "deheya"]},
    {"label": "Central Toda", "cells": ["yaku", "isu", "hiya", "ita", "yami", "yamu", "dəhiya"]},
    {"label": "Eastern Toda", "cells": ["yaku", "isu", "hiya", "ita", "yami", "yamu", "dəhiya"]},
    {"label": "Central Truku", "cells": ["yaku", "isu", "hiya", "ita", "yami", "yamu", "dəhiya"]},
    {"label": "Eastern Truku", "cells": ["yaku", "isu", "hiya", "ita", "yami", "yamu", "dəhiya"]},
  ],
  "psed-obl": [
    {"label": "PSed", "cells": ["*kənan", "*sunan", "*həyaan", "*tənan", "*mənan", "*munan", "*dəhəyaan"]},
    {"label": "Tgdaya", "cells": ["kenan", "sunan", "-", "-", "-", "munan", "-"]},
    {"label": "Central Toda", "cells": ["kənan", "sunan", "həyaan", "tənan", "mənan", "munan", "dəhəyaan"]},
    {"label": "Central Truku", "cells": ["kənan", "sunan", "həyaan", "tənan", "mənan", "munan", "dəhəyaan"]},
    {"label": "Eastern Truku", "cells": ["kənan", "sunan", "həyaan", "tənan", "mənan", "munan", "dəhəyaan"]},
  ],
  "psed-pan-obl": [
    {"label": "PAn · acc", "cells": ["*i-ak-ən", "*iSu[qu]-n", "*ita-ən", "*i-am-ən", "*i-mu[qu]-n"]},
    {"label": "排灣語 · nom", "cells": ["=[a]kən", "=[ə]sun", "=[i]cən", "=[a]mən", "=[ə]mun"]},
    {"label": "PSed · obl", "cells": ["*kən-an", "*sun-an", "*tən-an", "*mən-an", "*mun-an"]},
  ],
  "psed-abpos": [
    {"label": "PSed", "cells": ["*naku", "*nisu", "*nəhiya", "*nita", "*nami", "*namu", "*nədəhəya"]},
    {"label": "Tgdaya", "cells": ["nunaku; naku", "nunisu; nisu", "neheya", "nunita; nita", "nunami", "nunamu", "nudeheya"]},
    {"label": "Central Toda", "cells": ["naku", "nisu", "nəhiya", "nita", "nami", "namu", "əndəhiya"]},
    {"label": "Eastern Toda", "cells": ["naku", "nisu", "nəhiya", "nita", "nami", "namu", "əndəhiya"]},
    {"label": "Central Truku", "cells": ["naku", "nisu", "nəhiya", "nita", "nami", "namu", "əndəhiya"]},
    {"label": "Eastern Truku", "cells": ["nənaku", "nənisu", "nəhiya", "nənita", "nənami", "nənamu", "əndəhiya"]},
  ],
  "psed-portmanteau-reflexes": [
    {"label": "PSed", "cells": ["*=misu", "*=saku", "*=maku"]},
    {"label": "Tgdaya", "cells": ["=misu", "=saku", "=maku"]},
    {"label": "Eastern Truku", "cells": ["=misu", "=saku", "=maku"]},
  ],
};

const paicCorpus: Record<string, CorpusRow[]> = {
  "paic-system": [
    {"label": "1sg", "cells": ["*=aku", "*=mu", "*aku", "*kənan", ""]},
    {"label": "2sg", "cells": ["*=su", "*=su", "*isu", "*sunan", ""]},
    {"label": "3sg", "cells": ["∅", "*=niya", "*hiya", "*hiyaan", ""]},
    {"label": "1pl.incl", "cells": ["*=ta", "*=ta", "*ita", "*tənan", ""]},
    {"label": "1pl.excl", "cells": ["*=ami", "*=miyan", "*ami", "*mənan"]},
    {"label": "2pl", "cells": ["*=imu", "*=mamu", "*imu", "*munan", ""]},
    {"label": "3pl", "cells": ["∅", "*=nəha", "*ləhəja", "*ləhəjaan", ""]},
  ],
  "paic-nom": [
    {"label": "PAic", "cells": ["*=aku", "*=su", "*=ta", "*=ami", "*=imu"]},
    {"label": "PAta", "cells": ["*=caku; (*=cu; *=ci)", "*=su", "*=ta", "*=cami", "*=cimu"]},
    {"label": "PSed", "cells": ["*=ku", "*=su", "*=ta", "*=nami", "*=namu"]},
  ],
  "paic-initial-c": [
    {"label": "1sg", "cells": ["*=caku", "*yaku"]},
    {"label": "1pl.excl", "cells": ["*=cami", "*yami"]},
    {"label": "2pl", "cells": ["*=cimu", "*yamu"]},
  ],
  "paic-gen": [
    {"label": "PAic", "cells": ["*=mu", "*=su", "*=niya", "*=ta", "*=miyan", "*=mamu", "*=nəha"]},
    {"label": "PAta", "cells": ["*=mu; (*=maku?)", "*=su", "*=niya", "*=ta", "*=miyan", "*=mamu", "*=nəha"]},
    {"label": "PSed", "cells": ["*=mu", "*=su", "*=na; *=niya", "*=ta", "*=nami", "*=namu", "*=dəha"]},
  ],
  "paic-neut": [
    {"label": "PAic", "cells": ["*aku", "*isu", "*hiya", "*ita", "*ami", "*imu", "*ləhəja"]},
    {"label": "PAta", "cells": ["*kuɹiŋ", "*isu", "*hiya", "*ita", "*cami", "*cimu", "*ləhəga; *ləha(?)"]},
    {"label": "PSed", "cells": ["*yaku", "*isu", "*hiya", "*ita", "*yami", "*yamu", "*dəhəya"]},
  ],
  "paic-obl": [
    {"label": "PAic", "cells": ["*kənan", "*sunan", "*hiyaan", "*tənan", "*mənan", "*munan", "*ləhəjaan"]},
    {"label": "PAta", "cells": ["*kənan", "*sunan", "*hiya-(a)n", "*ita-(a)n", "*cami-nan", "*cimu-nan", "*ləhəga-an"]},
    {"label": "PSed", "cells": ["*kənan", "*sunan", "*həyaan", "*tənan", "*mənan", "*munan", "*dəhəyaan"]},
  ],
  "paic-portmanteau": [
    {"label": "PAic", "cells": ["*=misu", "*=saku", "*=maku"]},
    {"label": "PAta", "cells": ["*=misu", "*=saku", "*=maku"]},
    {"label": "PSed", "cells": ["*=misu", "*=saku", "*=maku"]},
  ],
};

type CorpusPage = {
  id: string; title: string; source: string; indices: number[]; columns: string[];
  widths: number[]; rowHeader?: string; protoLabels?: string[]; cellDescriptions?: Record<string, string>; emphasis?: string[]; reflexSteps?: boolean; mergerLabels?: string[];
};

const atayalPages: CorpusPage[] = [
  { id: 'atayal-nom-1sg', title: '主格附著式：單數', source: 'pata-nom',
    indices: [0, 1], columns: ['1sg.nom', '2sg.nom'], widths: [18, 52, 15, 15], reflexSteps: true,
    mergerLabels: ['Squliq', "S'uli", "Matu'aw"], },
  { id: 'atayal-nom-plural', title: '主格附著式：複數', source: 'pata-nom',
    indices: [2, 3, 4], columns: ['1pl.incl.nom', '1pl.excl.nom', '2pl.nom'], widths: [18, 18, 30, 34],
    emphasis: ["B'ala:3", "B'ala:4", 'Plngawan:3', 'Plngawan:4'], },
  { id: 'atayal-neut-singular', title: '中性自由式：單數', source: 'pata-neut',
    indices: [0, 1, 2], columns: ['1sg.neut', '2sg.neut', '3sg.neut'], widths: [15, 49, 18, 18],
    emphasis: ['Skikun:0', 'Squliq:0', 'Klesan:0', 'Plngawan:0', "Matu'uwal:2"], },
  { id: 'atayal-neut-plural', title: '中性自由式：複數', source: 'pata-neut',
    indices: [3, 4, 5, 6], columns: ['1pl.incl.neut', '1pl.excl.neut', '2pl.neut', '3pl.neut'], widths: [15, 12, 17, 17, 39],
    emphasis: ['Squliq:6', "B'ala:6", "S'uli:6", "Matu'aw:6", 'Plngawan:6'], },
  { id: 'atayal-3pl-comparison', title: '第三人稱複數：中性與屬格', source: 'pata-neut-gen-3pl',
    indices: [0, 1], columns: ['3pl.neut', '3pl.gen'], widths: [18, 47, 35],
    emphasis: ['Squliq:0', "B'ala:0", "B'ala:1", "S'uli:0", "S'uli:1", "Matu'aw:0", 'Plngawan:0'], },
  { id: 'atayal-gen-singular', title: '屬格附著式：單數', source: 'pata-gen',
    indices: [0, 1, 2], columns: ['1sg.gen', '2sg.gen', '3sg.gen'], widths: [18, 38, 22, 22],
    emphasis: ['Squliq:0', 'Klesan:0', 'Plngawan:2'], },
  { id: 'atayal-gen-plural', title: '屬格附著式：複數', source: 'pata-gen',
    indices: [3, 4, 5, 6], columns: ['1pl.incl.gen', '1pl.excl.gen', '2pl.gen', '3pl.gen'], widths: [15, 13, 25, 19, 28],
    emphasis: ["Matu'uwal:4", 'Plngawan:4', "B'ala:5", "B'ala:6", "S'uli:6"], },
  { id: 'atayal-oblique', title: '斜格自由式', source: 'pata-obl',
    indices: [0, 1, 2, 3, 4, 5, 6], columns: ['1sg.obl', '2sg.obl', '3sg.obl', '1pl.incl.obl', '1pl.excl.obl', '2pl.obl', '3pl.obl'], widths: [13, 12, 12, 13, 13, 13, 12, 12],
    emphasis: ["B'ala:3", 'Plngawan:0', 'Plngawan:1', 'Squliq:6', "B'ala:6", 'Plngawan:6'], },
  { id: 'atayal-portmanteau', title: '融合式人稱代詞', source: 'pata-portmanteau',
    indices: [0, 1], columns: ['1sg.gen + 2sg.nom', '2sg.gen + 1sg.nom'], widths: [18, 41, 41],
    emphasis: ['Squliq:1', "B'ala:1", 'Plngawan:1'], },
];

function AtayalSubgroupingSlide() {
  return <SlideFrame id="atayal-subgrouping" eyebrow="第二節　原始泰雅語" title="泰雅語的分群">
    <div className="subgrouping-figure" dangerouslySetInnerHTML={{__html: atayalSubgroupingSvg}}/>
  </SlideFrame>;
}

const nominalReflexes: Record<string, Record<string, string>> = {
  PAta: { '*=cu': 'cu', '*=caku': 'caku', '*=ci': 'ci' },
  "Matu'uwal": { '=cu': 'cu', '=ci': 'ci' },
  Squliq: { '=saku': 'caku' },
  Skikun: { '=cu': 'cu' },
  Klesan: { '=cu': 'cu', '=caku': 'caku' },
  "S'uli": { '=si': 'ci' },
  Plngawan: { '=cu': 'cu' },
};

function CorpusSlide({ page, corpus = atayalCorpus, eyebrow = "第二節　原始泰雅語" }: { page: CorpusPage; corpus?: Record<string, CorpusRow[]>; eyebrow?: string }) {
  const rows = corpus[page.source];
  return <SlideFrame id={page.id} eyebrow={eyebrow} title={page.title}>
    <div className={`corpus-layout ${page.reflexSteps ? 'staged-singular' : ''} ${corpus === seediqCorpus ? 'seediq-corpus' : ''} ${corpus === paicCorpus ? 'paic-corpus' : ''} ${page.source === 'paic-system' ? 'system-corpus' : ''}`}>
      {page.reflexSteps && ['caku', 'ci', 'merger'].map((step, index) => <span key={step} className="fragment nom-step" data-step={step} data-fragment-index={index} aria-hidden="true"/>)}
      <table className={`corpus-table ${page.indices.length > 5 ? 'wide-table' : ''}`} data-source-table={page.source}>
        <colgroup>{page.widths.map((width, index) => <col key={index} style={{width: `${width}%`}}/>)}</colgroup>
        <thead><tr><th scope="col">{page.rowHeader ?? (corpus === paicCorpus ? '原始語' : '變體')}</th>{page.columns.map(column => <th key={column} scope="col">{column}</th>)}
          {page.mergerLabels && <th scope="col" className="merger-column"><LinguisticForm>*c, *s</LinguisticForm> 合流</th>}
        </tr></thead>
        <tbody>{rows.map(row => <tr key={row.label} data-variety={row.label} className={`${(page.protoLabels ?? (corpus === paicCorpus ? ['PAic'] : ['PAta', 'PSed', 'PSed · obl'])).includes(row.label) ? 'proto-row' : ''} ${page.mergerLabels?.includes(row.label) ? 'is-merger-row' : ''}`}>
          <th scope="row">{row.label}</th>
          {page.indices.map(index => <td key={index} className={page.emphasis?.includes(`${row.label}:${index}`) ? 'is-emphasized' : ''}>
            <LinguisticForm>{page.reflexSteps && index === 0 ? row.cells[index].split(/(;\s*)/).map((part, partIndex) => partIndex % 2 ? part : <span key={partIndex} data-reflex={nominalReflexes[row.label]?.[part.trim()]}>{part}</span>) : row.cells[index]}</LinguisticForm>
            {page.cellDescriptions?.[`${row.label}:${index}`] && <span className="cell-description">{page.cellDescriptions[`${row.label}:${index}`]}</span>}
          </td>)}
          {page.mergerLabels && <td className="merger-column">{page.mergerLabels.includes(row.label) && <span className="merger-check" aria-label="合流"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg></span>}</td>}
        </tr>)}</tbody>
      </table>
    </div>
  </SlideFrame>;
}

function PlngawanPortmanteauSlide() {
  const meanings = ['1sg.gen + 2sg.nom', '2sg.gen + 1sg.nom', '1sg.nom + 3sg.gen', '2sg.nom + 3sg.gen', '1pl.nom + 3sg.gen', '2pl.nom + 3sg.gen'];
  return <SlideFrame id="atayal-plngawan-portmanteau" eyebrow="第二節　原始泰雅語" title="Plngawan 的融合式">
    <div className="portmanteau-grid">{atayalCorpus['plngawan-portmanteau'][0].cells.map((form, index) => <div className={`portmanteau-card ${index > 1 ? 'is-emphasized' : ''}`} key={form}>
      <span>{meanings[index]}</span><LinguisticForm>{form}</LinguisticForm>
    </div>)}</div>
  </SlideFrame>;
}

const seediqPages: CorpusPage[] = [
  { id: 'seediq-nom', title: '主格附著式', source: 'psed-nom',
    indices: [0, 1, 2, 3, 4], columns: ['1sg.nom', '2sg.nom', '1pl.incl.nom', '1pl.excl.nom', '2pl.nom'], widths: [20, 12, 12, 14, 28, 14],
    emphasis: ['Tgdaya:3'], },
  { id: 'seediq-gen-singular', title: '屬格附著式：單數', source: 'psed-gen',
    indices: [0, 1, 2, 3], columns: ['1sg.gen', '2sg.gen', '3sg.gen · 短式', '3sg.gen · 長式'], widths: [20, 18, 18, 22, 22],
    emphasis: ['Tgdaya:3'], },
  { id: 'seediq-gen-plural', title: '屬格附著式：複數', source: 'psed-gen',
    indices: [4, 5, 6, 7], columns: ['1pl.incl.gen', '1pl.excl.gen', '2pl.gen', '3pl.gen'], widths: [20, 15, 29, 16, 20],
    emphasis: ['Tgdaya:5', 'Eastern Toda:7'], },
  { id: 'seediq-neut-singular', title: '中性自由式：單數', source: 'psed-neut',
    indices: [0, 1, 2], columns: ['1sg.neut', '2sg.neut', '3sg.neut'], widths: [22, 26, 26, 26],
    emphasis: ['Tgdaya:2'], },
  { id: 'seediq-neut-plural', title: '中性自由式：複數', source: 'psed-neut',
    indices: [3, 4, 5, 6], columns: ['1pl.incl.neut', '1pl.excl.neut', '2pl.neut', '3pl.neut'], widths: [20, 16, 18, 18, 28],
    emphasis: ['Tgdaya:6', 'Central Toda:6', 'Eastern Toda:6', 'Central Truku:6', 'Eastern Truku:6'], },
  { id: 'seediq-oblique-singular', title: '斜格自由式：單數', source: 'psed-obl',
    indices: [0, 1, 2], columns: ['1sg.obl', '2sg.obl', '3sg.obl'], widths: [22, 26, 26, 26],
    emphasis: ['Tgdaya:0', 'Tgdaya:1', 'Tgdaya:2'], },
  { id: 'seediq-oblique-plural', title: '斜格自由式：複數', source: 'psed-obl',
    indices: [3, 4, 5, 6], columns: ['1pl.incl.obl', '1pl.excl.obl', '2pl.obl', '3pl.obl'], widths: [20, 18, 18, 18, 26],
    emphasis: ['Tgdaya:3', 'Tgdaya:4', 'Tgdaya:5', 'Tgdaya:6'], },
  { id: 'seediq-oblique-origins', title: '斜格的來源：外部比較', source: 'psed-pan-obl', rowHeader: '語言／格位',
    indices: [0, 1, 2, 3, 4], columns: ['1sg', '2sg', '1pl.incl', '1pl.excl', '2pl'], widths: [20, 16, 16, 16, 16, 16], },
  { id: 'seediq-abpos-singular', title: '絕對所有格自由式：單數', source: 'psed-abpos',
    indices: [0, 1, 2], columns: ['1sg.abpos', '2sg.abpos', '3sg.abpos'], widths: [22, 29, 29, 20],
    emphasis: ['Tgdaya:0', 'Tgdaya:1', 'Eastern Truku:0', 'Eastern Truku:1'], },
  { id: 'seediq-abpos-plural', title: '絕對所有格自由式：複數', source: 'psed-abpos',
    indices: [3, 4, 5, 6], columns: ['1pl.incl.abpos', '1pl.excl.abpos', '2pl.abpos', '3pl.abpos'], widths: [20, 23, 17, 17, 23],
    emphasis: ['Tgdaya:3', 'Tgdaya:4', 'Tgdaya:5', 'Eastern Truku:3', 'Eastern Truku:4', 'Eastern Truku:5'], },
  { id: 'seediq-portmanteau', title: '融合式人稱代詞', source: 'psed-portmanteau-reflexes',
    indices: [0, 1, 2], columns: ['1sg.gen + 2sg.nom', '2sg.gen + 1sg.nom', '1sg.gen + 2pl.nom'], widths: [22, 26, 26, 26], },
];

function SeediqSubgroupingSlide() {
  return <SlideFrame id="seediq-subgrouping" eyebrow="第三節　原始賽德克語" title="賽德克語的分群">
    <div className="subgrouping-figure" dangerouslySetInnerHTML={{__html: seediqSubgroupingSvg.replace(/id="(title|desc)"/g, 'id="seediq-$1"').replace('aria-labelledby="title desc"', 'aria-labelledby="seediq-title seediq-desc"')}}/>
  </SlideFrame>;
}

function SeediqThirdPersonSlide() {
  return <SlideFrame id="seediq-third-person" eyebrow="第三節　原始賽德克語" title="第三人稱單、複數">
    <div className="third-person-comparison">
      <div><h3>Tgdaya <span>類推整平</span></h3><div className="form-pair"><span>3sg</span><LinguisticForm>*hiya → <strong>heya</strong></LinguisticForm></div><div className="form-pair"><span>3pl</span><LinguisticForm>*dəhəya → deheya</LinguisticForm></div></div>
      <div><h3>Toda-Truku <span>規則音變</span></h3><div className="form-pair"><span>3sg</span><LinguisticForm>*hiya → hiya</LinguisticForm></div><div className="form-pair"><span>3pl</span><LinguisticForm>*dəhəya → <strong>dəhiya</strong></LinguisticForm></div></div>
    </div>
  </SlideFrame>;
}

const paicPages: CorpusPage[] = [
  { id: 'paic-system', title: '共同祖語的四套基本範式', source: 'paic-system', rowHeader: '人稱',
    indices: [0, 1, 2, 3], columns: ['主格附著式', '屬格附著式', '中性自由式', '斜格自由式'], widths: [17, 18, 20, 20, 25], },
  { id: 'paic-nom', title: '主格附著式：兩個分支的比較', source: 'paic-nom',
    indices: [0, 1, 2, 3, 4], columns: ['1sg.nom', '2sg.nom', '1pl.incl.nom', '1pl.excl.nom', '2pl.nom'], widths: [12, 38, 12, 12, 13, 13],
    emphasis: ['PAta:0', 'PAta:3', 'PAta:4', 'PSed:0', 'PSed:3', 'PSed:4'], },
  { id: 'paic-initial-c', title: '詞首 c 與 y：比較同源詞基', source: 'paic-initial-c', rowHeader: '人稱',
    indices: [0, 1], columns: ['PAta · nom', 'PSed · neut'], widths: [20, 40, 40], },
  { id: 'paic-gen-singular', title: '屬格附著式：直接的對應', source: 'paic-gen',
    indices: [0, 1, 2, 3], columns: ['1sg.gen', '2sg.gen', '3sg.gen', '1pl.incl.gen'], widths: [14, 38, 14, 22, 12],
    emphasis: ['PAta:0', 'PSed:2'], },
  { id: 'paic-gen-plural', title: '屬格附著式：複數的重整', source: 'paic-gen',
    indices: [4, 5, 6], columns: ['1pl.excl.gen', '2pl.gen', '3pl.gen'], widths: [16, 28, 28, 28],
    emphasis: ['PSed:4', 'PSed:5', 'PSed:6'], },
  { id: 'paic-neut-singular', title: '中性自由式：單數', source: 'paic-neut',
    indices: [0, 1, 2], columns: ['1sg.neut', '2sg.neut', '3sg.neut'], widths: [16, 40, 22, 22],
    emphasis: ['PAta:0', 'PSed:0'], },
  { id: 'paic-neut-plural', title: '中性自由式：複數', source: 'paic-neut',
    indices: [3, 4, 5, 6], columns: ['1pl.incl.neut', '1pl.excl.neut', '2pl.neut', '3pl.neut'], widths: [14, 13, 16, 16, 41],
    emphasis: ['PAta:4', 'PAta:5', 'PSed:4', 'PSed:5', 'PAta:6', 'PSed:6'], },
  { id: 'paic-oblique-singular', title: '斜格自由式：單數', source: 'paic-obl',
    indices: [0, 1, 2], columns: ['1sg.obl', '2sg.obl', '3sg.obl'], widths: [16, 28, 28, 28],
    emphasis: ['PAta:2', 'PSed:2'], },
  { id: 'paic-oblique-plural', title: '斜格自由式：複數', source: 'paic-obl',
    indices: [3, 4, 5, 6], columns: ['1pl.incl.obl', '1pl.excl.obl', '2pl.obl', '3pl.obl'], widths: [14, 22, 22, 22, 20],
    emphasis: ['PAta:3', 'PAta:4', 'PAta:5', 'PAta:6'], cellDescriptions: {'PAta:6': '倒轉重建'}, },
  { id: 'paic-portmanteau', title: '融合式', source: 'paic-portmanteau',
    indices: [0, 1, 2], columns: ['1sg.gen + 2sg.nom', '2sg.gen + 1sg.nom', '1sg.gen + 2pl.nom'], widths: [16, 28, 28, 28],
    emphasis: ['PAta:2'], cellDescriptions: {'PAta:2': '功能：1sg.gen'}, },
];

type BranchHistoryPage = {
  id: string; title: string; ancestor: ReactNode; ancestorLabel: string;
  branches: { label: string; form: ReactNode; detail: string }[];
};

function BranchHistorySlide({ page }: { page: BranchHistoryPage }) {
  return <SlideFrame id={page.id} eyebrow="第四節　原始泰雅－賽德克語" title={page.title}>
    <div className="branch-history">
      <div className="history-ancestor"><span>{page.ancestorLabel}</span><LinguisticForm>{page.ancestor}</LinguisticForm></div>
      <div className="history-descendants fragment fade-in" data-fragment-index="0">
        <svg viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true"><path d="M600 0V22 M600 22L280 78 M600 22L920 78 M291 68L280 78L294 82 M906 82L920 78L909 68"/></svg>
        <div className="history-branches">{page.branches.map(branch => <div className="history-branch" key={branch.label}><h3>{branch.label}</h3><LinguisticForm>{branch.form}</LinguisticForm><p>{branch.detail}</p></div>)}</div>
      </div>
    </div>
  </SlideFrame>;
}

const paicBranchPages: Record<string, BranchHistoryPage> = {
  nominal: { id: 'paic-nom-history', title: '第一人稱單數主格：插入與縮略', ancestorLabel: 'PAic · 1sg.nom', ancestor: '*=aku',
    branches: [
      { label: 'PAta', form: <><strong>*=caku</strong><br/>*=cu / *=ci</>, detail: '插入 c，再產生短變體' },
      { label: 'PSed', form: <strong>*=ku</strong>, detail: '趨向跟 *=su 的音節數一致' },
    ], },
  thirdPlural: { id: 'paic-third-plural', title: '第三人稱複數：重建 *j', ancestorLabel: 'PAic · 3pl.neut', ancestor: '*ləhəja',
    branches: [
      { label: 'PAta', form: <strong>*ləhəga</strong>, detail: '*j 與 *g 合流；保留 *l-' },
      { label: 'PSed', form: <strong>*dəhəya</strong>, detail: '*j 與 *y 合流；*l > d 為不規則變化' },
    ], },
  maku: { id: 'paic-maku-history', title: '*=maku：融合功能的消退', ancestorLabel: 'PAic · 1sg.gen + 2pl.nom', ancestor: '*=maku',
    branches: [
      { label: 'PAta · 1sg.gen', form: <><strong>*=maku</strong> ～ *=mu</>, detail: '失去 2pl.nom 語意，與 *=mu 功能重疊' },
      { label: 'PSed · 1sg.gen + 2pl.nom', form: <strong>*=maku</strong>, detail: '保存形式與融合功能' },
    ], },
};

function PaicExpansionSlide() {
  return <SlideFrame id="paic-plural-expansion" eyebrow="第四節　原始泰雅－賽德克語" title="複數：所有格進入屬格，再到主格">
    <ChangeSequence steps={[
      { title: '絕對所有格', form: <LinguisticForm>*nami<br/>*namu</LinguisticForm>, description: '領屬形式提供來源' },
      { title: '取代屬格', form: <LinguisticForm>*=nami<br/>*=namu</LinguisticForm>, description: <>取代較早的<br/><LinguisticForm>*=miyan / *=mamu</LinguisticForm></> },
      { title: '擴張至主格', form: <LinguisticForm>*=nami<br/>*=namu</LinguisticForm>, description: '主格、屬格同形' },
    ]}/>
  </SlideFrame>;
}

function PaicFirstSingularSlide() {
  return <SlideFrame id="paic-neut-history" eyebrow="第四節　原始泰雅－賽德克語" title="第一人稱單數中性式：兩種新增成分">
    <div className="third-person-comparison paic-origin-comparison">
      <div><h3>PAta <span>可能的男性語域後綴</span></h3><LinguisticForm>*aku + *-ɹiŋ<br/>↓<br/><strong>*kuɹiŋ</strong></LinguisticForm></div>
      <div className="fragment fade-in" data-fragment-index="0"><h3>PSed <span>表人主格標記固化</span></h3><LinguisticForm>*i + *aku<br/>↓<br/><strong>*yaku</strong></LinguisticForm></div>
    </div>
  </SlideFrame>;
}

function PaicVowelLevelingSlide() {
  return <SlideFrame id="paic-vowel-leveling" eyebrow="第四節　原始泰雅－賽德克語" title="第二人稱複數：*imu 還是 *amu？">
    <ChangeSequence steps={[
      { title: 'PAic', form: <LinguisticForm>*ami<br/><strong>*imu</strong></LinguisticForm>, description: '1pl.excl ／ 2pl' },
      { title: '元音整平', form: <LinguisticForm>*ami<br/><strong>*amu</strong></LinguisticForm>, description: '*imu 可能向 *ami 類推' },
      { title: '*i- 固化', form: <LinguisticForm>*yami<br/><strong>*yamu</strong></LinguisticForm>, description: 'PSed 中性自由式' },
    ]}/>
  </SlideFrame>;
}

function PaicReversedReconstructionSlide() {
  return <SlideFrame id="paic-reversed-reconstruction" eyebrow="第四節　原始泰雅－賽德克語" title="第三人稱複數斜格：倒轉重建">
    <div className="analysis-tag">倒轉重建</div>
    <ChangeSequence steps={[
      { title: 'PAic · 中性', form: <LinguisticForm>*ləhəja</LinguisticForm>, description: '兩分支比較的基礎' },
      { title: 'PAic · 斜格', form: <LinguisticForm>*ləhəjaan</LinguisticForm>, description: <>類比加入 <LinguisticForm>*-an</LinguisticForm></> },
      { title: 'PAta · 斜格', form: <LinguisticForm>*ləhəga-an</LinguisticForm>, description: '以共同祖語與系統證據倒推' },
    ]}/>
  </SlideFrame>;
}

function PaicSlides() {
  return <>
    <SectionSlide id="paic-section" eyebrow="第四節" title={<>原始泰雅－賽德克語<br/>人稱代詞系統</>}/>
    {paicPages.map(page => <React.Fragment key={page.id}>
      <CorpusSlide page={page} corpus={paicCorpus} eyebrow="第四節　原始泰雅－賽德克語"/>
      {page.id === 'paic-initial-c' && <BranchHistorySlide page={paicBranchPages.nominal}/>}
      {page.id === 'paic-gen-plural' && <PaicExpansionSlide/>}
      {page.id === 'paic-neut-singular' && <PaicFirstSingularSlide/>}
      {page.id === 'paic-neut-plural' && <><PaicVowelLevelingSlide/><BranchHistorySlide page={paicBranchPages.thirdPlural}/></>}
      {page.id === 'paic-oblique-plural' && <PaicReversedReconstructionSlide/>}
      {page.id === 'paic-portmanteau' && <BranchHistorySlide page={paicBranchPages.maku}/>}
    </React.Fragment>)}
  </>;
}

const contactPlaces: Place[] = [...places,
  { id: 'sqoyaw', language: 'Atayal', group: 'Northern Atayal', name: 'Sqoyaw', coordinates: [24.313951, 121.295335], color: '#5274A2' },
  { id: 'pazeh', language: 'Pazeh', group: 'Pazeh', name: '巴宰語', coordinates: [24.343078, 120.765874], color: '#8C683D' },
];

type ContactCase = {
  id: string; title: string; initialIds: string[]; kind: string;
  routeIds?: readonly string[];
  evidence: { label: string; form: string; detail?: string }[];
  takeaway: string;
};

const contactCases: ContactCase[] = [
  { id: 'discussion-pattern', title: '接觸導致範式關係改變', initialIds: ['bala', 'plngawan', 'tgdaya'], kind: '範式關係借用',
    evidence: [
      { label: "B'ala · 1pl.excl / 2pl", form: '=myen / =mamu', detail: '屬格 → 主格' },
      { label: 'Plngawan · 1pl.excl / 2pl', form: '=min / =mamu', detail: '屬格 → 主格' },
      { label: 'Tgdaya · 模型', form: '=nami / =namu', detail: '主格、屬格同形' },
    ], takeaway: '沿用自己的詞形，擴張範式位置', },
  { id: 'discussion-form', title: '借入詞形，再納入自己的範式', initialIds: [...places.filter(p => p.language === 'Atayal').map(p => p.id), 'tgdaya'], kind: '可能的詞形借用',
    evidence: [
      { label: '泰雅語 · 1pl.excl.gen', form: '=myan', detail: '借入來源的比較形式' },
      { label: 'Tgdaya · 借入形式', form: '=miyan', detail: '屬格 ＋ 主格' },
      { label: 'Tgdaya · 既有形式', form: '=nami', detail: '屬格 ＋ 主格' },
    ], takeaway: '形式來自接觸，功能由接收語言重整', },
  { id: 'discussion-eastern-toda', title: 'Eastern Toda：遷徙與接觸', initialIds: ['central-toda', 'eastern-toda', 'sqoyaw', 'klesan'], routeIds: ['central-toda', 'sqoyaw', 'eastern-toda'], kind: '可能的形式借用',
    evidence: [
      { label: 'PSed · 3pl.gen', form: '*=dəha' },
      { label: 'E. Toda · 特殊形式', form: '=nəha' },
      { label: '泰雅語 · 比較形式', form: '=nəha' },
    ], takeaway: '偏離規則對應 ＋ 接觸史', },
  { id: 'discussion-matuuwal', title: "Matu'uwal：與巴宰語的接觸？", initialIds: ['matuuwal', 'pazeh'], kind: '可能的形式借用／改造',
    evidence: [
      { label: 'PAta · 1pl.excl.gen', form: '*=miyan' },
      { label: "Matu'uwal", form: '=niyam' },
      { label: '巴宰語 · 1pl.excl.gen', form: 'niam' },
    ], takeaway: '音段次序異常 ＋ 接觸史', },
  { id: 'discussion-oblique', title: '接觸強化特定類別的保存', initialIds: ['squliq', 'bala', 'plngawan', 'tgdaya', 'central-toda', 'central-truku'], kind: '可能的保存強化',
    evidence: [
      { label: 'Squliq / B\'ala / Plngawan', form: '斜格', detail: '仍保留獨立的代詞類別' },
      { label: "B'ala · 1pl.incl.obl", form: 'ətanan' },
      { label: '賽德克語 · 比較形式', form: 'tənan' },
    ], takeaway: '類別保存可能受接觸支持', },
  { id: 'discussion-oblique-model', title: '複數斜格：是內部類推還是與巴宰語接觸？', initialIds: ['squliq', 'bala', 'plngawan', 'pazeh'], kind: '可能的構詞模型',
    evidence: [
      { label: 'PAta · 複數斜格', form: '*ita-(a)n\n*cami-nan\n*cimu-nan' },
      { label: '巴宰語 · 斜格／方位格', form: 'itaan\nyamian ~ yaminan\nimuan ~ imunan' },
    ], takeaway: '中性式 ＋ -an／-nan', },
  { id: 'discussion-diffusion', title: '區域擴散可以跨越親緣分群', initialIds: ['matuuwal', 'matuaw', 'suli'], kind: '泰雅語內部的區域擴散',
    evidence: [
      { label: "Matu'uwal · 1sg.nom", form: '=kuŋ' },
      { label: "Matu'aw · 1sg.nom", form: '=kuŋ; =kuyiŋ' },
      { label: "S'uli · 1sg.nom", form: '=kuŋ; =kuziŋ' },
    ], takeaway: '地理同言線 ≠ 親緣分群', },

];

function ContactMapSlide({ item, active, layoutVersion }: { item: ContactCase; active: boolean; layoutVersion: number }) {
  const [visited, setVisited] = useState(active);
  const [visibleIds, setVisibleIds] = useState(item.initialIds);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  useEffect(() => { if (active) setVisited(true); }, [active]);
  useEffect(() => { setVisibleIds(item.initialIds); setHighlightedIds([]); }, [item.initialIds]);
  const toggleMembers = (ids: string[]) => {
    setVisibleIds(current => ids.every(id => current.includes(id)) ? current.filter(id => !ids.includes(id)) : [...new Set([...current, ...ids])]);
    setHighlightedIds([]);
  };
  const select = (id: string) => setHighlightedIds(current => current.includes(id) ? [] : [id]);
  const visibleGroups = [...new Set(contactPlaces.filter(p => visibleIds.includes(p.id)).map(p => p.group))];
  return <SlideFrame id={item.id} eyebrow="第五節　討論" title={item.title}>
    <div className="contact-layout">
      {visited ? <DistributionMap collection={contactPlaces} focusIds={visibleIds} active={active} layoutVersion={layoutVersion}
        visibleIds={visibleIds} visibleGroups={visibleGroups} highlightedIds={highlightedIds} labelMode="name" routeIds={item.routeIds} onSelect={select}/> : <div className="contact-map-placeholder"/>}
      <div className="contact-evidence">
        <div className="contact-kind">{item.kind}</div>
        <div className="contact-forms">{item.evidence.map(row => <div className="contact-form" key={row.label}>
          <h3>{row.label}</h3><LinguisticForm>{row.form}</LinguisticForm>{row.detail && <p>{row.detail}</p>}
        </div>)}</div>
        <p className="contact-takeaway">{item.takeaway}</p>
        <div className="selection-tools" onKeyDown={event => event.stopPropagation()}>
          <button onClick={() => { setVisibleIds(contactPlaces.map(p => p.id)); setHighlightedIds([]); }}>全選</button>
          <button onClick={() => { setVisibleIds([]); setHighlightedIds([]); }}>取消全選</button>
          <button onClick={() => { setVisibleIds(item.initialIds); setHighlightedIds([]); }}>恢復本頁</button>
        </div>
      </div>
      <MapLegend collection={contactPlaces} visibleIds={visibleIds} highlightedIds={highlightedIds} onSelect={select}
        onLanguageToggle={language => toggleMembers(contactPlaces.filter(p => p.language === language).map(p => p.id))}
        onGroupToggle={group => toggleMembers(contactPlaces.filter(p => p.group === group).map(p => p.id))}
        onVisibilityToggle={id => { toggleMembers([id]); }}/>
    </div>
  </SlideFrame>;
}

function DiscussionSlides({ activeId, layoutVersion }: { activeId: string; layoutVersion: number }) {
  return <>
    <SectionSlide id="discussion-section" eyebrow="第五節" title="討論"/>
    <SlideFrame id="discussion-innovation" eyebrow="第五節　討論" title="範式整齊源自多次創新">
      <div className="discussion-chain"><ChangeSequence steps={[
        { title: '中性式重整', form: <LinguisticForm>*ami / *imu<br/>↓<br/>*yami / *yamu</LinguisticForm>, description: '元音整平、*i 固化' },
        { title: '絕對所有格', form: <LinguisticForm>*nami<br/>*namu</LinguisticForm>, description: '*n-／*na- ＋ 代詞基底' },
        { title: '取代屬格', form: <LinguisticForm>*=nami<br/>*=namu</LinguisticForm>, description: <>取代 <LinguisticForm>**=miyan<br/>**=mamu</LinguisticForm></> },
        { title: '擴張至主格', form: <LinguisticForm>*=nami<br/>*=namu</LinguisticForm>, description: '主格、屬格同形' },
      ]}/></div>
    </SlideFrame>
    <SlideFrame id="discussion-leveling" eyebrow="第五節　討論" title="不同歷史階段的範式整平">
      <div className="third-person-comparison paic-origin-comparison">
        <div><h3>PSed 分化前<span>模型：3pl.neut</span></h3><LinguisticForm>*dəhəya<br/><br/><strong>**=nəha → *=dəha</strong></LinguisticForm></div>
        <div className="fragment fade-in" data-fragment-index="0"><h3>Tgdaya 分化後<span>模型：3pl.neut</span></h3><LinguisticForm>deheya<br/><br/><strong>**hiya → heya</strong></LinguisticForm></div>
      </div>
    </SlideFrame>
    {contactCases.map(item => <ContactMapSlide key={item.id} item={item} active={activeId === item.id} layoutVersion={layoutVersion}/>)}
  </>;
}

const bibliography = [
  { id: 'goderich2020', author: 'Goderich, Andre', year: '2020', title: 'Atayal phonology, reconstruction, and subgrouping', publication: 'PhD dissertation, National Tsing Hua University.' },
  { id: 'goderich2024b', author: 'Goderich, Andre', year: '2024', title: 'Dialectal distinctions in Plngawan Atayal: Current state and history', publication: 'Concentric: Studies in Linguistics 50(1): 57–88.' },
  { id: 'goderich2025a', author: 'Goderich, Andre', year: '2025', title: 'Formosan loanwords in four Atayal dialects', publication: 'Concentric: Studies in Linguistics 51(1): 32–69.' },
  { id: 'huang1995', author: 'Huang, Lillian M.', year: '1995', title: 'A Study of Mayrinax Syntax', publication: 'Taipei: The Crane Publishing Co., Ltd.' },
  { id: 'huang2015', author: 'Huang, Hui-chuan J.', year: '2015', title: 'Syllable Types in Bunun, Saisiyat, and Atayal', publication: 'New Advances in Formosan Linguistics, 47–74. Asia-Pacific Linguistics.' },
  { id: 'huang2018a', author: "Huang, Lillian M. & Tali' Hayung", year: '2018', title: 'An introduction to Atayal grammar', publication: '2nd ed. New Taipei City: Council of Indigenous Peoples.' },
  { id: 'lee2015tawsa', author: 'Lee, Amy Pei-jung', year: '2015', title: 'Contact-induced sub-dialects in Toda Seediq', publication: 'Papers from 12-ICAL, Vol. 3: Language change in Austronesian languages, 93–107. ANU Press.' },
  { id: 'Lee2018Trugrammar', author: 'Lee, Amy Pei-jung & Lowking Nowbucyang', year: '2018', title: '太魯閣語語法概論', publication: 'New Taipei: Council of Indigenous Peoples.' },
  { id: 'li1980a', author: 'Li, Paul Jen-kuei', year: '1980', title: "Men's and women's speech in Mayrinax", publication: "Papers in Honor of Professor Lin Yu-k'eng on Her Seventieth Birthday, 9–17. Wen Shin Publishing." },
  { id: 'li1982a', author: 'Li, Paul Jen-kuei', year: '1982', title: 'Male and Female Forms of Speech in the Atayalic Group', publication: 'Bulletin of the Institute of History and Philology, Academia Sinica 53: 265–304.' },
  { id: 'li1983', author: 'Li, Paul Jen-kuei', year: '1983', title: "Types of Lexical Derivation of Men's Speech in Mayrinax", publication: 'Bulletin of the Institute of History and Philology, Academia Sinica 54(3): 1–18.' },
  { id: 'li1985', author: 'Li, Paul Jen-kuei', year: '1985', title: 'Linguistic Criteria for Classifying the Atayalic Dialect Groups', publication: 'Bulletin of the Institute of History and Philology, Academia Sinica 56(4): 699–718.' },
  { id: 'li-tsuchida2001', author: 'Li, Paul Jen-kuei & Shigeru Tsuchida', year: '2001', title: 'Pazih Dictionary', publication: 'Taipei: Institute of Linguistics, Academia Sinica.' },
  { id: 'limzeitoun2024', author: 'Lim, Hong-sui & Elizabeth Zeitoun', year: '2024', title: 'Pazeh-Kaxabu', publication: 'Handbook of Formosan languages: The indigenous languages of Taiwan, Vol. 3, 329–363. Brill.' },
  { id: 'ogawa1935', author: 'Ogawa, Naoyoshi & Erin Asai', year: '1935', title: 'The Myths and Traditions of the Formosan Native Tribes', publication: 'Taipei: Institute of Linguistics, Taihoku Imperial University.' },
  { id: 'rau2004', author: 'Rau, Der-Hwa Victoria', year: '2004', title: 'Lexical Similarity, Sound Change and Intelligibility of Atayalic Dialects', publication: 'Papers on Austronesian Subgrouping and Dialectology, 37–96. Australian National University.' },
  { id: 'ross2006', author: 'Ross, Malcolm', year: '2006', title: 'Reconstructing the Case-Marking and Personal Pronoun Systems of Proto Austronesian', publication: 'Streams Converging into an Ocean, 521–563. Institute of Linguistics, Academia Sinica.' },
  { id: 'ross2015b', author: 'Ross, Malcolm', year: '2015', title: 'Revising the reconstruction of early Austronesian personal pronouns', publication: 'Language change in Austronesian languages: Papers from 12-ICAL, Vol. 3, 109–121. Australian National University.' },
  { id: 'song2023Aicgprime', author: 'Song, Walis Hian-chi', year: '2023', title: 'Deconstructing Proto-Atayalic *g’', publication: 'SEALS 32, Chiang Mai University, Chiang Mai, Thailand.' },
  { id: 'song2025', author: 'Song, Walis Hian-chi', year: '2025', title: 'Eluw Ndaan Kari Seediq (The Historical Development of the Seediq Language)', publication: 'MA thesis, National Tsing Hua University.' },
  { id: 'Sung2018Sedgrammar', author: 'Sung, Li-may', year: '2018', title: '賽德克語語法概論', publication: 'New Taipei: Council of Indigenous Peoples.' },
  { id: 'teng2015', author: 'Teng, Stacy F.', year: '2015', title: 'A Comparative Study of the Personal Pronominal Systems in Three Puyuma Dialects', publication: 'New Advances in Formosan Linguistics, 407–429. Asia-Pacific Linguistics.' },
  { id: 'wu2015', author: 'Wu, Joy J.', year: '2015', title: 'Amis Personal Pronouns Revisited', publication: 'New Advances in Formosan Linguistics, 385–406. Asia-Pacific Linguistics.' },
];
const referencePages = [bibliography.slice(0, 8), bibliography.slice(8, 16), bibliography.slice(16)];

function ClosingSlides() {
  return <>
    <SlideFrame id="conclusion" eyebrow="第六節" title="結論">
      <ul className="conclusion-points">
        <li><strong>共同祖語：兩套附著式、兩套自由式、三個融合式。</strong><span>賽德克語的絕對所有格是分支內創新。</span></li>
        <li><strong>共時的整齊，可能來自歷時的整平與取代。</strong><span>泰雅語保留多形式競爭；賽德克語經過多階段重整。</span></li>
        <li><strong>接觸可以傳遞詞形，也可以傳遞範式關係。</strong><span>借入成分的功能，會依接收語言的系統重新配置。</span></li>
      </ul>
    </SlideFrame>
    {referencePages.map((entries, index) => <SlideFrame key={index} id={index ? `references-${index + 1}` : 'references'} eyebrow={`參考文獻　${index + 1} / ${referencePages.length}`} title="參考文獻">
      <div className="reference-grid">{[entries.slice(0, 4), entries.slice(4)].map((column, columnIndex) => <div className="reference-column" key={columnIndex}>
        {column.map(entry => <article className="reference-entry" data-reference-id={entry.id} key={entry.id}>
          <h3>{entry.author}{entry.author.endsWith('.') ? '' : '.'} {entry.year}.</h3><p className="reference-title">{entry.title}.</p><p className="reference-publication">{entry.publication}</p>
        </article>)}
      </div>)}</div>
    </SlideFrame>)}
    <SlideFrame id="thanks" dark hidePageNumber>
      <div className="thanks-message"><div className="thanks-forms">
        <LinguisticForm>Mhuwe namu bale! <span className="thanks-language">(Tgdaya Seediq)</span></LinguisticForm>
        <LinguisticForm>Bahbah cimu caṟung! <span className="thanks-language">(Plngawan Itaṟal)</span></LinguisticForm>
        <LinguisticForm>Mahuway cimu cubalay! <span className="thanks-language">(Matu'uwal Itaal)</span></LinguisticForm>
      </div></div>
    </SlideFrame>
  </>;
}

function App() {
  const [activeId, setActiveId] = useState('cover');
  const [layoutVersion, setLayoutVersion] = useState(0);
  return <Deck config={config}
    onReady={deck => { setActiveId(deck.getCurrentSlide()?.id ?? 'cover'); setLayoutVersion(v => v + 1); }}
    onSlideChange={event => setActiveId((event as Event & { currentSlide: HTMLElement }).currentSlide.id)}
    onSlideTransitionEnd={() => setLayoutVersion(v => v + 1)}>
    <TitleSlide/>
    {demoMode ? <>
      <ComparisonSlide/><InnovationSlide/>
      <DistributionSlide active={activeId === 'distribution'} layoutVersion={layoutVersion} showForms/>
    </> : <>
      <IntroductionSlide/><ResearchQuestionsSlide/><ResearchMethodsSlide/>
      <DistributionSlide active={activeId === 'distribution'} layoutVersion={layoutVersion}/>
      <SectionSlide id="atayal-section" eyebrow="第二節" title="原始泰雅語人稱代詞系統"/>
      <AtayalSubgroupingSlide/>
      {atayalPages.map(page => <CorpusSlide key={page.id} page={page}/>)}
      <PlngawanPortmanteauSlide/>
      <SectionSlide id="seediq-section" eyebrow="第三節" title="原始賽德克語人稱代詞系統"/>
      <SeediqSubgroupingSlide/>
      {seediqPages.map(page => <React.Fragment key={page.id}>
        <CorpusSlide page={page} corpus={seediqCorpus} eyebrow="第三節　原始賽德克語"/>
        {page.id === 'seediq-neut-plural' && <SeediqThirdPersonSlide/>}
      </React.Fragment>)}
      <PaicSlides/>
      <DiscussionSlides activeId={activeId} layoutVersion={layoutVersion}/>
      <ClosingSlides/>
    </>}
  </Deck>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
