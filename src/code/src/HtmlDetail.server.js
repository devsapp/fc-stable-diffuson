

import { fetch } from 'react-fetch';
const React = require('react');
const cheerio = require('cheerio');

export default function HtmlDetail() {

  const proxyUrl = process.env.proxyUrl || ''

  const text = fetch(proxyUrl).text()
  const $ = cheerio.load(text);
  const bodyContent = $('body').html();
  const scriptcontent = `${bodyContent}`


  return <span dangerouslySetInnerHTML={{ __html: scriptcontent }}></span>
}
