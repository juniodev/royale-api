const router = require('express').Router()
const cheerio = require('cheerio')
const axios = require('axios')

const url = 'https://royaleapi.com/clan/QGV2R889'

router.get('/', async (req, res) => {
  
  const { data } = await axios.get(url)
  
  const $ = cheerio.load(data)
  
  const users = []
  
  const members = $('.tr_member')
  
  members.each((i, e) => {
    
    const $users = $(e).find('.mobile-hide input')
    
    const member = $users.attr('data-name')
    
    const type = $(e).find('.meta')
    
    const tag = $(e).find('a').attr('data-tag')
    
    const last_access = $(e).find('.last_seen').text()
    
    const arena_icon = $(e).find('.arena_icon')
    
    const donations = $(e).find(
      '.mobile-member-summary'
    ).text().trim().split(' ')
    
    
    
    const tr = $(`[data-tag="${tag}"]`)
  	const trophies = $(tr[0]).find('[class=""]')
    
   /*trophies.each((i, td) => {
    	console.log($(td).text())
    })*/
    
    users.push({
      index: i,
      name: member,
      tag: `#${tag}`,
      trophies: trophies.text().trim(),
      donations: donations[0],
      type: type.text().replace(/[\s\n]/g, ''),
      last_access: last_access.replace('ago', '').trim(),
      arena_icon: arena_icon.attr('src')
    })
  })
  
  const title = $('h1').text()
  
  const $cla = $(
    '.content_container .column .content'
  )
  
  const info = []
 
  $cla.each((i, e) => {
   
    info.push({
     title: $(e).find('h5').text(),
     value: $(e).find('.value').text()
    })
  })
  
  const img = $('.ui.floated.tiny.right.image')
  
  const description = $('meta[name="description"]').attr('content')
  
  const war_trophies = $('.ui.horizontal.list').text().replace(/\n/g, '').trim().split(' ')
  
  return res.status(200).json(
    {
      cla_info: {
        tag: '#QYGL8VJU',
        title: title.trim(),
        description,
        img: img.attr('src'),
        war_trophies: war_trophies.filter(Boolean)[2],
        details: info
      },
      users
    }
  )
  
})

module.exports = router