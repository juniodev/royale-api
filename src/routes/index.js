const router = require('express').Router()
const cheerio = require('cheerio')
const axios = require('axios')

const { findDecksClan } = require('../controllers/find-decks-clan.js')

const { z } = require('zod')

const url = 'https://royaleapi.com/clan/'

const schema = z.object({
	tag: z.string({
		required_error: 'tag is not empty'
	}).trim()
})

router.get('/clan/decks/:tag', findDecksClan)

router.get('/clan/details/:tag', async (req, res) => {
	
	try {
	
		const { tag } = await schema.parseAsync(req.params)
	  
	  const { data } = await axios.get(`${url}${tag}`)
	  
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
	        tag,
	        title: title.trim(),
	        description,
	        img: img.attr('src'),
	        war_trophies: war_trophies.filter(Boolean)[2],
	        details: info
	      },
	      users
	    }
	  )
	} catch (e) {
		if (e instanceof z.ZodError) {
			return res.status(400).json({
				message: error.issues[0].message
			})
		}
		return res.status(500).json({
			message: 'Unknown error, try again.'
		})
	}
  
})

module.exports = router